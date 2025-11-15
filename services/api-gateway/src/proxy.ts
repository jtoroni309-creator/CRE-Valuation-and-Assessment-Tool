/**
 * Service Proxy Configuration
 * Routes API requests to appropriate microservices
 */

import { Express } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { logger, authenticate, tenantRateLimit } from '@axxiom/shared';

// Service URLs from environment variables
const SERVICES = {
  valuation: process.env.VALUATION_SERVICE_URL || 'http://localhost:3001',
  comps: process.env.COMPS_SERVICE_URL || 'http://localhost:3002',
  assessment: process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:3003',
  appeals: process.env.APPEALS_SERVICE_URL || 'http://localhost:3004',
  reporting: process.env.REPORTING_SERVICE_URL || 'http://localhost:3005',
};

/**
 * Setup proxy middleware for all microservices
 */
export function setupProxies(app: Express) {
  // ============================================================================
  // Valuation Service
  // ============================================================================

  app.use(
    '/api/v1/valuations',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
    }),
    createProxyMiddleware({
      target: SERVICES.valuation,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/valuations': '/api/v1/valuations',
      },
      onProxyReq: (proxyReq, req: any) => {
        // Forward tenant context
        if (req.tenantId) {
          proxyReq.setHeader('X-Tenant-ID', req.tenantId);
        }
        if (req.user) {
          proxyReq.setHeader('X-User-ID', req.user.userId);
        }
        if (req.id) {
          proxyReq.setHeader('X-Trace-ID', req.id);
        }
      },
      onError: (err, req, res) => {
        logger.error(
          {
            err,
            service: 'valuation',
            url: req.url,
          },
          'Proxy error'
        );
        res.status(503).json({
          error: {
            code: 'SERVICE_UNAVAILABLE',
            message: 'Valuation service is temporarily unavailable',
            traceId: (req as any).id,
          },
        });
      },
    })
  );

  // ============================================================================
  // Comps Service
  // ============================================================================

  app.use(
    '/api/v1/comparables',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 200,
    }),
    createProxyMiddleware({
      target: SERVICES.comps,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/comparables': '/api/v1/comparables',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('comps'),
    })
  );

  // ============================================================================
  // Assessment Service
  // ============================================================================

  app.use(
    '/api/v1/assessments',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 50,
    }),
    createProxyMiddleware({
      target: SERVICES.assessment,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/assessments': '/api/v1/assessments',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('assessment'),
    })
  );

  // ============================================================================
  // Appeals Service
  // ============================================================================

  app.use(
    '/api/v1/appeals',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
    }),
    createProxyMiddleware({
      target: SERVICES.appeals,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/appeals': '/api/v1/appeals',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('appeals'),
    })
  );

  // ============================================================================
  // Reporting Service
  // ============================================================================

  app.use(
    '/api/v1/reports',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 50,
    }),
    createProxyMiddleware({
      target: SERVICES.reporting,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/reports': '/api/v1/reports',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('reporting'),
    })
  );

  logger.info({ services: SERVICES }, 'Service proxies configured');
}

/**
 * Forward request context to downstream services
 */
function forwardContext(proxyReq: any, req: any) {
  if (req.tenantId) {
    proxyReq.setHeader('X-Tenant-ID', req.tenantId);
  }
  if (req.user) {
    proxyReq.setHeader('X-User-ID', req.user.userId);
    proxyReq.setHeader('X-User-Permissions', JSON.stringify(req.user.permissions));
  }
  if (req.id) {
    proxyReq.setHeader('X-Trace-ID', req.id);
  }
}

/**
 * Handle proxy errors
 */
function handleProxyError(serviceName: string) {
  return (err: Error, req: any, res: any) => {
    logger.error(
      {
        err,
        service: serviceName,
        url: req.url,
        traceId: req.id,
      },
      'Proxy error'
    );

    res.status(503).json({
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: `${serviceName} service is temporarily unavailable`,
        traceId: req.id,
      },
    });
  };
}
