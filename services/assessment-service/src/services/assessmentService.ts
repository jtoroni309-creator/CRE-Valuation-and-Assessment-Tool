/**
 * Assessment service - Business logic for mass appraisal
 */

import { logger, NotFoundError } from '@axxiom/shared';
import { query, transaction } from '../database';

export interface AssessmentRun {
  runId: string;
  tenantId: string;
  jurisdictionId: string;
  assessmentYear: number;
  taxYear: number;
  valuationDate: Date;
  runType: string;
  status: string;
  totalProperties?: number;
  completedProperties?: number;
  totalAssessedValue?: number;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentProperty {
  assessmentId: string;
  runId: string;
  propertyId: string;
  address: string;
  landValue: number;
  improvementValue: number;
  totalAssessedValue: number;
  priorYearValue?: number;
  valueChange?: number;
  modelPrediction?: number;
  confidence?: number;
  status: string;
}

export interface AssessmentStatistics {
  runId: string;
  totalProperties: number;
  completedProperties: number;
  totalLandValue: number;
  totalImprovementValue: number;
  totalAssessedValue: number;
  averageAssessedValue: number;
  medianAssessedValue: number;
  averageChangePercent: number;
  byPropertyType: Record<string, {
    count: number;
    totalValue: number;
    averageValue: number;
  }>;
}

export interface EquityAnalysis {
  runId: string;
  assessmentYear: number;
  coefficientOfDispersion: number; // COD - measure of uniformity
  priceRelatedDifferential: number; // PRD - measure of progressivity/regressivity
  coefficientOfVariation: number; // COV
  assessmentRatio: {
    mean: number;
    median: number;
    weightedMean: number;
  };
  byPropertyType: Record<string, {
    cod: number;
    assessmentRatio: number;
    count: number;
  }>;
  interpretation: {
    equityLevel: 'excellent' | 'good' | 'fair' | 'poor';
    uniformity: 'excellent' | 'good' | 'fair' | 'poor';
    recommendations: string[];
  };
}

/**
 * List assessment runs
 */
export async function listAssessmentRuns(
  tenantId: string,
  filters: {
    jurisdictionId?: string;
    assessmentYear?: number;
    status?: string;
    limit: number;
    offset: number;
  }
): Promise<AssessmentRun[]> {
  const whereClauses: string[] = [];
  const params: any[] = [tenantId];
  let paramIndex = 2;

  if (filters.jurisdictionId) {
    whereClauses.push(`jurisdiction_id = $${paramIndex++}`);
    params.push(filters.jurisdictionId);
  }

  if (filters.assessmentYear) {
    whereClauses.push(`assessment_year = $${paramIndex++}`);
    params.push(filters.assessmentYear);
  }

  if (filters.status) {
    whereClauses.push(`status = $${paramIndex++}`);
    params.push(filters.status);
  }

  const whereClause = whereClauses.length > 0 ? `AND ${whereClauses.join(' AND ')}` : '';

  const sql = `
    SELECT
      run_id,
      tenant_id,
      jurisdiction_id,
      assessment_year,
      tax_year,
      valuation_date,
      run_type,
      status,
      total_properties,
      completed_properties,
      total_assessed_value,
      created_by,
      approved_by,
      approved_at,
      created_at,
      updated_at
    FROM assessment_runs
    WHERE tenant_id = $1 ${whereClause}
    ORDER BY assessment_year DESC, created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(filters.limit, filters.offset);

  const result = await query<AssessmentRun>(sql, params, tenantId);
  return result.rows;
}

/**
 * Create new assessment run
 */
export async function createAssessmentRun(
  tenantId: string,
  userId: string,
  input: {
    jurisdictionId: string;
    assessmentYear: number;
    taxYear: number;
    valuationDate: string;
    runType: string;
    description?: string;
  }
): Promise<AssessmentRun> {
  return transaction(async (client) => {
    // Create the assessment run
    const result = await client.query<AssessmentRun>(
      `INSERT INTO assessment_runs (
        tenant_id, jurisdiction_id, assessment_year, tax_year, valuation_date,
        run_type, status, created_by, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *`,
      [
        tenantId,
        input.jurisdictionId,
        input.assessmentYear,
        input.taxYear,
        input.valuationDate,
        input.runType,
        'draft',
        userId,
      ]
    );

    const run = result.rows[0];

    // Count properties in the jurisdiction
    const countResult = await client.query(
      `SELECT COUNT(*) as count
       FROM properties
       WHERE tenant_id = $1 AND jurisdiction_id = $2`,
      [tenantId, input.jurisdictionId]
    );

    const propertyCount = parseInt(countResult.rows[0].count);

    // Update total properties count
    await client.query(
      `UPDATE assessment_runs
       SET total_properties = $1
       WHERE run_id = $2`,
      [propertyCount, run.runId]
    );

    run.totalProperties = propertyCount;

    logger.info(
      { tenantId, runId: run.runId, propertyCount },
      'Assessment run created'
    );

    return run;
  }, tenantId);
}

/**
 * Get assessment run details
 */
export async function getAssessmentRun(
  tenantId: string,
  runId: string
): Promise<AssessmentRun> {
  const result = await query<AssessmentRun>(
    `SELECT * FROM assessment_runs WHERE run_id = $1 AND tenant_id = $2`,
    [runId, tenantId],
    tenantId
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Assessment run not found');
  }

  return result.rows[0];
}

/**
 * Execute mass appraisal for assessment run
 */
export async function executeAssessmentRun(
  tenantId: string,
  userId: string,
  runId: string,
  options: {
    modelVersion?: string;
    propertyTypes?: string[];
    neighborhoods?: string[];
  }
): Promise<{ message: string; jobId: string }> {
  // Verify run exists and is in correct status
  const run = await getAssessmentRun(tenantId, runId);

  if (run.status !== 'draft' && run.status !== 'in_progress') {
    throw new Error(`Cannot execute assessment run with status: ${run.status}`);
  }

  return transaction(async (client) => {
    // Update run status
    await client.query(
      `UPDATE assessment_runs
       SET status = 'in_progress', updated_at = NOW()
       WHERE run_id = $1`,
      [runId]
    );

    // In production, this would trigger an async job (Azure Functions, Service Bus)
    // For now, we'll perform inline mass appraisal

    // Build property filter
    const filters: string[] = [`p.jurisdiction_id = $1`];
    const params: any[] = [run.jurisdictionId];
    let paramIndex = 2;

    if (options.propertyTypes && options.propertyTypes.length > 0) {
      filters.push(`p.property_type = ANY($${paramIndex++})`);
      params.push(options.propertyTypes);
    }

    if (options.neighborhoods && options.neighborhoods.length > 0) {
      filters.push(`p.neighborhood = ANY($${paramIndex++})`);
      params.push(options.neighborhoods);
    }

    const whereClause = filters.join(' AND ');

    // Insert assessment records for all properties
    // This uses a simplified valuation - in production would use ML models
    const insertSql = `
      INSERT INTO assessments (
        tenant_id, run_id, property_id, land_value, improvement_value,
        total_assessed_value, status, created_at, updated_at
      )
      SELECT
        $1 as tenant_id,
        $2 as run_id,
        p.property_id,
        COALESCE(l.assessed_value, 100000) as land_value,
        COALESCE(b.replacement_cost * 0.8, 200000) as improvement_value,
        COALESCE(l.assessed_value, 100000) + COALESCE(b.replacement_cost * 0.8, 200000) as total_assessed_value,
        'draft' as status,
        NOW() as created_at,
        NOW() as updated_at
      FROM properties p
      LEFT JOIN land l ON p.property_id = l.property_id
      LEFT JOIN buildings b ON p.property_id = b.property_id
      WHERE ${whereClause}
      ON CONFLICT (run_id, property_id) DO NOTHING
    `;

    await client.query(insertSql, [tenantId, runId, ...params]);

    // Update completed count
    const countResult = await client.query(
      `SELECT COUNT(*) as count FROM assessments WHERE run_id = $1`,
      [runId]
    );

    const completed = parseInt(countResult.rows[0].count);

    await client.query(
      `UPDATE assessment_runs
       SET completed_properties = $1, updated_at = NOW()
       WHERE run_id = $2`,
      [completed, runId]
    );

    logger.info({ tenantId, runId, completed }, 'Assessment run executed');

    return {
      message: 'Assessment run executed successfully',
      jobId: `job-${runId}`,
    };
  }, tenantId);
}

/**
 * List properties in assessment run
 */
export async function listAssessmentProperties(
  tenantId: string,
  runId: string,
  limit: number,
  offset: number
): Promise<AssessmentProperty[]> {
  const sql = `
    SELECT
      a.assessment_id,
      a.run_id,
      a.property_id,
      p.street_number || ' ' || p.street_name || ', ' || p.city || ', ' || p.state AS address,
      a.land_value,
      a.improvement_value,
      a.total_assessed_value,
      a.prior_year_value,
      a.value_change,
      a.model_prediction,
      a.confidence,
      a.status
    FROM assessments a
    JOIN properties p ON a.property_id = p.property_id
    WHERE a.run_id = $1 AND a.tenant_id = $2
    ORDER BY a.total_assessed_value DESC
    LIMIT $3 OFFSET $4
  `;

  const result = await query<AssessmentProperty>(
    sql,
    [runId, tenantId, limit, offset],
    tenantId
  );

  return result.rows;
}

/**
 * Approve assessment run
 */
export async function approveAssessmentRun(
  tenantId: string,
  userId: string,
  runId: string
): Promise<AssessmentRun> {
  return transaction(async (client) => {
    const result = await client.query<AssessmentRun>(
      `UPDATE assessment_runs
       SET status = 'approved', approved_by = $1, approved_at = NOW(), updated_at = NOW()
       WHERE run_id = $2 AND tenant_id = $3
       RETURNING *`,
      [userId, runId, tenantId]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError('Assessment run not found');
    }

    logger.info({ tenantId, runId, userId }, 'Assessment run approved');

    return result.rows[0];
  }, tenantId);
}

/**
 * Get assessment statistics
 */
export async function getAssessmentStatistics(
  tenantId: string,
  runId: string
): Promise<AssessmentStatistics> {
  // Overall statistics
  const overallSql = `
    SELECT
      COUNT(*) as total_properties,
      COUNT(*) FILTER (WHERE status != 'draft') as completed_properties,
      COALESCE(SUM(land_value), 0) as total_land_value,
      COALESCE(SUM(improvement_value), 0) as total_improvement_value,
      COALESCE(SUM(total_assessed_value), 0) as total_assessed_value,
      COALESCE(AVG(total_assessed_value), 0) as average_assessed_value,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_assessed_value) as median_assessed_value,
      COALESCE(AVG(CASE WHEN prior_year_value > 0
        THEN ((total_assessed_value - prior_year_value) / prior_year_value * 100)
        ELSE 0 END), 0) as average_change_percent
    FROM assessments
    WHERE run_id = $1 AND tenant_id = $2
  `;

  const overallResult = await query(overallSql, [runId, tenantId], tenantId);
  const overall = overallResult.rows[0];

  // By property type
  const byTypeSql = `
    SELECT
      p.property_type,
      COUNT(*) as count,
      COALESCE(SUM(a.total_assessed_value), 0) as total_value,
      COALESCE(AVG(a.total_assessed_value), 0) as average_value
    FROM assessments a
    JOIN properties p ON a.property_id = p.property_id
    WHERE a.run_id = $1 AND a.tenant_id = $2
    GROUP BY p.property_type
  `;

  const byTypeResult = await query(byTypeSql, [runId, tenantId], tenantId);

  const byPropertyType: Record<string, any> = {};
  byTypeResult.rows.forEach((row: any) => {
    byPropertyType[row.property_type] = {
      count: parseInt(row.count),
      totalValue: parseFloat(row.total_value),
      averageValue: parseFloat(row.average_value),
    };
  });

  return {
    runId,
    totalProperties: parseInt(overall.total_properties),
    completedProperties: parseInt(overall.completed_properties),
    totalLandValue: parseFloat(overall.total_land_value),
    totalImprovementValue: parseFloat(overall.total_improvement_value),
    totalAssessedValue: parseFloat(overall.total_assessed_value),
    averageAssessedValue: parseFloat(overall.average_assessed_value),
    medianAssessedValue: parseFloat(overall.median_assessed_value),
    averageChangePercent: parseFloat(overall.average_change_percent),
    byPropertyType,
  };
}

/**
 * Get equity analysis and assessment ratios
 * Implements IAAO standards for assessment equity
 */
export async function getEquityAnalysis(
  tenantId: string,
  runId: string
): Promise<EquityAnalysis> {
  const run = await getAssessmentRun(tenantId, runId);

  // Get sales data for ratio study (properties with recent sales)
  const ratioSql = `
    SELECT
      p.property_type,
      a.total_assessed_value,
      s.sale_price,
      (a.total_assessed_value / NULLIF(s.sale_price, 0)) as assessment_ratio
    FROM assessments a
    JOIN properties p ON a.property_id = p.property_id
    LEFT JOIN sales s ON a.property_id = s.property_id
    WHERE a.run_id = $1
      AND a.tenant_id = $2
      AND s.sale_price > 0
      AND s.verified = true
      AND s.sale_date >= (SELECT valuation_date - INTERVAL '12 months' FROM assessment_runs WHERE run_id = $1)
  `;

  const ratios = await query(ratioSql, [runId, tenantId], tenantId);

  if (ratios.rows.length === 0) {
    // No sales data available - return basic statistics
    return {
      runId,
      assessmentYear: run.assessmentYear,
      coefficientOfDispersion: 0,
      priceRelatedDifferential: 0,
      coefficientOfVariation: 0,
      assessmentRatio: { mean: 0, median: 0, weightedMean: 0 },
      byPropertyType: {},
      interpretation: {
        equityLevel: 'poor',
        uniformity: 'poor',
        recommendations: ['Insufficient sales data for equity analysis'],
      },
    };
  }

  const ratioValues = ratios.rows.map((r: any) => parseFloat(r.assessment_ratio));
  const assessedValues = ratios.rows.map((r: any) => parseFloat(r.total_assessed_value));
  const saleValues = ratios.rows.map((r: any) => parseFloat(r.sale_price));

  // Calculate assessment ratio statistics
  const meanRatio = ratioValues.reduce((sum, r) => sum + r, 0) / ratioValues.length;
  const sortedRatios = [...ratioValues].sort((a, b) => a - b);
  const medianRatio = sortedRatios[Math.floor(sortedRatios.length / 2)];

  const totalAssessed = assessedValues.reduce((sum, v) => sum + v, 0);
  const totalSales = saleValues.reduce((sum, v) => sum + v, 0);
  const weightedMeanRatio = totalAssessed / totalSales;

  // Coefficient of Dispersion (COD) - IAAO standard
  const absoluteDeviations = ratioValues.map(r => Math.abs(r - medianRatio));
  const meanAbsoluteDeviation = absoluteDeviations.reduce((sum, d) => sum + d, 0) / ratioValues.length;
  const cod = (meanAbsoluteDeviation / medianRatio) * 100;

  // Price-Related Differential (PRD) - detects regressivity/progressivity
  const prd = meanRatio / weightedMeanRatio;

  // Coefficient of Variation (COV)
  const variance = ratioValues.reduce((sum, r) => sum + Math.pow(r - meanRatio, 2), 0) / ratioValues.length;
  const standardDeviation = Math.sqrt(variance);
  const cov = (standardDeviation / meanRatio) * 100;

  // By property type
  const byPropertyType: Record<string, any> = {};
  const typeGroups: Record<string, number[]> = {};

  ratios.rows.forEach((row: any) => {
    const type = row.property_type;
    if (!typeGroups[type]) typeGroups[type] = [];
    typeGroups[type].push(parseFloat(row.assessment_ratio));
  });

  Object.entries(typeGroups).forEach(([type, values]) => {
    const typeMean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const sortedTypeRatios = [...values].sort((a, b) => a - b);
    const typeMedian = sortedTypeRatios[Math.floor(sortedTypeRatios.length / 2)];
    const typeDeviations = values.map(v => Math.abs(v - typeMedian));
    const typeMeanDev = typeDeviations.reduce((sum, d) => sum + d, 0) / values.length;
    const typeCod = (typeMeanDev / typeMedian) * 100;

    byPropertyType[type] = {
      cod: parseFloat(typeCod.toFixed(2)),
      assessmentRatio: parseFloat(typeMean.toFixed(3)),
      count: values.length,
    };
  });

  // Interpretation based on IAAO standards
  let uniformity: 'excellent' | 'good' | 'fair' | 'poor';
  if (cod <= 10) uniformity = 'excellent';
  else if (cod <= 15) uniformity = 'good';
  else if (cod <= 20) uniformity = 'fair';
  else uniformity = 'poor';

  let equityLevel: 'excellent' | 'good' | 'fair' | 'poor';
  if (prd >= 0.98 && prd <= 1.03 && cod <= 15) equityLevel = 'excellent';
  else if (prd >= 0.95 && prd <= 1.05 && cod <= 20) equityLevel = 'good';
  else if (prd >= 0.90 && prd <= 1.10) equityLevel = 'fair';
  else equityLevel = 'poor';

  const recommendations: string[] = [];
  if (cod > 15) recommendations.push('COD exceeds acceptable range - review assessment procedures for consistency');
  if (prd > 1.03) recommendations.push('PRD indicates regressivity - lower-valued properties may be over-assessed');
  if (prd < 0.98) recommendations.push('PRD indicates progressivity - higher-valued properties may be over-assessed');
  if (cov > 20) recommendations.push('High variation in assessment ratios - consider stratification by property characteristics');

  return {
    runId,
    assessmentYear: run.assessmentYear,
    coefficientOfDispersion: parseFloat(cod.toFixed(2)),
    priceRelatedDifferential: parseFloat(prd.toFixed(3)),
    coefficientOfVariation: parseFloat(cov.toFixed(2)),
    assessmentRatio: {
      mean: parseFloat(meanRatio.toFixed(3)),
      median: parseFloat(medianRatio.toFixed(3)),
      weightedMean: parseFloat(weightedMeanRatio.toFixed(3)),
    },
    byPropertyType,
    interpretation: {
      equityLevel,
      uniformity,
      recommendations,
    },
  };
}

/**
 * Generate assessment notices for property owners
 */
export async function generateNotices(
  tenantId: string,
  userId: string,
  runId: string
): Promise<{ message: string; noticesGenerated: number }> {
  const run = await getAssessmentRun(tenantId, runId);

  if (run.status !== 'approved') {
    throw new Error('Assessment run must be approved before generating notices');
  }

  // In production, this would trigger document generation service
  // For now, we'll just count the properties that need notices
  const countResult = await query(
    `SELECT COUNT(*) as count
     FROM assessments
     WHERE run_id = $1 AND tenant_id = $2`,
    [runId, tenantId],
    tenantId
  );

  const count = parseInt(countResult.rows[0].count);

  logger.info(
    { tenantId, runId, count },
    'Assessment notices generation requested'
  );

  return {
    message: 'Notice generation initiated',
    noticesGenerated: count,
  };
}
