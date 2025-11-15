/**
 * Health check routes for API Gateway
 */

import { Router, Request, Response } from 'express';
import axios from 'axios';

export const router = Router();

const SERVICES = {
  valuation: process.env.VALUATION_SERVICE_URL || 'http://localhost:3001',
  comps: process.env.COMPS_SERVICE_URL || 'http://localhost:3002',
  assessment: process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:3003',
  appeals: process.env.APPEALS_SERVICE_URL || 'http://localhost:3004',
  reporting: process.env.REPORTING_SERVICE_URL || 'http://localhost:3005',
};

/**
 * Basic health check
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Detailed health check with downstream services
 */
router.get('/detailed', async (req: Request, res: Response) => {
  const health = {
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    services: {} as Record<string, string>,
  };

  // Check each downstream service
  for (const [name, url] of Object.entries(SERVICES)) {
    try {
      const response = await axios.get(`${url}/health`, {
        timeout: 2000,
        validateStatus: () => true,
      });

      health.services[name] = response.status === 200 ? 'healthy' : 'unhealthy';

      if (response.status !== 200) {
        health.status = 'degraded';
      }
    } catch (error) {
      health.services[name] = 'unreachable';
      health.status = 'degraded';
    }
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

/**
 * Readiness probe (for Kubernetes)
 */
router.get('/ready', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ready' });
});

/**
 * Liveness probe (for Kubernetes)
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});
