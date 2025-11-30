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
  ai: process.env.AI_SERVICE_URL || 'http://localhost:3006',
  dataIngestion: process.env.DATA_INGESTION_SERVICE_URL || 'http://localhost:3007',
  computerVision: process.env.COMPUTER_VISION_SERVICE_URL || 'http://localhost:3008',
  geospatial: process.env.GEOSPATIAL_SERVICE_URL || 'http://localhost:3009',
  portfolio: process.env.PORTFOLIO_SERVICE_URL || 'http://localhost:3010',
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

  // ============================================================================
  // AI Service
  // ============================================================================

  app.use(
    '/api/v1/ai',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 30,
    }),
    createProxyMiddleware({
      target: SERVICES.ai,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/ai': '/api/v1/ai',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('ai'),
    })
  );

  // ============================================================================
  // Data Ingestion Service
  // ============================================================================

  app.use(
    '/api/v1/ingestion',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
    }),
    createProxyMiddleware({
      target: SERVICES.dataIngestion,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/ingestion': '/api/v1/ingestion',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('data-ingestion'),
    })
  );

  app.use(
    '/api/v1/sources',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
    }),
    createProxyMiddleware({
      target: SERVICES.dataIngestion,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/sources': '/api/v1/sources',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('data-ingestion'),
    })
  );

  // ============================================================================
  // Computer Vision Service
  // ============================================================================

  app.use(
    '/api/v1/vision',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 50,
    }),
    createProxyMiddleware({
      target: SERVICES.computerVision,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/vision': '/api/v1/vision',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('computer-vision'),
    })
  );

  // ============================================================================
  // Geospatial Analytics Service
  // ============================================================================

  app.use(
    '/api/v1/geospatial',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
    }),
    createProxyMiddleware({
      target: SERVICES.geospatial,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/geospatial': '/api/v1/geospatial',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('geospatial'),
    })
  );

  // ============================================================================
  // Property Map Service (3D Maps Visualization)
  // ============================================================================

  app.use(
    '/api/v1/map',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 200,
    }),
    createProxyMiddleware({
      target: SERVICES.geospatial,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/map': '/api/v1/map',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('property-map'),
    })
  );

  // ============================================================================
  // Portfolio Analytics Service
  // ============================================================================

  app.use(
    '/api/v1/portfolio',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
    }),
    createProxyMiddleware({
      target: SERVICES.portfolio,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/portfolio': '/api/v1/portfolio',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('portfolio'),
    })
  );

  app.use(
    '/api/v1/analytics',
    authenticate,
    tenantRateLimit({
      windowMs: 15 * 60 * 1000,
      maxRequests: 100,
    }),
    createProxyMiddleware({
      target: SERVICES.portfolio,
      changeOrigin: true,
      pathRewrite: {
        '^/api/v1/analytics': '/api/v1/analytics',
      },
      onProxyReq: forwardContext,
      onError: handleProxyError('portfolio'),
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
