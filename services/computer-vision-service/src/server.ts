/**
 * Computer Vision Service - Automated property condition assessment
 * Port 3008
 */

import express from 'express';
import dotenv from 'dotenv';
import { logger, errorHandler, requestLogger } from '@axxiom/shared';
import { router as healthRouter } from './routes/health';
import { router as visionRouter } from './routes/vision';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3008;

app.use(express.json({ limit: '50mb' }));
app.use(requestLogger);

app.use('/health', healthRouter);
app.use('/api/v1/vision', visionRouter);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info({ port: PORT, service: 'computer-vision-service' }, 'Computer vision service started');
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  server.close(() => process.exit(0));
});

export default app;
