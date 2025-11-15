/**
 * Valuation Service - Main Server
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
import { router as valuationRoutes } from './routes/valuations';
import { router as healthRoutes } from './routes/health';
import { initializeDatabase, closeDatabase } from './database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SERVICE_NAME = 'valuation-service';

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

// ============================================================================
// Routes
// ============================================================================

app.use('/health', healthRoutes);
app.use('/api/v1/valuations', valuationRoutes);

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
    await initializeDatabase();
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
    await closeDatabase();
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
