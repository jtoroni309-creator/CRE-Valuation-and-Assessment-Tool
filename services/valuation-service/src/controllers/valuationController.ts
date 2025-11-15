/**
 * Valuation Controller
 * Handles HTTP requests for valuation operations
 */

import { Request, Response } from 'express';
import {
  NotFoundError,
  ConflictError,
  validate,
  CommonSchemas,
  calculatePagination,
  logger,
} from '@axxiom/shared';
import { z } from 'zod';
import * as valuationService from '../services/valuationService';

// ============================================================================
// Validation Schemas
// ============================================================================

const CreateValuationSchema = z.object({
  propertyId: CommonSchemas.uuid,
  approach: z.enum(['sales_comparison', 'income', 'cost', 'reconciled']),
  valuationDate: z.string().datetime().or(z.date()),
  notes: z.string().max(2000).optional(),
});

const UpdateValuationSchema = z.object({
  approach: z.enum(['sales_comparison', 'income', 'cost', 'reconciled']).optional(),
  valuationDate: z.string().datetime().or(z.date()).optional(),
  notes: z.string().max(2000).optional(),
  status: z.enum(['draft', 'pending']).optional(),
});

const ListValuationsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  propertyId: CommonSchemas.uuid.optional(),
  status: z.enum(['draft', 'pending', 'approved', 'rejected']).optional(),
  approach: z.enum(['sales_comparison', 'income', 'cost', 'reconciled']).optional(),
  createdAfter: z.string().datetime().optional(),
});

// ============================================================================
// Controller Functions
// ============================================================================

/**
 * List valuations with pagination and filtering
 */
export async function listValuations(req: Request, res: Response) {
  const query = ListValuationsQuerySchema.parse(req.query);
  const tenantId = req.tenantId!;

  const { valuations, totalCount } = await valuationService.listValuations(tenantId, {
    page: query.page,
    limit: query.limit,
    propertyId: query.propertyId,
    status: query.status,
    approach: query.approach,
    createdAfter: query.createdAfter ? new Date(query.createdAfter) : undefined,
  });

  const pagination = calculatePagination(
    { page: query.page, limit: query.limit },
    totalCount
  );

  res.json({
    success: true,
    data: valuations,
    pagination,
  });
}

/**
 * Create a new valuation
 */
export async function createValuation(req: Request, res: Response) {
  const data = CreateValuationSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info(
    {
      tenantId,
      userId,
      propertyId: data.propertyId,
      approach: data.approach,
    },
    'Creating valuation'
  );

  const valuation = await valuationService.createValuation(tenantId, userId, {
    propertyId: data.propertyId,
    approach: data.approach,
    valuationDate: new Date(data.valuationDate),
    notes: data.notes,
  });

  res.status(201).json({
    success: true,
    data: valuation,
  });
}

/**
 * Get a specific valuation
 */
export async function getValuation(req: Request, res: Response) {
  const { valuationId } = req.params;
  const tenantId = req.tenantId!;

  const valuation = await valuationService.getValuation(tenantId, valuationId);

  if (!valuation) {
    throw new NotFoundError('Valuation', valuationId);
  }

  res.json({
    success: true,
    data: valuation,
  });
}

/**
 * Update a valuation
 */
export async function updateValuation(req: Request, res: Response) {
  const { valuationId } = req.params;
  const data = UpdateValuationSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info(
    {
      tenantId,
      valuationId,
      updates: Object.keys(data),
    },
    'Updating valuation'
  );

  const valuation = await valuationService.updateValuation(tenantId, valuationId, {
    approach: data.approach,
    valuationDate: data.valuationDate ? new Date(data.valuationDate) : undefined,
    notes: data.notes,
    status: data.status,
  });

  if (!valuation) {
    throw new NotFoundError('Valuation', valuationId);
  }

  res.json({
    success: true,
    data: valuation,
  });
}

/**
 * Delete a valuation (draft only)
 */
export async function deleteValuation(req: Request, res: Response) {
  const { valuationId } = req.params;
  const tenantId = req.tenantId!;

  logger.info(
    {
      tenantId,
      valuationId,
    },
    'Deleting valuation'
  );

  const deleted = await valuationService.deleteValuation(tenantId, valuationId);

  if (!deleted) {
    throw new NotFoundError('Valuation', valuationId);
  }

  res.status(204).send();
}

/**
 * Approve a valuation
 */
export async function approveValuation(req: Request, res: Response) {
  const { valuationId } = req.params;
  const { notes } = req.body;
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info(
    {
      tenantId,
      valuationId,
      approvedBy: userId,
    },
    'Approving valuation'
  );

  const valuation = await valuationService.approveValuation(
    tenantId,
    valuationId,
    userId,
    notes
  );

  if (!valuation) {
    throw new NotFoundError('Valuation', valuationId);
  }

  res.json({
    success: true,
    data: valuation,
  });
}

/**
 * Get comparables for a valuation
 */
export async function getValuationComparables(req: Request, res: Response) {
  const { valuationId } = req.params;
  const tenantId = req.tenantId!;

  const comparables = await valuationService.getValuationComparables(
    tenantId,
    valuationId
  );

  res.json({
    success: true,
    data: comparables,
  });
}

/**
 * Get AI/ML explanations for a valuation
 */
export async function getValuationExplanations(req: Request, res: Response) {
  const { valuationId } = req.params;
  const tenantId = req.tenantId!;

  const explanation = await valuationService.getValuationExplanations(
    tenantId,
    valuationId
  );

  if (!explanation) {
    throw new NotFoundError('Explanation for valuation', valuationId);
  }

  res.json({
    success: true,
    data: explanation,
  });
}
