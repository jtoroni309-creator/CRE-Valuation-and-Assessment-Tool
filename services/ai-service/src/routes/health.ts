/**
 * Health check routes
 */

import { Router, Request, Response } from 'express';

export const router = Router();

/**
 * Basic health check
 */
router.get('/', async (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'ai-service',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Detailed health check with Azure OpenAI connectivity
 */
router.get('/detailed', async (req: Request, res: Response) => {
  const health: any = {
    status: 'healthy',
    service: 'ai-service',
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // Azure OpenAI check
  try {
    const hasApiKey = !!process.env.AZURE_OPENAI_API_KEY;
    const hasEndpoint = !!process.env.AZURE_OPENAI_ENDPOINT;

    if (hasApiKey && hasEndpoint) {
      health.checks.azureOpenAI = { status: 'configured' };
    } else {
      health.checks.azureOpenAI = { status: 'not_configured', warning: 'Missing API key or endpoint' };
    }
  } catch (err) {
    health.checks.azureOpenAI = { status: 'error', error: (err as Error).message };
    health.status = 'degraded';
  }

  // Azure Cognitive Search check
  try {
    const hasSearchKey = !!process.env.AZURE_SEARCH_API_KEY;
    const hasSearchEndpoint = !!process.env.AZURE_SEARCH_ENDPOINT;

    if (hasSearchKey && hasSearchEndpoint) {
      health.checks.azureSearch = { status: 'configured' };
    } else {
      health.checks.azureSearch = { status: 'not_configured', warning: 'Missing search API key or endpoint' };
    }
  } catch (err) {
    health.checks.azureSearch = { status: 'error', error: (err as Error).message };
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
