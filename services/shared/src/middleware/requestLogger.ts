/**
 * Request logging middleware
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      id: string;
      startTime: number;
    }
  }
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  // Generate or use existing trace ID
  const traceId = (req.headers['x-trace-id'] as string) || uuidv4();
  req.id = traceId;
  req.startTime = Date.now();

  // Set trace ID header for response
  res.setHeader('X-Trace-ID', traceId);

  // Log request
  logger.info(
    {
      traceId,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      tenantId: req.headers['x-tenant-id'],
    },
    'Incoming request'
  );

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;

    const logLevel = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    logger[logLevel](
      {
        traceId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
        tenantId: req.tenantId,
        userId: req.user?.userId,
      },
      'Request completed'
    );
  });

  next();
}
