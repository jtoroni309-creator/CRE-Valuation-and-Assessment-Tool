/**
 * Analytics routes
 */

import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/analyticsController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 50 }));

/**
 * POST /api/v1/analytics/variance
 * Analyze portfolio variance
 */
router.post('/variance', authorize('analytics.read'), asyncHandler(controller.analyzeVariance));

/**
 * POST /api/v1/analytics/appeal-opportunities
 * Identify appeal opportunities
 */
router.post('/appeal-opportunities', authorize('analytics.read'), asyncHandler(controller.findAppealOpportunities));

/**
 * POST /api/v1/analytics/scenario
 * Run scenario analysis
 */
router.post('/scenario', authorize('analytics.read'), asyncHandler(controller.runScenario));

/**
 * POST /api/v1/analytics/benchmarking
 * Benchmark portfolio performance
 */
router.post('/benchmarking', authorize('analytics.read'), asyncHandler(controller.benchmarkPortfolio));

/**
 * POST /api/v1/analytics/risk-scoring
 * Calculate portfolio risk scores
 */
router.post('/risk-scoring', authorize('analytics.read'), asyncHandler(controller.calculateRiskScores));

/**
 * POST /api/v1/analytics/optimization
 * Optimize portfolio tax burden
 */
router.post('/optimization', authorize('analytics.read'), asyncHandler(controller.optimizeTaxBurden));

/**
 * GET /api/v1/analytics/trends
 * Get portfolio trends over time
 */
router.get('/trends', authorize('analytics.read'), asyncHandler(controller.getTrends));
