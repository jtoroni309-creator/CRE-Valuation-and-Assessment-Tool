/**
 * Data source management routes
 */

import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/sourcesController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 100 }));

/**
 * GET /api/v1/sources
 * List configured data sources
 */
router.get('/', authorize('sources.read'), asyncHandler(controller.listSources));

/**
 * POST /api/v1/sources
 * Configure new data source
 */
router.post('/', authorize('sources.manage'), asyncHandler(controller.createSource));

/**
 * GET /api/v1/sources/:sourceId
 * Get data source details
 */
router.get('/:sourceId', authorize('sources.read'), asyncHandler(controller.getSource));

/**
 * PATCH /api/v1/sources/:sourceId
 * Update data source configuration
 */
router.patch('/:sourceId', authorize('sources.manage'), asyncHandler(controller.updateSource));

/**
 * DELETE /api/v1/sources/:sourceId
 * Delete data source
 */
router.delete('/:sourceId', authorize('sources.manage'), asyncHandler(controller.deleteSource));

/**
 * POST /api/v1/sources/:sourceId/test
 * Test data source connection
 */
router.post('/:sourceId/test', authorize('sources.manage'), asyncHandler(controller.testSource));

/**
 * GET /api/v1/sources/:sourceId/statistics
 * Get data source statistics
 */
router.get('/:sourceId/statistics', authorize('sources.read'), asyncHandler(controller.getSourceStatistics));
