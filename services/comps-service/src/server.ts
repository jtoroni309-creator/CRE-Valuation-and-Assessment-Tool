/**
 * Comps Service - Comparable Property Selection
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
} from '@axxiom/shared';
import { router as compsRoutes } from './routes/comparables';
import { router as healthRoutes } from './routes/health';
import { initializeDatabase, closeDatabase } from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const SERVICE_NAME = 'comps-service';

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(compression());
app.use(requestLogger);

// Routes
app.use('/health', healthRoutes);
app.use('/api/v1/comparables', compsRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Server lifecycle
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      logger.info({ service: SERVICE_NAME, port: PORT }, `${SERVICE_NAME} started`);
    });
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
}

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received');
  try {
    await closeDatabase();
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

startServer();

export { app };
