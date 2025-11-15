/**
 * Health check routes
 */

import { Router, Request, Response } from 'express';
import pool from '../database';

export const router = Router();

/**
 * Basic health check
 */
router.get('/', async (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'data-ingestion-service',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Detailed health check with dependencies
 */
router.get('/detailed', async (req: Request, res: Response) => {
  const health: any = {
    status: 'healthy',
    service: 'data-ingestion-service',
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // Database check
  try {
    await pool.query('SELECT 1');
    health.checks.database = { status: 'healthy' };
  } catch (err) {
    health.checks.database = { status: 'unhealthy', error: (err as Error).message };
    health.status = 'unhealthy';
  }

  // Check data sources configuration
  const configuredSources = [];
  if (process.env.MLS_API_KEY) configuredSources.push('MLS');
  if (process.env.COSTAR_API_KEY) configuredSources.push('CoStar');
  if (process.env.OCR_API_KEY) configuredSources.push('OCR');

  health.checks.dataSources = {
    status: configuredSources.length > 0 ? 'configured' : 'not_configured',
    configured: configuredSources,
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
