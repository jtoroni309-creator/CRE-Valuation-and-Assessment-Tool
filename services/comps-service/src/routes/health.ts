import { Router } from 'express';
import { getPool } from '../database';

export const router = Router();

router.get('/', (req, res) => {
  res.json({ status: 'healthy', service: 'comps-service', timestamp: new Date().toISOString() });
});

router.get('/ready', async (req, res) => {
  try {
    await getPool().query('SELECT 1');
    res.status(200).json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'not ready' });
  }
});

router.get('/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});
