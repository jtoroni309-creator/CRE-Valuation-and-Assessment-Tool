/**
 * Valuation routes
 */

import { Router } from 'express';
import {
  authenticate,
  authorize,
  enforceTenantIsolation,
  rateLimit,
  asyncHandler,
} from '@axxiom/shared';
import * as controller from '../controllers/valuationController';

export const router = Router();

// Apply authentication and tenant isolation to all routes
router.use(authenticate);
router.use(enforceTenantIsolation);

// Rate limiting - 100 requests per 15 minutes
router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    maxRequests: 100,
  })
);

/**
 * GET /api/v1/valuations
 * List valuations with pagination and filters
 */
router.get(
  '/',
  authorize('valuations.read'),
  asyncHandler(controller.listValuations)
);

/**
 * POST /api/v1/valuations
 * Create a new valuation
 */
router.post(
  '/',
  authorize('valuations.create'),
  asyncHandler(controller.createValuation)
);

/**
 * GET /api/v1/valuations/:valuationId
 * Get a specific valuation
 */
router.get(
  '/:valuationId',
  authorize('valuations.read'),
  asyncHandler(controller.getValuation)
);

/**
 * PATCH /api/v1/valuations/:valuationId
 * Update a valuation
 */
router.patch(
  '/:valuationId',
  authorize('valuations.update'),
  asyncHandler(controller.updateValuation)
);

/**
 * DELETE /api/v1/valuations/:valuationId
 * Delete a valuation (draft only)
 */
router.delete(
  '/:valuationId',
  authorize('valuations.delete'),
  asyncHandler(controller.deleteValuation)
);

/**
 * POST /api/v1/valuations/:valuationId/approve
 * Approve a valuation
 */
router.post(
  '/:valuationId/approve',
  authorize('valuations.approve'),
  asyncHandler(controller.approveValuation)
);

/**
 * GET /api/v1/valuations/:valuationId/comparables
 * Get comparables for a valuation
 */
router.get(
  '/:valuationId/comparables',
  authorize('valuations.read'),
  asyncHandler(controller.getValuationComparables)
);

/**
 * GET /api/v1/valuations/:valuationId/explanations
 * Get AI/ML explanations for a valuation
 */
router.get(
  '/:valuationId/explanations',
  authorize('valuations.read'),
  asyncHandler(controller.getValuationExplanations)
);
