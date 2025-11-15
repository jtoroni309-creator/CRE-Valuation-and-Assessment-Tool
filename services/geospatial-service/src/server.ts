import express from 'express';
import { logger, errorHandler } from '@axxiom/shared';
import { router as healthRouter } from './routes/health';
import { router as geospatialRouter } from './routes/geospatial';

const app = express();
const PORT = process.env.PORT || 3009;

app.use(express.json({ limit: '10mb' }));

app.use('/health', healthRouter);
app.use('/api/v1/geospatial', geospatialRouter);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Geospatial Analytics Service listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export { app };
