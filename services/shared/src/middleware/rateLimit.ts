/**
 * Rate limiting middleware using Redis
 */

import { Request, Response, NextFunction } from 'express';
import { createClient, RedisClientType } from 'redis';
import { RateLimitError } from '../utils/errors';
import logger from '../utils/logger';

let redisClient: RedisClientType | null = null;

export async function initializeRedis() {
  if (!process.env.AZURE_REDIS_CONNECTION_STRING) {
    logger.warn('Redis connection string not configured - rate limiting disabled');
    return;
  }

  try {
    redisClient = createClient({
      url: process.env.AZURE_REDIS_CONNECTION_STRING,
    });

    redisClient.on('error', (err) => {
      logger.error({ err }, 'Redis client error');
    });

    await redisClient.connect();
    logger.info('Redis client connected');
  } catch (error) {
    logger.error({ error }, 'Failed to connect to Redis');
  }
}

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  keyGenerator?: (req: Request) => string; // Custom key generator
  skip?: (req: Request) => boolean; // Skip rate limiting for certain requests
}

/**
 * Rate limit middleware factory
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = defaultKeyGenerator,
    skip = () => false,
  } = config;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip if configured
    if (skip(req)) {
      return next();
    }

    // Skip if Redis not available (fail open)
    if (!redisClient) {
      return next();
    }

    try {
      const key = `rate_limit:${keyGenerator(req)}`;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Use Redis sorted set to track requests in time window
      const multi = redisClient.multi();

      // Remove old entries outside window
      multi.zRemRangeByScore(key, 0, windowStart);

      // Add current request
      multi.zAdd(key, { score: now, value: `${now}` });

      // Count requests in window
      multi.zCard(key);

      // Set expiry
      multi.expire(key, Math.ceil(windowMs / 1000));

      const results = await multi.exec();
      const count = results[2] as number;

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - count));
      res.setHeader('X-RateLimit-Reset', now + windowMs);

      if (count > maxRequests) {
        throw new RateLimitError(
          `Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000}s`
        );
      }

      next();
    } catch (error) {
      if (error instanceof RateLimitError) {
        next(error);
      } else {
        // Fail open - don't block requests on Redis errors
        logger.error({ error }, 'Rate limit check failed');
        next();
      }
    }
  };
}

/**
 * Default key generator - by tenant ID and user ID
 */
function defaultKeyGenerator(req: Request): string {
  const tenantId = req.tenantId || 'anonymous';
  const userId = req.user?.userId || req.ip || 'unknown';
  return `${tenantId}:${userId}`;
}

/**
 * Rate limit by tenant only
 */
export function tenantRateLimit(config: Omit<RateLimitConfig, 'keyGenerator'>) {
  return rateLimit({
    ...config,
    keyGenerator: (req) => req.tenantId || 'anonymous',
  });
}

/**
 * Rate limit by IP
 */
export function ipRateLimit(config: Omit<RateLimitConfig, 'keyGenerator'>) {
  return rateLimit({
    ...config,
    keyGenerator: (req) => req.ip || 'unknown',
  });
}

/**
 * Cleanup Redis connection
 */
export async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis client disconnected');
  }
}
