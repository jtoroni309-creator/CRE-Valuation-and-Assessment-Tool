/**
 * Portfolio Service - Analytics and management for institutional clients
 * Port 3010
 */

import express from 'express';
import dotenv from 'dotenv';
import { logger, errorHandler, requestLogger } from '@axxiom/shared';
import { router as healthRouter } from './routes/health';
import { router as portfolioRouter } from './routes/portfolio';
import { router as analyticsRouter } from './routes/analytics';
import { initializeScheduler } from './schedulers/portfolioScheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/health', healthRouter);
app.use('/api/v1/portfolios', portfolioRouter);
app.use('/api/v1/analytics', analyticsRouter);

// Error handling
app.use(errorHandler);

// Initialize background scheduler for automated revaluations
initializeScheduler();

// Start server
const server = app.listen(PORT, () => {
  logger.info({ port: PORT, service: 'portfolio-service' }, 'Portfolio service started');
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
