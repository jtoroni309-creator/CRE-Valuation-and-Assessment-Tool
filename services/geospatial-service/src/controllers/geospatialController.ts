import { Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '@axxiom/shared';
import * as geospatialService from '../services/geospatialService';

const LocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  propertyId: z.string().uuid().optional(),
});

const ZoningSchema = LocationSchema.extend({
  radius: z.number().positive().optional(),
});

const DemographicsSchema = LocationSchema.extend({
  radius: z.number().positive().optional(),
});

export async function calculateWalkability(req: Request, res: Response) {
  const data = LocationSchema.parse(req.body);
  const tenantId = req.tenantId!;
  logger.info({ tenantId, location: data }, 'Calculating walkability score');
  const result = await geospatialService.calculateWalkability(tenantId, data);
  res.json({ success: true, data: result });
}

export async function analyzeCrime(req: Request, res: Response) {
  const data = LocationSchema.parse(req.body);
  const tenantId = req.tenantId!;
  logger.info({ tenantId, location: data }, 'Analyzing crime patterns');
  const result = await geospatialService.analyzeCrime(tenantId, data);
  res.json({ success: true, data: result });
}

export async function analyzeTraffic(req: Request, res: Response) {
  const data = LocationSchema.parse(req.body);
  const tenantId = req.tenantId!;
  logger.info({ tenantId, location: data }, 'Analyzing traffic patterns');
  const result = await geospatialService.analyzeTraffic(tenantId, data);
  res.json({ success: true, data: result });
}

export async function assessEnvironmentalRisk(req: Request, res: Response) {
  const data = LocationSchema.parse(req.body);
  const tenantId = req.tenantId!;
  logger.info({ tenantId, location: data }, 'Assessing environmental risk');
  const result = await geospatialService.assessEnvironmentalRisk(tenantId, data);
  res.json({ success: true, data: result });
}

export async function analyzeZoning(req: Request, res: Response) {
  const data = ZoningSchema.parse(req.body);
  const tenantId = req.tenantId!;
  logger.info({ tenantId, location: data }, 'Analyzing zoning');
  const result = await geospatialService.analyzeZoning(tenantId, data);
  res.json({ success: true, data: result });
}

export async function analyzeDemographics(req: Request, res: Response) {
  const data = DemographicsSchema.parse(req.body);
  const tenantId = req.tenantId!;
  logger.info({ tenantId, location: data }, 'Analyzing demographics');
  const result = await geospatialService.analyzeDemographics(tenantId, data);
  res.json({ success: true, data: result });
}

export async function predictGrowth(req: Request, res: Response) {
  const data = LocationSchema.parse(req.body);
  const tenantId = req.tenantId!;
  logger.info({ tenantId, location: data }, 'Predicting growth trajectory');
  const result = await geospatialService.predictGrowth(tenantId, data);
  res.json({ success: true, data: result });
}

export async function calculateLocationScore(req: Request, res: Response) {
  const data = LocationSchema.parse(req.body);
  const tenantId = req.tenantId!;
  logger.info({ tenantId, location: data }, 'Calculating composite location score');
  const result = await geospatialService.calculateLocationScore(tenantId, data);
  res.json({ success: true, data: result });
}
