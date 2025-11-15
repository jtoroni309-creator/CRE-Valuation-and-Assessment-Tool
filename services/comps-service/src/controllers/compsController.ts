/**
 * Comparable properties controller
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { logger, calculatePagination } from '@axxiom/shared';
import * as compsService from '../services/compsService';

const SearchCompsSchema = z.object({
  propertyType: z.enum(['office', 'retail', 'industrial', 'multifamily', 'hotel', 'mixed_use', 'land', 'special_purpose']),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    radiusMiles: z.number().default(5),
  }),
  minSqft: z.number().optional(),
  maxSqft: z.number().optional(),
  minSaleDate: z.string().optional(),
  maxSaleDate: z.string().optional(),
  limit: z.number().min(1).max(50).default(10),
});

const SimilaritySchema = z.object({
  subjectPropertyId: z.string().uuid(),
  compPropertyId: z.string().uuid(),
});

/**
 * Search for comparable properties
 */
export async function searchComparables(req: Request, res: Response) {
  const data = SearchCompsSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, propertyType: data.propertyType, radius: data.location.radiusMiles }, 'Searching comparables');

  const comparables = await compsService.searchComparables(tenantId, {
    propertyType: data.propertyType,
    latitude: data.location.latitude,
    longitude: data.location.longitude,
    radiusMiles: data.location.radiusMiles,
    minSqft: data.minSqft,
    maxSqft: data.maxSqft,
    minSaleDate: data.minSaleDate ? new Date(data.minSaleDate) : undefined,
    maxSaleDate: data.maxSaleDate ? new Date(data.maxSaleDate) : undefined,
    limit: data.limit,
  });

  res.json({ success: true, data: comparables });
}

/**
 * Get AI-suggested comparables for a property
 */
export async function getSuggestions(req: Request, res: Response) {
  const { propertyId } = req.params;
  const tenantId = req.tenantId!;
  const limit = parseInt(req.query.limit as string) || 10;

  logger.info({ tenantId, propertyId }, 'Getting comp suggestions');

  const suggestions = await compsService.getSuggestedComps(tenantId, propertyId, limit);

  res.json({ success: true, data: suggestions });
}

/**
 * Calculate similarity score between properties
 */
export async function calculateSimilarity(req: Request, res: Response) {
  const data = SimilaritySchema.parse(req.body);
  const tenantId = req.tenantId!;

  const similarity = await compsService.calculateSimilarityScore(
    tenantId,
    data.subjectPropertyId,
    data.compPropertyId
  );

  res.json({ success: true, data: similarity });
}
