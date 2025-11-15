/**
 * Portfolio controller - Portfolio management handlers
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { logger, calculatePagination } from '@axxiom/shared';
import * as portfolioService from '../services/portfolioService';

const CreatePortfolioSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  propertyIds: z.array(z.string().uuid()).optional(),
  revaluationFrequency: z.enum(['monthly', 'quarterly', 'annual']).default('quarterly'),
});

const UpdatePortfolioSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  revaluationFrequency: z.enum(['monthly', 'quarterly', 'annual']).optional(),
});

const AddPropertiesSchema = z.object({
  propertyIds: z.array(z.string().uuid()).min(1),
});

/**
 * List portfolios
 */
export async function listPortfolios(req: Request, res: Response) {
  const tenantId = req.tenantId!;
  const { limit, offset } = calculatePagination(req);

  const portfolios = await portfolioService.listPortfolios(tenantId, limit, offset);

  res.json({ success: true, data: portfolios });
}

/**
 * Create portfolio
 */
export async function createPortfolio(req: Request, res: Response) {
  const data = CreatePortfolioSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, name: data.name }, 'Creating portfolio');

  const portfolio = await portfolioService.createPortfolio(tenantId, userId, data);

  res.status(201).json({ success: true, data: portfolio });
}

/**
 * Get portfolio
 */
export async function getPortfolio(req: Request, res: Response) {
  const { portfolioId } = req.params;
  const tenantId = req.tenantId!;

  const portfolio = await portfolioService.getPortfolio(tenantId, portfolioId);

  res.json({ success: true, data: portfolio });
}

/**
 * Update portfolio
 */
export async function updatePortfolio(req: Request, res: Response) {
  const { portfolioId } = req.params;
  const data = UpdatePortfolioSchema.parse(req.body);
  const tenantId = req.tenantId!;

  const portfolio = await portfolioService.updatePortfolio(tenantId, portfolioId, data);

  res.json({ success: true, data: portfolio });
}

/**
 * Delete portfolio
 */
export async function deletePortfolio(req: Request, res: Response) {
  const { portfolioId } = req.params;
  const tenantId = req.tenantId!;

  await portfolioService.deletePortfolio(tenantId, portfolioId);

  res.json({ success: true, message: 'Portfolio deleted' });
}

/**
 * Add properties
 */
export async function addProperties(req: Request, res: Response) {
  const { portfolioId } = req.params;
  const data = AddPropertiesSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, portfolioId, count: data.propertyIds.length }, 'Adding properties to portfolio');

  const result = await portfolioService.addProperties(tenantId, portfolioId, data.propertyIds);

  res.json({ success: true, data: result });
}

/**
 * Remove property
 */
export async function removeProperty(req: Request, res: Response) {
  const { portfolioId, propertyId } = req.params;
  const tenantId = req.tenantId!;

  await portfolioService.removeProperty(tenantId, portfolioId, propertyId);

  res.json({ success: true, message: 'Property removed from portfolio' });
}

/**
 * Get dashboard
 */
export async function getDashboard(req: Request, res: Response) {
  const { portfolioId } = req.params;
  const tenantId = req.tenantId!;

  const dashboard = await portfolioService.getDashboard(tenantId, portfolioId);

  res.json({ success: true, data: dashboard });
}

/**
 * Revalue portfolio
 */
export async function revaluePortfolio(req: Request, res: Response) {
  const { portfolioId } = req.params;
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, portfolioId }, 'Triggering portfolio revaluation');

  const result = await portfolioService.revaluePortfolio(tenantId, userId, portfolioId);

  res.json({ success: true, data: result });
}
