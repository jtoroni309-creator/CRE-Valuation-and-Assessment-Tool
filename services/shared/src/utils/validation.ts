/**
 * Request validation utilities
 */

import { Request } from 'express';
import { z, ZodSchema } from 'zod';
import { ValidationError } from './errors';

/**
 * Validate request body against Zod schema
 */
export function validateBody<T>(schema: ZodSchema<T>, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
}

/**
 * Validate request query params against Zod schema
 */
export function validateQuery<T>(schema: ZodSchema<T>, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Query validation failed', error.errors);
    }
    throw error;
  }
}

/**
 * Validate request params against Zod schema
 */
export function validateParams<T>(schema: ZodSchema<T>, data: any): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Param validation failed', error.errors);
    }
    throw error;
  }
}

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  uuid: z.string().uuid(),
  email: z.string().email(),
  date: z.string().datetime().or(z.date()),
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
  }),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
};

/**
 * Middleware factory for request validation
 */
export function validate(schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) {
  return (req: Request, res: any, next: any) => {
    try {
      if (schema.body) {
        req.body = validateBody(schema.body, req.body);
      }
      if (schema.query) {
        req.query = validateQuery(schema.query, req.query) as any;
      }
      if (schema.params) {
        req.params = validateParams(schema.params, req.params) as any;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
