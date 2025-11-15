/**
 * Reporting Service - Document generation (PDF, Word, Excel)
 * Port 3005
 */

import express from 'express';
import dotenv from 'dotenv';
import { logger, errorHandler, requestLogger } from '@axxiom/shared';
import { router as healthRouter } from './routes/health';
import { router as reportsRouter } from './routes/reports';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/health', healthRouter);
app.use('/api/v1/reports', reportsRouter);

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info({ port: PORT, service: 'reporting-service' }, 'Reporting service started');
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
