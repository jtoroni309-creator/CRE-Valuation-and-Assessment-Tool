/**
 * Authentication and authorization middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { Permission } from '../types';
import logger from '../utils/logger';

export interface JwtPayload {
  userId: string;
  tenantId: string;
  email: string;
  permissions: Permission[];
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      tenantId?: string;
    }
  }
}

/**
 * Verify JWT token and attach user to request
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      logger.error('JWT_SECRET not configured');
      throw new Error('Authentication configuration error');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Attach user to request
    req.user = decoded;
    req.tenantId = decoded.tenantId;

    // Set tenant ID header for downstream services
    res.setHeader('X-Tenant-ID', decoded.tenantId);

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
}

/**
 * Check if user has required permissions
 */
export function authorize(...requiredPermissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    const userPermissions = req.user.permissions || [];

    const hasPermission = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return next(
        new AuthorizationError(
          `Missing required permissions: ${requiredPermissions.join(', ')}`
        )
      );
    }

    next();
  };
}

/**
 * Optional authentication - attach user if token present, but don't fail
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return next();
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    req.tenantId = decoded.tenantId;
  } catch (error) {
    // Silently fail - token invalid but that's ok for optional auth
    logger.debug({ error }, 'Optional auth failed');
  }

  next();
}

/**
 * Generate JWT token
 */
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m';

  if (!secret) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(payload, secret, {
    expiresIn,
    issuer: process.env.JWT_ISSUER || 'axxiom-platform',
    audience: process.env.JWT_AUDIENCE || 'axxiom-api',
  });
}

/**
 * Verify token without throwing
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    return null;
  }
}
