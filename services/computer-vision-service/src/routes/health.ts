import { Router, Request, Response } from 'express';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'computer-vision-service', timestamp: new Date().toISOString() });
});
