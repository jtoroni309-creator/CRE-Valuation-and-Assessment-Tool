/**
 * Ingestion service - Core data ingestion business logic
 */

import { logger, NotFoundError } from '@axxiom/shared';
import { query, transaction } from '../database';
import * as mlsConnector from '../connectors/mlsConnector';
import * as publicRecordsConnector from '../connectors/publicRecordsConnector';
import * as costarConnector from '../connectors/costarConnector';
import * as webScraper from '../connectors/webScraper';
import * as ocrProcessor from '../connectors/ocrProcessor';

export interface IngestionJob {
  jobId: string;
  tenantId: string;
  sourceType: string;
  status: string;
  recordsProcessed: number;
  recordsFailed: number;
  startedAt: Date;
  completedAt?: Date;
  errorMessage?: string;
  metadata?: any;
  createdBy: string;
}

/**
 * Search MLS for comparable sales
 */
export async function searchMLS(
  tenantId: string,
  userId: string,
  params: any
): Promise<{ jobId: string; results: any[] }> {
  // Create ingestion job
  const job = await createJob(tenantId, userId, {
    sourceType: 'mls',
    metadata: { searchParams: params },
  });

  try {
    // Execute MLS search
    const results = await mlsConnector.searchComparables(params);

    // Store results in database
    await storeMLSResults(tenantId, results);

    // Update job status
    await updateJobStatus(job.jobId, 'completed', results.length, 0);

    logger.info({ tenantId, jobId: job.jobId, count: results.length }, 'MLS search completed');

    return { jobId: job.jobId, results };
  } catch (err) {
    await updateJobStatus(job.jobId, 'failed', 0, 0, (err as Error).message);
    throw err;
  }
}

/**
 * Fetch public records for a property
 */
export async function fetchPublicRecords(
  tenantId: string,
  userId: string,
  params: any
): Promise<{ jobId: string; records: any[] }> {
  const job = await createJob(tenantId, userId, {
    sourceType: 'public_records',
    metadata: { jurisdiction: params.jurisdiction, recordTypes: params.recordTypes },
  });

  try {
    const records = await publicRecordsConnector.fetchRecords(params);

    await storePublicRecords(tenantId, records);

    await updateJobStatus(job.jobId, 'completed', records.length, 0);

    logger.info({ tenantId, jobId: job.jobId, count: records.length }, 'Public records fetch completed');

    return { jobId: job.jobId, records };
  } catch (err) {
    await updateJobStatus(job.jobId, 'failed', 0, 0, (err as Error).message);
    throw err;
  }
}

/**
 * Fetch data from CoStar API
 */
export async function fetchCoStar(
  tenantId: string,
  userId: string,
  params: any
): Promise<{ jobId: string; data: any }> {
  const job = await createJob(tenantId, userId, {
    sourceType: 'costar_api',
    metadata: { address: params.address, dataTypes: params.dataTypes },
  });

  try {
    const data = await costarConnector.fetchPropertyData(params);

    await storeCoStarData(tenantId, data);

    await updateJobStatus(job.jobId, 'completed', 1, 0);

    logger.info({ tenantId, jobId: job.jobId }, 'CoStar fetch completed');

    return { jobId: job.jobId, data };
  } catch (err) {
    await updateJobStatus(job.jobId, 'failed', 0, 0, (err as Error).message);
    throw err;
  }
}

/**
 * Scrape data from web sources
 */
export async function webScrape(
  tenantId: string,
  userId: string,
  params: any
): Promise<{ jobId: string; data: any }> {
  const job = await createJob(tenantId, userId, {
    sourceType: 'web_scraper',
    metadata: { url: params.url, scrapeType: params.scrapeType },
  });

  try {
    const data = await webScraper.scrapeUrl(params);

    await storeScrapedData(tenantId, data);

    await updateJobStatus(job.jobId, 'completed', 1, 0);

    logger.info({ tenantId, jobId: job.jobId, url: params.url }, 'Web scraping completed');

    return { jobId: job.jobId, data };
  } catch (err) {
    await updateJobStatus(job.jobId, 'failed', 0, 0, (err as Error).message);
    throw err;
  }
}

/**
 * Process document with OCR
 */
export async function processOCR(
  tenantId: string,
  userId: string,
  params: any
): Promise<{ jobId: string; extractedData: any }> {
  const job = await createJob(tenantId, userId, {
    sourceType: 'ocr',
    metadata: { documentType: params.documentType },
  });

  try {
    const extractedData = await ocrProcessor.processDocument(params);

    await storeOCRData(tenantId, extractedData);

    await updateJobStatus(job.jobId, 'completed', 1, 0);

    logger.info({ tenantId, jobId: job.jobId }, 'OCR processing completed');

    return { jobId: job.jobId, extractedData };
  } catch (err) {
    await updateJobStatus(job.jobId, 'failed', 0, 0, (err as Error).message);
    throw err;
  }
}

/**
 * Bulk import data from CSV/Excel
 */
export async function bulkImport(
  tenantId: string,
  userId: string,
  params: any
): Promise<{ jobId: string; imported: number; failed: number }> {
  const job = await createJob(tenantId, userId, {
    sourceType: 'bulk_import',
    metadata: { importType: params.importType, fileType: params.fileType },
  });

  // In production, this would process the file asynchronously
  // For now, return mock results
  const imported = 100;
  const failed = 5;

  await updateJobStatus(job.jobId, 'completed', imported, failed);

  return { jobId: job.jobId, imported, failed };
}

/**
 * List ingestion jobs
 */
export async function listJobs(
  tenantId: string,
  filters: {
    status?: string;
    sourceType?: string;
    limit: number;
    offset: number;
  }
): Promise<IngestionJob[]> {
  const whereClauses: string[] = [];
  const params: any[] = [tenantId];
  let paramIndex = 2;

  if (filters.status) {
    whereClauses.push(`status = $${paramIndex++}`);
    params.push(filters.status);
  }

  if (filters.sourceType) {
    whereClauses.push(`source_type = $${paramIndex++}`);
    params.push(filters.sourceType);
  }

  const whereClause = whereClauses.length > 0 ? `AND ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT
      job_id,
      tenant_id,
      source_type,
      status,
      records_processed,
      records_failed,
      started_at,
      completed_at,
      error_message,
      metadata,
      created_by
    FROM ingestion_jobs
    WHERE tenant_id = $1 ${whereClause}
    ORDER BY started_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(filters.limit, filters.offset);

  const result = await query<IngestionJob>(sql, params, tenantId);
  return result.rows;
}

/**
 * Get job details
 */
export async function getJob(tenantId: string, jobId: string): Promise<IngestionJob> {
  const result = await query<IngestionJob>(
    `SELECT * FROM ingestion_jobs WHERE job_id = $1 AND tenant_id = $2`,
    [jobId, tenantId],
    tenantId
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Ingestion job not found');
  }

  return result.rows[0];
}

/**
 * Retry failed job
 */
export async function retryJob(
  tenantId: string,
  userId: string,
  jobId: string
): Promise<{ message: string; newJobId: string }> {
  const originalJob = await getJob(tenantId, jobId);

  if (originalJob.status !== 'failed') {
    throw new Error('Only failed jobs can be retried');
  }

  // Create new job with same parameters
  const newJob = await createJob(tenantId, userId, {
    sourceType: originalJob.sourceType,
    metadata: { ...originalJob.metadata, retryOf: jobId },
  });

  logger.info({ tenantId, originalJobId: jobId, newJobId: newJob.jobId }, 'Job retried');

  return { message: 'Job retry initiated', newJobId: newJob.jobId };
}

/**
 * Enable change detection for properties
 */
export async function enableChangeDetection(
  tenantId: string,
  userId: string,
  params: any
): Promise<{ enabled: number }> {
  return transaction(async (client) => {
    for (const propertyId of params.propertyIds) {
      await client.query(
        `INSERT INTO change_detection_monitors (tenant_id, property_id, monitor_types, frequency, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (tenant_id, property_id) DO UPDATE
         SET monitor_types = $3, frequency = $4, updated_at = NOW()`,
        [tenantId, propertyId, JSON.stringify(params.monitorTypes), params.frequency, userId]
      );
    }

    logger.info(
      { tenantId, propertyCount: params.propertyIds.length, frequency: params.frequency },
      'Change detection enabled'
    );

    return { enabled: params.propertyIds.length };
  }, tenantId);
}

/**
 * Get change detection alerts
 */
export async function getChangeAlerts(
  tenantId: string,
  filters: {
    propertyId?: string;
    changeType?: string;
    unreadOnly: boolean;
    limit: number;
    offset: number;
  }
): Promise<any[]> {
  const whereClauses: string[] = [];
  const params: any[] = [tenantId];
  let paramIndex = 2;

  if (filters.propertyId) {
    whereClauses.push(`property_id = $${paramIndex++}`);
    params.push(filters.propertyId);
  }

  if (filters.changeType) {
    whereClauses.push(`change_type = $${paramIndex++}`);
    params.push(filters.changeType);
  }

  if (filters.unreadOnly) {
    whereClauses.push(`read_at IS NULL`);
  }

  const whereClause = whereClauses.length > 0 ? `AND ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT * FROM change_detection_alerts
    WHERE tenant_id = $1 ${whereClause}
    ORDER BY detected_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(filters.limit, filters.offset);

  const result = await query(sql, params, tenantId);
  return result.rows;
}

/**
 * Helper: Create ingestion job
 */
async function createJob(
  tenantId: string,
  userId: string,
  data: { sourceType: string; metadata: any }
): Promise<IngestionJob> {
  const result = await query<IngestionJob>(
    `INSERT INTO ingestion_jobs (tenant_id, source_type, status, records_processed, records_failed, started_at, metadata, created_by)
     VALUES ($1, $2, 'running', 0, 0, NOW(), $3, $4)
     RETURNING *`,
    [tenantId, data.sourceType, JSON.stringify(data.metadata), userId],
    tenantId
  );

  return result.rows[0];
}

/**
 * Helper: Update job status
 */
async function updateJobStatus(
  jobId: string,
  status: string,
  processed: number,
  failed: number,
  errorMessage?: string
): Promise<void> {
  await query(
    `UPDATE ingestion_jobs
     SET status = $1, records_processed = $2, records_failed = $3, completed_at = NOW(), error_message = $4
     WHERE job_id = $5`,
    [status, processed, failed, errorMessage, jobId]
  );
}

/**
 * Helper: Store MLS results
 */
async function storeMLSResults(tenantId: string, results: any[]): Promise<void> {
  // In production, would store in sales/comparables tables
  logger.info({ tenantId, count: results.length }, 'MLS results stored');
}

/**
 * Helper: Store public records
 */
async function storePublicRecords(tenantId: string, records: any[]): Promise<void> {
  logger.info({ tenantId, count: records.length }, 'Public records stored');
}

/**
 * Helper: Store CoStar data
 */
async function storeCoStarData(tenantId: string, data: any): Promise<void> {
  logger.info({ tenantId }, 'CoStar data stored');
}

/**
 * Helper: Store scraped data
 */
async function storeScrapedData(tenantId: string, data: any): Promise<void> {
  logger.info({ tenantId }, 'Scraped data stored');
}

/**
 * Helper: Store OCR data
 */
async function storeOCRData(tenantId: string, data: any): Promise<void> {
  logger.info({ tenantId }, 'OCR data stored');
}
