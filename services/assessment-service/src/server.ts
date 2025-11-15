/**
 * Assessment Service - Mass appraisal and government assessments
 * Port 3003
 */

import express from 'express';
import dotenv from 'dotenv';
import { logger, errorHandler, requestLogger } from '@axxiom/shared';
import { router as healthRouter } from './routes/health';
import { router as assessmentRouter } from './routes/assessments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/health', healthRouter);
app.use('/api/v1/assessments', assessmentRouter);

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info({ port: PORT, service: 'assessment-service' }, 'Assessment service started');
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
