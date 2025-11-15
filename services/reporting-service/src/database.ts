/**
 * PostgreSQL database connection for Reporting Service
 */

import { Pool, QueryResult, PoolClient } from 'pg';
import { logger } from '@axxiom/shared';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'axxiom',
  user: process.env.DB_USER || 'axxiom',
  password: process.env.DB_PASSWORD || 'axxiom_dev_pass',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error({ err }, 'Unexpected database error');
});

/**
 * Execute a query with tenant context
 */
export async function query<T = any>(
  sql: string,
  params: any[],
  tenantId?: string
): Promise<QueryResult<T>> {
  const client = await pool.connect();
  try {
    if (tenantId) {
      await client.query(`SET app.current_tenant = '${tenantId}'`);
    }
    return await client.query<T>(sql, params);
  } finally {
    client.release();
  }
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>,
  tenantId?: string
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (tenantId) {
      await client.query(`SET app.current_tenant = '${tenantId}'`);
    }
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export default pool;
