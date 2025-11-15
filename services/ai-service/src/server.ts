/**
 * AI Service - Azure OpenAI integration with RAG
 * Port 3006
 */

import express from 'express';
import dotenv from 'dotenv';
import { logger, errorHandler, requestLogger } from '@axxiom/shared';
import { router as healthRouter } from './routes/health';
import { router as aiRouter } from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(express.json({ limit: '10mb' })); // Higher limit for document processing
app.use(requestLogger);

// Routes
app.use('/health', healthRouter);
app.use('/api/v1/ai', aiRouter);

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  logger.info({ port: PORT, service: 'ai-service' }, 'AI service started');
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
