/**
 * Database connection and query utilities
 */

import { Pool, PoolClient, QueryResult } from 'pg';
import { logger } from '@axxiom/shared';

let pool: Pool | null = null;

export async function initializeDatabase() {
  const config = {
    host: process.env.POSTGRES_HOST || process.env.AZURE_SQL_SERVER,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.POSTGRES_DB || process.env.AZURE_SQL_DATABASE,
    user: process.env.POSTGRES_USER || process.env.AZURE_SQL_USERNAME,
    password: process.env.POSTGRES_PASSWORD || process.env.AZURE_SQL_PASSWORD,
    ssl: process.env.POSTGRES_SSL_MODE === 'require' ? { rejectUnauthorized: false } : false,
    max: parseInt(process.env.DB_POOL_MAX || '10'),
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'),
  };

  pool = new Pool(config);

  // Test connection
  try {
    const client = await pool.connect();
    logger.info('Database connected successfully');
    client.release();
  } catch (error) {
    logger.error({ error }, 'Database connection failed');
    throw error;
  }

  // Handle pool errors
  pool.on('error', (err) => {
    logger.error({ err }, 'Unexpected database pool error');
  });

  return pool;
}

export async function closeDatabase() {
  if (pool) {
    await pool.end();
    logger.info('Database pool closed');
  }
}

export function getPool(): Pool {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool;
}

/**
 * Execute query with automatic tenant isolation
 */
export async function query<T = any>(
  text: string,
  params?: any[],
  tenantId?: string
): Promise<QueryResult<T>> {
  const client = await getPool().connect();

  try {
    // Set tenant context for row-level security
    if (tenantId) {
      await client.query(`SET app.current_tenant = '${tenantId}'`);
    }

    const result = await client.query<T>(text, params);
    return result;
  } finally {
    client.release();
  }
}

/**
 * Execute transaction with tenant isolation
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>,
  tenantId?: string
): Promise<T> {
  const client = await getPool().connect();

  try {
    await client.query('BEGIN');

    // Set tenant context
    if (tenantId) {
      await client.query(`SET app.current_tenant = '${tenantId}'`);
    }

    const result = await callback(client);

    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
