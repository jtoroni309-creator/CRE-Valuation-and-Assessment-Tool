/**
 * Portfolio management routes
 */

import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/portfolioController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 100 }));

/**
 * GET /api/v1/portfolios
 * List portfolios
 */
router.get('/', authorize('portfolios.read'), asyncHandler(controller.listPortfolios));

/**
 * POST /api/v1/portfolios
 * Create new portfolio
 */
router.post('/', authorize('portfolios.create'), asyncHandler(controller.createPortfolio));

/**
 * GET /api/v1/portfolios/:portfolioId
 * Get portfolio details
 */
router.get('/:portfolioId', authorize('portfolios.read'), asyncHandler(controller.getPortfolio));

/**
 * PATCH /api/v1/portfolios/:portfolioId
 * Update portfolio
 */
router.patch('/:portfolioId', authorize('portfolios.update'), asyncHandler(controller.updatePortfolio));

/**
 * DELETE /api/v1/portfolios/:portfolioId
 * Delete portfolio
 */
router.delete('/:portfolioId', authorize('portfolios.delete'), asyncHandler(controller.deletePortfolio));

/**
 * POST /api/v1/portfolios/:portfolioId/properties
 * Add properties to portfolio
 */
router.post('/:portfolioId/properties', authorize('portfolios.update'), asyncHandler(controller.addProperties));

/**
 * DELETE /api/v1/portfolios/:portfolioId/properties/:propertyId
 * Remove property from portfolio
 */
router.delete('/:portfolioId/properties/:propertyId', authorize('portfolios.update'), asyncHandler(controller.removeProperty));

/**
 * GET /api/v1/portfolios/:portfolioId/dashboard
 * Get portfolio dashboard
 */
router.get('/:portfolioId/dashboard', authorize('portfolios.read'), asyncHandler(controller.getDashboard));

/**
 * POST /api/v1/portfolios/:portfolioId/revalue
 * Trigger portfolio revaluation
 */
router.post('/:portfolioId/revalue', authorize('portfolios.revalue'), asyncHandler(controller.revaluePortfolio));
