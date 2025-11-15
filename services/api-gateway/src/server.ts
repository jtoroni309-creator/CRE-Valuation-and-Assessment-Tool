/**
 * API Gateway - Main Server
 * Routes requests to appropriate microservices
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import {
  logger,
  errorHandler,
  notFoundHandler,
  requestLogger,
  initializeRedis,
  closeRedis,
} from '@axxiom/shared';
import { setupProxies } from './proxy';
import { router as healthRoutes } from './routes/health';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SERVICE_NAME = 'api-gateway';

// ============================================================================
// Middleware
// ============================================================================

// Security middleware
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Request logging
app.use(requestLogger);

// Trust proxy (for X-Forwarded-* headers)
app.set('trust proxy', true);

// ============================================================================
// Routes
// ============================================================================

// Health check (before proxies to ensure it's not proxied)
app.use('/health', healthRoutes);

// API version endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Axxiom API Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      valuation: process.env.VALUATION_SERVICE_URL || 'http://localhost:3001',
      comps: process.env.COMPS_SERVICE_URL || 'http://localhost:3002',
      assessment: process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:3003',
      appeals: process.env.APPEALS_SERVICE_URL || 'http://localhost:3004',
      reporting: process.env.REPORTING_SERVICE_URL || 'http://localhost:3005',
    },
  });
});

// Setup service proxies
setupProxies(app);

// ============================================================================
// Error Handling
// ============================================================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================================================
// Server Lifecycle
// ============================================================================

async function startServer() {
  try {
    // Initialize dependencies
    await initializeRedis();

    // Start server
    app.listen(PORT, () => {
      logger.info(
        {
          service: SERVICE_NAME,
          port: PORT,
          env: process.env.NODE_ENV,
        },
        `${SERVICE_NAME} started successfully`
      );
    });
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
}

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received');

  try {
    // Close connections
    await closeRedis();

    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.fatal({ error }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'Unhandled rejection');
  process.exit(1);
});

// Start the server
startServer();

export { app };
