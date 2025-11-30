import { Pool } from 'pg';
import { logger } from '@axxiom/shared';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'axxiom_dev',
  user: process.env.DB_USER || 'axxiom_admin',
  password: process.env.DB_PASSWORD,
  min: parseInt(process.env.DB_POOL_MIN || '2'),
  max: parseInt(process.env.DB_POOL_MAX || '10'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected database error');
  process.exit(-1);
});

pool.on('connect', () => {
  logger.debug('Database connection established');
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  getClient: () => pool.connect(),
};

export async function closeDatabase() {
  await pool.end();
  logger.info('Database connection pool closed');
}
