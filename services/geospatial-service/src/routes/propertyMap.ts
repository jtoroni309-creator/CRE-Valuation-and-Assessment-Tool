import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/propertyMapController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 200 }));

// Get properties for map visualization
router.get('/properties', authorize('geospatial.view'), asyncHandler(controller.getPropertiesForMap));

// Get property clusters for different zoom levels
router.get('/clusters', authorize('geospatial.view'), asyncHandler(controller.getPropertyClusters));

// Get 3D visualization data for specific property
router.get('/properties/:propertyId/3d', authorize('geospatial.view'), asyncHandler(controller.getProperty3DData));

// Get heatmap data for value/sqft/age
router.get('/heatmap', authorize('geospatial.view'), asyncHandler(controller.getMapHeatmapData));

export { router };
