import { Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '@axxiom/shared';
import * as propertyMapService from '../services/propertyMapService';

const BoundsSchema = z.object({
  north: z.number().min(-90).max(90),
  south: z.number().min(-90).max(90),
  east: z.number().min(-180).max(180),
  west: z.number().min(-180).max(180),
});

const PropertyFilterSchema = z.object({
  propertyType: z.enum(['office', 'retail', 'industrial', 'multifamily', 'hospitality', 'mixed_use', 'land']).optional(),
  minValue: z.number().positive().optional(),
  maxValue: z.number().positive().optional(),
  minSqft: z.number().positive().optional(),
  maxSqft: z.number().positive().optional(),
  bounds: BoundsSchema.optional(),
  limit: z.number().int().positive().max(1000).optional(),
});

export async function getPropertiesForMap(req: Request, res: Response) {
  const filters = PropertyFilterSchema.parse(req.query);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, filters }, 'Fetching properties for map visualization');

  const properties = await propertyMapService.getPropertiesWithLocation(tenantId, filters);

  res.json({
    success: true,
    data: {
      type: 'FeatureCollection',
      features: properties.map((property) => ({
        type: 'Feature',
        id: property.id,
        geometry: {
          type: 'Point',
          coordinates: [property.longitude, property.latitude],
        },
        properties: {
          id: property.id,
          address: property.address,
          propertyType: property.property_type,
          squareFeet: property.square_feet,
          assessedValue: property.assessed_value,
          marketValue: property.market_value,
          yearBuilt: property.year_built,
          imageUrl: property.image_url,
          status: property.status,
        },
      })),
    },
  });
}

export async function getPropertyClusters(req: Request, res: Response) {
  const data = z.object({
    zoom: z.number().int().min(0).max(22),
    bounds: BoundsSchema,
  }).parse(req.query);

  const tenantId = req.tenantId!;

  logger.info({ tenantId, zoom: data.zoom }, 'Fetching property clusters for map');

  const clusters = await propertyMapService.getPropertyClusters(tenantId, data.zoom, data.bounds);

  res.json({ success: true, data: clusters });
}

export async function getProperty3DData(req: Request, res: Response) {
  const propertyId = z.string().uuid().parse(req.params.propertyId);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, propertyId }, 'Fetching 3D property data');

  const propertyData = await propertyMapService.getProperty3DVisualization(tenantId, propertyId);

  res.json({ success: true, data: propertyData });
}

export async function getMapHeatmapData(req: Request, res: Response) {
  const data = z.object({
    metric: z.enum(['value', 'sqft', 'age', 'assessment_ratio']),
    bounds: BoundsSchema,
  }).parse(req.query);

  const tenantId = req.tenantId!;

  logger.info({ tenantId, metric: data.metric }, 'Fetching heatmap data');

  const heatmapData = await propertyMapService.getHeatmapData(tenantId, data.metric, data.bounds);

  res.json({ success: true, data: heatmapData });
}
