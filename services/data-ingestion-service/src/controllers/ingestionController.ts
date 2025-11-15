/**
 * Ingestion controller - Request handlers for data ingestion operations
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { logger, calculatePagination } from '@axxiom/shared';
import * as ingestionService from '../services/ingestionService';

const MLSSearchSchema = z.object({
  location: z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    radius: z.number().min(0.1).max(50).default(5),
  }),
  propertyType: z.array(z.string()).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  minSqft: z.number().positive().optional(),
  maxSqft: z.number().positive().optional(),
  soldWithin: z.enum(['30days', '60days', '90days', '180days', '1year']).default('180days'),
});

const PublicRecordsSchema = z.object({
  parcelNumber: z.string().optional(),
  address: z.string().optional(),
  jurisdiction: z.string(),
  recordTypes: z.array(z.enum(['assessment', 'sales', 'permits', 'liens', 'foreclosure'])),
});

const CoStarFetchSchema = z.object({
  propertyId: z.string().optional(),
  address: z.string().optional(),
  dataTypes: z.array(z.enum(['property_details', 'sales_comps', 'rental_comps', 'market_trends'])),
});

const WebScrapeSchema = z.object({
  url: z.string().url(),
  scrapeType: z.enum(['listing', 'market_report', 'rental_data', 'custom']),
  selectors: z.record(z.string()).optional(),
});

const OCRProcessSchema = z.object({
  documentUrl: z.string().url().optional(),
  documentBase64: z.string().optional(),
  documentType: z.enum(['appraisal', 'assessment_notice', 'title_report', 'survey', 'lease', 'other']),
  extractFields: z.array(z.string()).optional(),
});

const BulkImportSchema = z.object({
  fileUrl: z.string().url().optional(),
  fileBase64: z.string().optional(),
  fileType: z.enum(['csv', 'xlsx']),
  mapping: z.record(z.string()),
  importType: z.enum(['properties', 'sales', 'assessments', 'comparables']),
});

const ChangeDetectionSchema = z.object({
  propertyIds: z.array(z.string().uuid()),
  monitorTypes: z.array(z.enum(['ownership_change', 'sale', 'permit', 'assessment_change', 'foreclosure'])),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
});

/**
 * Search MLS for comparable sales
 */
export async function searchMLS(req: Request, res: Response) {
  const data = MLSSearchSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, location: data.location }, 'Searching MLS for comparables');

  const result = await ingestionService.searchMLS(tenantId, userId, data);

  res.json({ success: true, data: result });
}

/**
 * Fetch public records
 */
export async function fetchPublicRecords(req: Request, res: Response) {
  const data = PublicRecordsSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, jurisdiction: data.jurisdiction }, 'Fetching public records');

  const result = await ingestionService.fetchPublicRecords(tenantId, userId, data);

  res.json({ success: true, data: result });
}

/**
 * Fetch CoStar data
 */
export async function fetchCoStar(req: Request, res: Response) {
  const data = CoStarFetchSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, address: data.address }, 'Fetching CoStar data');

  const result = await ingestionService.fetchCoStar(tenantId, userId, data);

  res.json({ success: true, data: result });
}

/**
 * Web scrape
 */
export async function webScrape(req: Request, res: Response) {
  const data = WebScrapeSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, url: data.url, type: data.scrapeType }, 'Web scraping');

  const result = await ingestionService.webScrape(tenantId, userId, data);

  res.json({ success: true, data: result });
}

/**
 * Process OCR
 */
export async function processOCR(req: Request, res: Response) {
  const data = OCRProcessSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, documentType: data.documentType }, 'Processing OCR');

  const result = await ingestionService.processOCR(tenantId, userId, data);

  res.json({ success: true, data: result });
}

/**
 * Bulk import
 */
export async function bulkImport(req: Request, res: Response) {
  const data = BulkImportSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, importType: data.importType, fileType: data.fileType }, 'Bulk importing');

  const result = await ingestionService.bulkImport(tenantId, userId, data);

  res.json({ success: true, data: result });
}

/**
 * List ingestion jobs
 */
export async function listJobs(req: Request, res: Response) {
  const tenantId = req.tenantId!;
  const { status, sourceType } = req.query;
  const { limit, offset } = calculatePagination(req);

  const jobs = await ingestionService.listJobs(tenantId, {
    status: status as string,
    sourceType: sourceType as string,
    limit,
    offset,
  });

  res.json({ success: true, data: jobs });
}

/**
 * Get job details
 */
export async function getJob(req: Request, res: Response) {
  const { jobId } = req.params;
  const tenantId = req.tenantId!;

  const job = await ingestionService.getJob(tenantId, jobId);

  res.json({ success: true, data: job });
}

/**
 * Retry failed job
 */
export async function retryJob(req: Request, res: Response) {
  const { jobId } = req.params;
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, jobId }, 'Retrying ingestion job');

  const result = await ingestionService.retryJob(tenantId, userId, jobId);

  res.json({ success: true, data: result });
}

/**
 * Enable change detection
 */
export async function enableChangeDetection(req: Request, res: Response) {
  const data = ChangeDetectionSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, propertyCount: data.propertyIds.length }, 'Enabling change detection');

  const result = await ingestionService.enableChangeDetection(tenantId, userId, data);

  res.json({ success: true, data: result });
}

/**
 * Get change alerts
 */
export async function getChangeAlerts(req: Request, res: Response) {
  const tenantId = req.tenantId!;
  const { propertyId, changeType, unreadOnly } = req.query;
  const { limit, offset } = calculatePagination(req);

  const alerts = await ingestionService.getChangeAlerts(tenantId, {
    propertyId: propertyId as string,
    changeType: changeType as string,
    unreadOnly: unreadOnly === 'true',
    limit,
    offset,
  });

  res.json({ success: true, data: alerts });
}
