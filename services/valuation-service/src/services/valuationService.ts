/**
 * Valuation Service
 * Business logic for valuation operations
 */

import { Valuation, ValuationApproach, ValuationStatus, Comparable, ConflictError, logger } from '@axxiom/shared';
import { query, transaction } from '../database';
import { getOffset } from '@axxiom/shared';

// ============================================================================
// Types
// ============================================================================

export interface CreateValuationInput {
  propertyId: string;
  approach: ValuationApproach;
  valuationDate: Date;
  notes?: string;
}

export interface UpdateValuationInput {
  approach?: ValuationApproach;
  valuationDate?: Date;
  notes?: string;
  status?: ValuationStatus;
}

export interface ListValuationsFilters {
  page: number;
  limit: number;
  propertyId?: string;
  status?: ValuationStatus;
  approach?: ValuationApproach;
  createdAfter?: Date;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * List valuations with pagination and filters
 */
export async function listValuations(
  tenantId: string,
  filters: ListValuationsFilters
): Promise<{ valuations: Valuation[]; totalCount: number }> {
  const offset = getOffset(filters.page, filters.limit);

  // Build WHERE clauses
  const whereClauses: string[] = ['tenant_id = $1'];
  const params: any[] = [tenantId];
  let paramIndex = 2;

  if (filters.propertyId) {
    whereClauses.push(`property_id = $${paramIndex++}`);
    params.push(filters.propertyId);
  }

  if (filters.status) {
    whereClauses.push(`status = $${paramIndex++}`);
    params.push(filters.status);
  }

  if (filters.approach) {
    whereClauses.push(`approach = $${paramIndex++}`);
    params.push(filters.approach);
  }

  if (filters.createdAfter) {
    whereClauses.push(`created_at >= $${paramIndex++}`);
    params.push(filters.createdAfter);
  }

  const whereClause = whereClauses.join(' AND ');

  // Get total count
  const countResult = await query(
    `SELECT COUNT(*) as total FROM valuations WHERE ${whereClause}`,
    params,
    tenantId
  );
  const totalCount = parseInt(countResult.rows[0].total, 10);

  // Get paginated results
  params.push(filters.limit, offset);
  const result = await query<Valuation>(
    `SELECT * FROM valuations
     WHERE ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
    params,
    tenantId
  );

  return {
    valuations: result.rows,
    totalCount,
  };
}

/**
 * Create a new valuation
 */
export async function createValuation(
  tenantId: string,
  userId: string,
  input: CreateValuationInput
): Promise<Valuation> {
  logger.info(
    {
      tenantId,
      userId,
      propertyId: input.propertyId,
    },
    'Creating valuation'
  );

  return transaction(async (client) => {
    // TODO: Verify property exists and belongs to tenant

    // Create valuation record
    const result = await client.query<Valuation>(
      `INSERT INTO valuations (
        tenant_id, property_id, valuation_date, approach,
        status, created_by, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *`,
      [tenantId, input.propertyId, input.valuationDate, input.approach, 'draft', userId]
    );

    const valuation = result.rows[0];

    // TODO: Trigger valuation model inference asynchronously
    // This would call the ML service to compute the valuation

    // TODO: Select comparable properties
    // This would call the comps service to find similar properties

    logger.info(
      {
        valuationId: valuation.valuationId,
        tenantId,
      },
      'Valuation created successfully'
    );

    return valuation;
  }, tenantId);
}

/**
 * Get a valuation by ID
 */
export async function getValuation(
  tenantId: string,
  valuationId: string
): Promise<Valuation | null> {
  const result = await query<Valuation>(
    `SELECT * FROM valuations WHERE valuation_id = $1 AND tenant_id = $2`,
    [valuationId, tenantId],
    tenantId
  );

  return result.rows[0] || null;
}

/**
 * Update a valuation
 */
export async function updateValuation(
  tenantId: string,
  valuationId: string,
  input: UpdateValuationInput
): Promise<Valuation | null> {
  return transaction(async (client) => {
    // Get existing valuation
    const existing = await client.query<Valuation>(
      `SELECT * FROM valuations WHERE valuation_id = $1 AND tenant_id = $2 FOR UPDATE`,
      [valuationId, tenantId]
    );

    if (existing.rows.length === 0) {
      return null;
    }

    const current = existing.rows[0];

    // Can only update draft or pending valuations
    if (current.status === 'approved' || current.status === 'rejected') {
      throw new ConflictError(
        `Cannot update valuation with status '${current.status}'`
      );
    }

    // Build UPDATE SET clauses
    const setClauses: string[] = ['updated_at = NOW()'];
    const params: any[] = [];
    let paramIndex = 1;

    if (input.approach !== undefined) {
      setClauses.push(`approach = $${paramIndex++}`);
      params.push(input.approach);
    }

    if (input.valuationDate !== undefined) {
      setClauses.push(`valuation_date = $${paramIndex++}`);
      params.push(input.valuationDate);
    }

    if (input.status !== undefined) {
      setClauses.push(`status = $${paramIndex++}`);
      params.push(input.status);
    }

    params.push(valuationId, tenantId);

    const result = await client.query<Valuation>(
      `UPDATE valuations
       SET ${setClauses.join(', ')}
       WHERE valuation_id = $${paramIndex++} AND tenant_id = $${paramIndex}
       RETURNING *`,
      params
    );

    logger.info(
      {
        valuationId,
        tenantId,
      },
      'Valuation updated successfully'
    );

    return result.rows[0];
  }, tenantId);
}

/**
 * Delete a valuation (draft only)
 */
export async function deleteValuation(
  tenantId: string,
  valuationId: string
): Promise<boolean> {
  return transaction(async (client) => {
    // Get existing valuation
    const existing = await client.query<Valuation>(
      `SELECT * FROM valuations WHERE valuation_id = $1 AND tenant_id = $2 FOR UPDATE`,
      [valuationId, tenantId]
    );

    if (existing.rows.length === 0) {
      return false;
    }

    const current = existing.rows[0];

    // Can only delete draft valuations
    if (current.status !== 'draft') {
      throw new ConflictError('Can only delete draft valuations');
    }

    // Delete associated records (comparables, explanations, etc.)
    await client.query(
      `DELETE FROM comparables WHERE valuation_id = $1`,
      [valuationId]
    );

    await client.query(
      `DELETE FROM explanations WHERE valuation_id = $1`,
      [valuationId]
    );

    // Delete valuation
    await client.query(
      `DELETE FROM valuations WHERE valuation_id = $1 AND tenant_id = $2`,
      [valuationId, tenantId]
    );

    logger.info(
      {
        valuationId,
        tenantId,
      },
      'Valuation deleted successfully'
    );

    return true;
  }, tenantId);
}

/**
 * Approve a valuation
 */
export async function approveValuation(
  tenantId: string,
  valuationId: string,
  userId: string,
  notes?: string
): Promise<Valuation | null> {
  return transaction(async (client) => {
    // Get existing valuation
    const existing = await client.query<Valuation>(
      `SELECT * FROM valuations WHERE valuation_id = $1 AND tenant_id = $2 FOR UPDATE`,
      [valuationId, tenantId]
    );

    if (existing.rows.length === 0) {
      return null;
    }

    const current = existing.rows[0];

    // Can only approve pending valuations
    if (current.status !== 'pending') {
      throw new ConflictError(
        `Cannot approve valuation with status '${current.status}'. Must be 'pending'.`
      );
    }

    // Update valuation
    const result = await client.query<Valuation>(
      `UPDATE valuations
       SET status = 'approved', approved_by = $1, updated_at = NOW()
       WHERE valuation_id = $2 AND tenant_id = $3
       RETURNING *`,
      [userId, valuationId, tenantId]
    );

    logger.info(
      {
        valuationId,
        tenantId,
        approvedBy: userId,
      },
      'Valuation approved successfully'
    );

    // TODO: Trigger notification event
    // TODO: Generate default report

    return result.rows[0];
  }, tenantId);
}

/**
 * Get comparables for a valuation
 */
export async function getValuationComparables(
  tenantId: string,
  valuationId: string
): Promise<Comparable[]> {
  // TODO: Verify valuation exists

  const result = await query<Comparable>(
    `SELECT c.*, p.*
     FROM comparables c
     JOIN properties p ON c.comp_property_id = p.property_id
     WHERE c.valuation_id = $1
     ORDER BY c.similarity_score DESC, c.distance_miles ASC`,
    [valuationId],
    tenantId
  );

  return result.rows;
}

/**
 * Get AI/ML explanations for a valuation
 */
export async function getValuationExplanations(
  tenantId: string,
  valuationId: string
): Promise<any> {
  // TODO: Verify valuation exists

  const result = await query(
    `SELECT * FROM explanations WHERE valuation_id = $1`,
    [valuationId],
    tenantId
  );

  if (result.rows.length === 0) {
    return null;
  }

  const explanation = result.rows[0];

  return {
    valuationId,
    featureImportance: explanation.feature_importance || {},
    narrative: explanation.narrative,
    comparableRationale: explanation.comparable_rationale,
    adjustmentsSummary: explanation.adjustments_summary,
    modelDetails: {
      modelName: explanation.model_name,
      modelVersion: explanation.model_version,
      trainingDate: explanation.training_date,
      accuracyMetrics: explanation.accuracy_metrics,
    },
  };
}
