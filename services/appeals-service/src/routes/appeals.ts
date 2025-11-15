/**
 * Appeals routes
 */

import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/appealsController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 100 }));

/**
 * GET /api/v1/appeals
 * List appeal cases
 */
router.get('/', authorize('appeals.read'), asyncHandler(controller.listAppeals));

/**
 * POST /api/v1/appeals
 * Create new appeal case
 */
router.post('/', authorize('appeals.create'), asyncHandler(controller.createAppeal));

/**
 * GET /api/v1/appeals/:appealId
 * Get appeal details
 */
router.get('/:appealId', authorize('appeals.read'), asyncHandler(controller.getAppeal));

/**
 * PATCH /api/v1/appeals/:appealId
 * Update appeal case
 */
router.patch('/:appealId', authorize('appeals.update'), asyncHandler(controller.updateAppeal));

/**
 * POST /api/v1/appeals/:appealId/evidence
 * Add evidence to appeal
 */
router.post('/:appealId/evidence', authorize('appeals.update'), asyncHandler(controller.addEvidence));

/**
 * GET /api/v1/appeals/:appealId/evidence
 * List appeal evidence
 */
router.get('/:appealId/evidence', authorize('appeals.read'), asyncHandler(controller.listEvidence));

/**
 * POST /api/v1/appeals/:appealId/generate-argument
 * AI-generate appeal argument
 */
router.post('/:appealId/generate-argument', authorize('appeals.update'), asyncHandler(controller.generateArgument));

/**
 * POST /api/v1/appeals/:appealId/schedule-hearing
 * Schedule hearing
 */
router.post('/:appealId/schedule-hearing', authorize('appeals.update'), asyncHandler(controller.scheduleHearing));

/**
 * POST /api/v1/appeals/:appealId/submit
 * Submit appeal to board
 */
router.post('/:appealId/submit', authorize('appeals.submit'), asyncHandler(controller.submitAppeal));

/**
 * POST /api/v1/appeals/:appealId/decision
 * Record appeal decision
 */
router.post('/:appealId/decision', authorize('appeals.decide'), asyncHandler(controller.recordDecision));

/**
 * GET /api/v1/appeals/:appealId/timeline
 * Get appeal timeline/activity
 */
router.get('/:appealId/timeline', authorize('appeals.read'), asyncHandler(controller.getTimeline));

/**
 * GET /api/v1/appeals/statistics/overview
 * Get appeals statistics
 */
router.get('/statistics/overview', authorize('appeals.read'), asyncHandler(controller.getStatistics));
