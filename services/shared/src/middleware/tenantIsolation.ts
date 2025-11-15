/**
 * Multi-tenant isolation middleware
 */

import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Ensure tenant ID is present and consistent across request
 */
export function enforceTenantIsolation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tenantIdFromToken = req.user?.tenantId;
  const tenantIdFromHeader = req.headers['x-tenant-id'] as string;

  // Require authenticated user for tenant isolation
  if (!tenantIdFromToken) {
    return next(new AuthenticationError('Tenant context required'));
  }

  // If tenant ID in header, verify it matches token
  if (tenantIdFromHeader && tenantIdFromHeader !== tenantIdFromToken) {
    logger.warn(
      {
        tokenTenant: tenantIdFromToken,
        headerTenant: tenantIdFromHeader,
        userId: req.user?.userId,
      },
      'Tenant ID mismatch detected'
    );
    return next(new AuthenticationError('Tenant ID mismatch'));
  }

  // Set tenant ID on request for downstream use
  req.tenantId = tenantIdFromToken;

  // Set header for database row-level security
  res.setHeader('X-Tenant-ID', tenantIdFromToken);

  next();
}

/**
 * Set tenant context for database connection
 * This should be called before database queries to enable RLS
 */
export function setTenantContext(tenantId: string): string {
  return `SET app.current_tenant = '${tenantId}'`;
}

/**
 * Validate tenant access to resource
 */
export function validateTenantAccess(
  resourceTenantId: string,
  requestTenantId: string
): boolean {
  return resourceTenantId === requestTenantId;
}
