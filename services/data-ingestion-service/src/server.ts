/**
 * Data Ingestion Service - Automated data collection from multiple sources
 * Port 3007
 */

import express from 'express';
import dotenv from 'dotenv';
import { logger, errorHandler, requestLogger } from '@axxiom/shared';
import { router as healthRouter } from './routes/health';
import { router as ingestionRouter } from './routes/ingestion';
import { router as sourcesRouter } from './routes/sources';
import { initializeScheduler } from './schedulers/jobScheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(express.json({ limit: '50mb' })); // Higher limit for document uploads
app.use(requestLogger);

// Routes
app.use('/health', healthRouter);
app.use('/api/v1/ingestion', ingestionRouter);
app.use('/api/v1/sources', sourcesRouter);

// Error handling
app.use(errorHandler);

// Initialize background job scheduler
initializeScheduler();

// Start server
const server = app.listen(PORT, () => {
  logger.info({ port: PORT, service: 'data-ingestion-service' }, 'Data ingestion service started');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, closing server');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;
