/**
 * Health check routes
 */

import { Router, Request, Response } from 'express';
import { getPool } from '../database';

export const router = Router();

/**
 * Basic health check
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'valuation-service',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Detailed health check with dependencies
 */
router.get('/detailed', async (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    service: 'valuation-service',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'unknown',
    },
  };

  // Check database
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    health.checks.database = 'healthy';
  } catch (error) {
    health.checks.database = 'unhealthy';
    health.status = 'unhealthy';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

/**
 * Readiness probe (for Kubernetes)
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const pool = getPool();
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready' });
  }
});

/**
 * Liveness probe (for Kubernetes)
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});
