/**
 * Comparable property routes
 */

import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/compsController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 200 }));

/**
 * POST /api/v1/comparables/search
 * Search for comparable properties
 */
router.post('/search', authorize('properties.read'), asyncHandler(controller.searchComparables));

/**
 * GET /api/v1/comparables/:propertyId/suggestions
 * Get AI-suggested comparables for a property
 */
router.get('/:propertyId/suggestions', authorize('properties.read'), asyncHandler(controller.getSuggestions));

/**
 * POST /api/v1/comparables/calculate-similarity
 * Calculate similarity score between two properties
 */
router.post('/calculate-similarity', authorize('properties.read'), asyncHandler(controller.calculateSimilarity));
