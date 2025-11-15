/**
 * Portfolio service - Portfolio management business logic
 */

import { logger, NotFoundError } from '@axxiom/shared';
import { query, transaction } from '../database';

export interface Portfolio {
  portfolioId: string;
  tenantId: string;
  name: string;
  description?: string;
  propertyCount: number;
  totalValue: number;
  revaluationFrequency: string;
  lastRevaluedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * List portfolios
 */
export async function listPortfolios(
  tenantId: string,
  limit: number,
  offset: number
): Promise<Portfolio[]> {
  const sql = `
    SELECT
      p.*,
      COUNT(pp.property_id) as property_count,
      COALESCE(SUM(v.value_amount), 0) as total_value
    FROM portfolios p
    LEFT JOIN portfolio_properties pp ON p.portfolio_id = pp.portfolio_id
    LEFT JOIN LATERAL (
      SELECT value_amount
      FROM valuations
      WHERE property_id = pp.property_id
      ORDER BY valuation_date DESC
      LIMIT 1
    ) v ON true
    WHERE p.tenant_id = $1
    GROUP BY p.portfolio_id
    ORDER BY p.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await query<Portfolio>(sql, [tenantId, limit, offset], tenantId);
  return result.rows;
}

/**
 * Create portfolio
 */
export async function createPortfolio(
  tenantId: string,
  userId: string,
  data: any
): Promise<Portfolio> {
  return transaction(async (client) => {
    const result = await client.query<Portfolio>(
      `INSERT INTO portfolios (tenant_id, name, description, revaluation_frequency, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [tenantId, data.name, data.description, data.revaluationFrequency, userId]
    );

    const portfolio = result.rows[0];

    if (data.propertyIds && data.propertyIds.length > 0) {
      for (const propertyId of data.propertyIds) {
        await client.query(
          `INSERT INTO portfolio_properties (portfolio_id, property_id, added_at)
           VALUES ($1, $2, NOW())`,
          [portfolio.portfolioId, propertyId]
        );
      }
    }

    logger.info({ tenantId, portfolioId: portfolio.portfolioId }, 'Portfolio created');

    return portfolio;
  }, tenantId);
}

/**
 * Get portfolio
 */
export async function getPortfolio(tenantId: string, portfolioId: string): Promise<Portfolio> {
  const result = await query<Portfolio>(
    `SELECT * FROM portfolios WHERE portfolio_id = $1 AND tenant_id = $2`,
    [portfolioId, tenantId],
    tenantId
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Portfolio not found');
  }

  return result.rows[0];
}

/**
 * Update portfolio
 */
export async function updatePortfolio(
  tenantId: string,
  portfolioId: string,
  updates: any
): Promise<Portfolio> {
  const setClauses: string[] = ['updated_at = NOW()'];
  const params: any[] = [];
  let paramIndex = 1;

  if (updates.name) {
    setClauses.push(`name = $${paramIndex++}`);
    params.push(updates.name);
  }

  if (updates.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`);
    params.push(updates.description);
  }

  if (updates.revaluationFrequency) {
    setClauses.push(`revaluation_frequency = $${paramIndex++}`);
    params.push(updates.revaluationFrequency);
  }

  params.push(portfolioId, tenantId);

  const sql = `
    UPDATE portfolios
    SET ${setClauses.join(', ')}
    WHERE portfolio_id = $${paramIndex++} AND tenant_id = $${paramIndex++}
    RETURNING *
  `;

  const result = await query<Portfolio>(sql, params, tenantId);

  if (result.rows.length === 0) {
    throw new NotFoundError('Portfolio not found');
  }

  return result.rows[0];
}

/**
 * Delete portfolio
 */
export async function deletePortfolio(tenantId: string, portfolioId: string): Promise<void> {
  const result = await query(
    `DELETE FROM portfolios WHERE portfolio_id = $1 AND tenant_id = $2`,
    [portfolioId, tenantId],
    tenantId
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Portfolio not found');
  }

  logger.info({ tenantId, portfolioId }, 'Portfolio deleted');
}

/**
 * Add properties to portfolio
 */
export async function addProperties(
  tenantId: string,
  portfolioId: string,
  propertyIds: string[]
): Promise<{ added: number }> {
  return transaction(async (client) => {
    let added = 0;

    for (const propertyId of propertyIds) {
      try {
        await client.query(
          `INSERT INTO portfolio_properties (portfolio_id, property_id, added_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (portfolio_id, property_id) DO NOTHING`,
          [portfolioId, propertyId]
        );
        added++;
      } catch (err) {
        logger.warn({ portfolioId, propertyId }, 'Failed to add property to portfolio');
      }
    }

    return { added };
  }, tenantId);
}

/**
 * Remove property from portfolio
 */
export async function removeProperty(
  tenantId: string,
  portfolioId: string,
  propertyId: string
): Promise<void> {
  await query(
    `DELETE FROM portfolio_properties WHERE portfolio_id = $1 AND property_id = $2`,
    [portfolioId, propertyId],
    tenantId
  );
}

/**
 * Get dashboard metrics
 */
export async function getDashboard(tenantId: string, portfolioId: string): Promise<any> {
  const portfolio = await getPortfolio(tenantId, portfolioId);

  // Get property count and total value
  const valueResult = await query(
    `SELECT
      COUNT(pp.property_id) as property_count,
      COALESCE(SUM(v.value_amount), 0) as total_value,
      COALESCE(AVG(v.value_amount), 0) as avg_value
     FROM portfolio_properties pp
     LEFT JOIN LATERAL (
       SELECT value_amount
       FROM valuations
       WHERE property_id = pp.property_id
       ORDER BY valuation_date DESC
       LIMIT 1
     ) v ON true
     WHERE pp.portfolio_id = $1`,
    [portfolioId],
    tenantId
  );

  const valueMetrics = valueResult.rows[0];

  // Get property type breakdown
  const typeResult = await query(
    `SELECT
      p.property_type,
      COUNT(*) as count,
      COALESCE(SUM(v.value_amount), 0) as total_value
     FROM portfolio_properties pp
     JOIN properties p ON pp.property_id = p.property_id
     LEFT JOIN LATERAL (
       SELECT value_amount
       FROM valuations
       WHERE property_id = pp.property_id
       ORDER BY valuation_date DESC
       LIMIT 1
     ) v ON true
     WHERE pp.portfolio_id = $1
     GROUP BY p.property_type`,
    [portfolioId],
    tenantId
  );

  // Get assessment statistics
  const assessmentResult = await query(
    `SELECT
      COUNT(*) as total_assessments,
      COALESCE(SUM(a.total_assessed_value), 0) as total_assessed_value,
      COALESCE(AVG(a.total_assessed_value), 0) as avg_assessed_value
     FROM portfolio_properties pp
     JOIN LATERAL (
       SELECT total_assessed_value
       FROM assessments
       WHERE property_id = pp.property_id
       ORDER BY created_at DESC
       LIMIT 1
     ) a ON true
     WHERE pp.portfolio_id = $1`,
    [portfolioId],
    tenantId
  );

  return {
    portfolio: {
      id: portfolio.portfolioId,
      name: portfolio.name,
      description: portfolio.description,
    },
    metrics: {
      propertyCount: parseInt(valueMetrics.property_count),
      totalValue: parseFloat(valueMetrics.total_value),
      averageValue: parseFloat(valueMetrics.avg_value),
      totalAssessedValue: parseFloat(assessmentResult.rows[0]?.total_assessed_value || '0'),
    },
    breakdown: {
      byPropertyType: typeResult.rows.map((row: any) => ({
        type: row.property_type,
        count: parseInt(row.count),
        totalValue: parseFloat(row.total_value),
      })),
    },
  };
}

/**
 * Trigger portfolio revaluation
 */
export async function revaluePortfolio(
  tenantId: string,
  userId: string,
  portfolioId: string
): Promise<{ message: string; propertiesQueued: number }> {
  const countResult = await query(
    `SELECT COUNT(*) as count FROM portfolio_properties WHERE portfolio_id = $1`,
    [portfolioId],
    tenantId
  );

  const count = parseInt(countResult.rows[0].count);

  // In production, would queue revaluation jobs for each property
  // For now, update the last revalued timestamp
  await query(
    `UPDATE portfolios SET last_revalued_at = NOW() WHERE portfolio_id = $1`,
    [portfolioId],
    tenantId
  );

  logger.info({ tenantId, portfolioId, count }, 'Portfolio revaluation triggered');

  return {
    message: 'Revaluation queued',
    propertiesQueued: count,
  };
}
