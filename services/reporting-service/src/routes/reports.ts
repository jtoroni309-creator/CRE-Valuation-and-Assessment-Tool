/**
 * Report generation routes
 */

import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/reportsController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 50 })); // Lower limit for report generation

/**
 * POST /api/v1/reports/valuation/:valuationId
 * Generate valuation report (PDF)
 */
router.post('/valuation/:valuationId', authorize('reports.generate'), asyncHandler(controller.generateValuationReport));

/**
 * POST /api/v1/reports/assessment-roll/:runId
 * Generate assessment roll (Excel)
 */
router.post('/assessment-roll/:runId', authorize('reports.generate'), asyncHandler(controller.generateAssessmentRoll));

/**
 * POST /api/v1/reports/appeal/:appealId
 * Generate appeal package (PDF)
 */
router.post('/appeal/:appealId', authorize('reports.generate'), asyncHandler(controller.generateAppealReport));

/**
 * POST /api/v1/reports/batch/valuations
 * Batch generate valuation reports
 */
router.post('/batch/valuations', authorize('reports.generate'), asyncHandler(controller.batchGenerateValuations));

/**
 * POST /api/v1/reports/batch/assessments
 * Batch generate assessment notices
 */
router.post('/batch/assessments', authorize('reports.generate'), asyncHandler(controller.batchGenerateAssessments));

/**
 * GET /api/v1/reports/history
 * List report generation history
 */
router.get('/history', authorize('reports.read'), asyncHandler(controller.getReportHistory));

/**
 * GET /api/v1/reports/:reportId/download
 * Download generated report
 */
router.get('/:reportId/download', authorize('reports.read'), asyncHandler(controller.downloadReport));

/**
 * GET /api/v1/reports/templates
 * List available report templates
 */
router.get('/templates', authorize('reports.read'), asyncHandler(controller.listTemplates));
