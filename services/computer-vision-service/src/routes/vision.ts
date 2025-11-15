import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/visionController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 50 }));

router.post('/analyze/condition', authorize('vision.analyze'), asyncHandler(controller.analyzeCondition));
router.post('/analyze/defects', authorize('vision.analyze'), asyncHandler(controller.detectDefects));
router.post('/analyze/features', authorize('vision.analyze'), asyncHandler(controller.detectFeatures));
router.post('/estimate/sqft', authorize('vision.analyze'), asyncHandler(controller.estimateSquareFeet));

export { router };
