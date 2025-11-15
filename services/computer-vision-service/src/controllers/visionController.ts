import { Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '@axxiom/shared';
import * as visionService from '../services/visionService';

const AnalyzeImageSchema = z.object({
  imageUrl: z.string().url().optional(),
  imageBase64: z.string().optional(),
  propertyId: z.string().uuid().optional(),
});

export async function analyzeCondition(req: Request, res: Response) {
  const data = AnalyzeImageSchema.parse(req.body);
  const tenantId = req.tenantId!;
  logger.info({ tenantId }, 'Analyzing property condition');
  const result = await visionService.analyzeCondition(tenantId, data);
  res.json({ success: true, data: result });
}

export async function detectDefects(req: Request, res: Response) {
  const data = AnalyzeImageSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const result = await visionService.detectDefects(tenantId, data);
  res.json({ success: true, data: result });
}

export async function detectFeatures(req: Request, res: Response) {
  const data = AnalyzeImageSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const result = await visionService.detectFeatures(tenantId, data);
  res.json({ success: true, data: result });
}

export async function estimateSquareFeet(req: Request, res: Response) {
  const data = AnalyzeImageSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const result = await visionService.estimateSquareFeet(tenantId, data);
  res.json({ success: true, data: result });
}
