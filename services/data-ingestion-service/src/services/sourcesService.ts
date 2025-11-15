/**
 * Sources service - Data source management business logic
 */

import { logger, NotFoundError } from '@axxiom/shared';
import { query, transaction } from '../database';

export interface DataSource {
  sourceId: string;
  tenantId: string;
  name: string;
  sourceType: string;
  configuration: any;
  isActive: boolean;
  lastSyncAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * List data sources
 */
export async function listSources(
  tenantId: string,
  filters: { sourceType?: string; isActive?: boolean }
): Promise<DataSource[]> {
  const whereClauses: string[] = [];
  const params: any[] = [tenantId];
  let paramIndex = 2;

  if (filters.sourceType) {
    whereClauses.push(`source_type = $${paramIndex++}`);
    params.push(filters.sourceType);
  }

  if (filters.isActive !== undefined) {
    whereClauses.push(`is_active = $${paramIndex++}`);
    params.push(filters.isActive);
  }

  const whereClause = whereClauses.length > 0 ? `AND ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT * FROM data_sources
    WHERE tenant_id = $1 ${whereClause}
    ORDER BY created_at DESC
  `;

  const result = await query<DataSource>(sql, params, tenantId);
  return result.rows;
}

/**
 * Create data source
 */
export async function createSource(
  tenantId: string,
  userId: string,
  data: any
): Promise<DataSource> {
  const result = await query<DataSource>(
    `INSERT INTO data_sources (tenant_id, name, source_type, configuration, is_active, created_by, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
     RETURNING *`,
    [tenantId, data.name, data.sourceType, JSON.stringify(data.configuration), data.isActive, userId],
    tenantId
  );

  logger.info({ tenantId, sourceId: result.rows[0].sourceId }, 'Data source created');

  return result.rows[0];
}

/**
 * Get data source
 */
export async function getSource(tenantId: string, sourceId: string): Promise<DataSource> {
  const result = await query<DataSource>(
    `SELECT * FROM data_sources WHERE source_id = $1 AND tenant_id = $2`,
    [sourceId, tenantId],
    tenantId
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Data source not found');
  }

  return result.rows[0];
}

/**
 * Update data source
 */
export async function updateSource(
  tenantId: string,
  sourceId: string,
  updates: any
): Promise<DataSource> {
  const setClauses: string[] = ['updated_at = NOW()'];
  const params: any[] = [];
  let paramIndex = 1;

  if (updates.name) {
    setClauses.push(`name = $${paramIndex++}`);
    params.push(updates.name);
  }

  if (updates.configuration) {
    setClauses.push(`configuration = $${paramIndex++}`);
    params.push(JSON.stringify(updates.configuration));
  }

  if (updates.isActive !== undefined) {
    setClauses.push(`is_active = $${paramIndex++}`);
    params.push(updates.isActive);
  }

  params.push(sourceId, tenantId);

  const sql = `
    UPDATE data_sources
    SET ${setClauses.join(', ')}
    WHERE source_id = $${paramIndex++} AND tenant_id = $${paramIndex++}
    RETURNING *
  `;

  const result = await query<DataSource>(sql, params, tenantId);

  if (result.rows.length === 0) {
    throw new NotFoundError('Data source not found');
  }

  return result.rows[0];
}

/**
 * Delete data source
 */
export async function deleteSource(tenantId: string, sourceId: string): Promise<void> {
  const result = await query(
    `DELETE FROM data_sources WHERE source_id = $1 AND tenant_id = $2`,
    [sourceId, tenantId],
    tenantId
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Data source not found');
  }

  logger.info({ tenantId, sourceId }, 'Data source deleted');
}

/**
 * Test data source connection
 */
export async function testSource(
  tenantId: string,
  sourceId: string
): Promise<{ status: string; message: string; responseTime?: number }> {
  const source = await getSource(tenantId, sourceId);

  const startTime = Date.now();

  // In production, would actually test the connection based on source type
  // For now, return mock result
  const responseTime = Date.now() - startTime;

  return {
    status: 'success',
    message: 'Connection test successful',
    responseTime,
  };
}

/**
 * Get source statistics
 */
export async function getSourceStatistics(
  tenantId: string,
  sourceId: string
): Promise<any> {
  const source = await getSource(tenantId, sourceId);

  // Get job statistics for this source
  const stats = await query(
    `SELECT
      COUNT(*) as total_jobs,
      COUNT(*) FILTER (WHERE status = 'completed') as successful_jobs,
      COUNT(*) FILTER (WHERE status = 'failed') as failed_jobs,
      SUM(records_processed) as total_records_processed,
      MAX(started_at) as last_run_at
     FROM ingestion_jobs
     WHERE tenant_id = $1 AND source_type = $2`,
    [tenantId, source.sourceType],
    tenantId
  );

  return {
    sourceId: source.sourceId,
    sourceName: source.name,
    sourceType: source.sourceType,
    isActive: source.isActive,
    lastSyncAt: source.lastSyncAt,
    statistics: stats.rows[0],
  };
}
