import express from 'express';
import { logger, errorHandler } from '@axxiom/shared';
import { router as healthRouter } from './routes/health';
import { router as geospatialRouter } from './routes/geospatial';
import { router as propertyMapRouter } from './routes/propertyMap';
import { closeDatabase } from './database';

const app = express();
const PORT = process.env.PORT || 3009;

app.use(express.json({ limit: '10mb' }));

app.use('/health', healthRouter);
app.use('/api/v1/geospatial', geospatialRouter);
app.use('/api/v1/map', propertyMapRouter);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Geospatial Analytics Service listening on port ${PORT}`);
});

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutdown signal received');

  server.close(async () => {
    await closeDatabase();
    logger.info('Server closed');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export { app };
