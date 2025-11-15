import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/geospatialController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 100 }));

router.post('/walkability', authorize('geospatial.analyze'), asyncHandler(controller.calculateWalkability));
router.post('/crime-analysis', authorize('geospatial.analyze'), asyncHandler(controller.analyzeCrime));
router.post('/traffic-patterns', authorize('geospatial.analyze'), asyncHandler(controller.analyzeTraffic));
router.post('/environmental-risk', authorize('geospatial.analyze'), asyncHandler(controller.assessEnvironmentalRisk));
router.post('/zoning-analysis', authorize('geospatial.analyze'), asyncHandler(controller.analyzeZoning));
router.post('/demographics', authorize('geospatial.analyze'), asyncHandler(controller.analyzeDemographics));
router.post('/growth-trajectory', authorize('geospatial.analyze'), asyncHandler(controller.predictGrowth));
router.post('/location-score', authorize('geospatial.analyze'), asyncHandler(controller.calculateLocationScore));

export { router };
