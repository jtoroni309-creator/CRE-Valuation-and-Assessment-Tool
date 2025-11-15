/**
 * Database connection for Comps Service
 */

import { Pool, QueryResult } from 'pg';
import { logger } from '@axxiom/shared';

let pool: Pool | null = null;

export async function initializeDatabase() {
  const config = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || 'axxiom_dev',
    user: process.env.POSTGRES_USER || 'axxiom_admin',
    password: process.env.POSTGRES_PASSWORD,
    ssl: process.env.POSTGRES_SSL_MODE === 'require' ? { rejectUnauthorized: false } : false,
    max: 10,
    min: 2,
  };

  pool = new Pool(config);

  try {
    const client = await pool.connect();
    logger.info('Database connected');
    client.release();
  } catch (error) {
    logger.error({ error }, 'Database connection failed');
    throw error;
  }

  pool.on('error', (err) => logger.error({ err }, 'Database pool error'));
  return pool;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    logger.info('Database pool closed');
  }
}

export function getPool(): Pool {
  if (!pool) throw new Error('Database not initialized');
  return pool;
}

export async function query<T = any>(text: string, params?: any[], tenantId?: string): Promise<QueryResult<T>> {
  const client = await getPool().connect();
  try {
    if (tenantId) {
      await client.query(`SET app.current_tenant = '${tenantId}'`);
    }
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}
