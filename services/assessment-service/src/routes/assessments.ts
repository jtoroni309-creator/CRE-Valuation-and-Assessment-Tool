/**
 * Assessment routes
 */

import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/assessmentController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 100 }));

/**
 * GET /api/v1/assessments/runs
 * List assessment runs for a jurisdiction
 */
router.get('/runs', authorize('assessments.read'), asyncHandler(controller.listAssessmentRuns));

/**
 * POST /api/v1/assessments/runs
 * Create a new assessment run
 */
router.post('/runs', authorize('assessments.create'), asyncHandler(controller.createAssessmentRun));

/**
 * GET /api/v1/assessments/runs/:runId
 * Get assessment run details
 */
router.get('/runs/:runId', authorize('assessments.read'), asyncHandler(controller.getAssessmentRun));

/**
 * POST /api/v1/assessments/runs/:runId/execute
 * Execute mass appraisal for an assessment run
 */
router.post('/runs/:runId/execute', authorize('assessments.execute'), asyncHandler(controller.executeAssessmentRun));

/**
 * GET /api/v1/assessments/runs/:runId/properties
 * List properties in an assessment run
 */
router.get('/runs/:runId/properties', authorize('assessments.read'), asyncHandler(controller.listAssessmentProperties));

/**
 * POST /api/v1/assessments/runs/:runId/approve
 * Approve an assessment run (lock values)
 */
router.post('/runs/:runId/approve', authorize('assessments.approve'), asyncHandler(controller.approveAssessmentRun));

/**
 * GET /api/v1/assessments/runs/:runId/statistics
 * Get statistical analysis for an assessment run
 */
router.get('/runs/:runId/statistics', authorize('assessments.read'), asyncHandler(controller.getAssessmentStatistics));

/**
 * GET /api/v1/assessments/runs/:runId/equity-analysis
 * Get equity analysis and assessment ratios
 */
router.get('/runs/:runId/equity-analysis', authorize('assessments.read'), asyncHandler(controller.getEquityAnalysis));

/**
 * POST /api/v1/assessments/runs/:runId/generate-notices
 * Generate assessment notices for property owners
 */
router.post('/runs/:runId/generate-notices', authorize('assessments.execute'), asyncHandler(controller.generateNotices));
