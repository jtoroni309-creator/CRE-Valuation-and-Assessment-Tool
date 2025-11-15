/**
 * Global error handling middleware
 */

import { Request, Response, NextFunction } from 'express';
import { AppError, formatErrorResponse, isOperationalError } from '../utils/errors';
import logger from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const traceId = req.headers['x-trace-id'] as string || req.id || 'unknown';

  // Log error
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(
        {
          err,
          traceId,
          url: req.url,
          method: req.method,
          tenantId: req.headers['x-tenant-id'],
        },
        'Application error'
      );
    } else {
      logger.warn(
        {
          code: err.code,
          message: err.message,
          traceId,
          url: req.url,
        },
        'Client error'
      );
    }
  } else {
    logger.error(
      {
        err,
        traceId,
        url: req.url,
        method: req.method,
      },
      'Unhandled error'
    );
  }

  // Send error response
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const errorResponse = formatErrorResponse(err, traceId);

  res.status(statusCode).json(errorResponse);

  // Crash on non-operational errors in production
  if (!isOperationalError(err) && process.env.NODE_ENV === 'production') {
    logger.fatal({ err, traceId }, 'Non-operational error - shutting down');
    process.exit(1);
  }
}

/**
 * Async error wrapper for route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Handle 404 errors
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new AppError(
    `Route ${req.method} ${req.url} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
}
