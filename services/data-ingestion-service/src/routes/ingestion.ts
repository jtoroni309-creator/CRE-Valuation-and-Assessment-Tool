/**
 * Data ingestion routes
 */

import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/ingestionController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 100 }));

/**
 * POST /api/v1/ingestion/mls/search
 * Search MLS for comparable sales
 */
router.post('/mls/search', authorize('ingestion.execute'), asyncHandler(controller.searchMLS));

/**
 * POST /api/v1/ingestion/public-records/fetch
 * Fetch public records for a property
 */
router.post('/public-records/fetch', authorize('ingestion.execute'), asyncHandler(controller.fetchPublicRecords));

/**
 * POST /api/v1/ingestion/third-party/costar
 * Fetch data from CoStar API
 */
router.post('/third-party/costar', authorize('ingestion.execute'), asyncHandler(controller.fetchCoStar));

/**
 * POST /api/v1/ingestion/web-scrape
 * Scrape data from web sources
 */
router.post('/web-scrape', authorize('ingestion.execute'), asyncHandler(controller.webScrape));

/**
 * POST /api/v1/ingestion/ocr/process
 * Process document with OCR
 */
router.post('/ocr/process', authorize('ingestion.execute'), asyncHandler(controller.processOCR));

/**
 * POST /api/v1/ingestion/bulk/import
 * Bulk import data from CSV/Excel
 */
router.post('/bulk/import', authorize('ingestion.execute'), asyncHandler(controller.bulkImport));

/**
 * GET /api/v1/ingestion/jobs
 * List ingestion jobs
 */
router.get('/jobs', authorize('ingestion.read'), asyncHandler(controller.listJobs));

/**
 * GET /api/v1/ingestion/jobs/:jobId
 * Get job status and results
 */
router.get('/jobs/:jobId', authorize('ingestion.read'), asyncHandler(controller.getJob));

/**
 * POST /api/v1/ingestion/jobs/:jobId/retry
 * Retry failed job
 */
router.post('/jobs/:jobId/retry', authorize('ingestion.execute'), asyncHandler(controller.retryJob));

/**
 * POST /api/v1/ingestion/change-detection/enable
 * Enable change detection for properties
 */
router.post('/change-detection/enable', authorize('ingestion.admin'), asyncHandler(controller.enableChangeDetection));

/**
 * GET /api/v1/ingestion/change-detection/alerts
 * Get change detection alerts
 */
router.get('/change-detection/alerts', authorize('ingestion.read'), asyncHandler(controller.getChangeAlerts));
