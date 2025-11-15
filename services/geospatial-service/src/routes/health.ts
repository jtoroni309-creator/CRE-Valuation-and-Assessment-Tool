import { Router, Request, Response } from 'express';

export const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'geospatial-service', timestamp: new Date().toISOString() });
});
