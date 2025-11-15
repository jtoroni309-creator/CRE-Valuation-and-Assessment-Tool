/**
 * Analytics service - Portfolio analytics algorithms
 */

import { logger } from '@axxiom/shared';
import { query } from '../database';
import { mean, standardDeviation } from 'simple-statistics';

/**
 * Analyze portfolio variance
 */
export async function analyzeVariance(tenantId: string, params: any): Promise<any> {
  const sql = `
    SELECT
      p.property_id,
      p.street_number || ' ' || p.street_name as address,
      p.city,
      p.property_type,
      v.value_amount,
      a.total_assessed_value,
      ((a.total_assessed_value - v.value_amount) / NULLIF(v.value_amount, 0) * 100) as variance_percent
    FROM portfolio_properties pp
    JOIN properties p ON pp.property_id = p.property_id
    LEFT JOIN LATERAL (
      SELECT value_amount
      FROM valuations
      WHERE property_id = pp.property_id
      ORDER BY valuation_date DESC
      LIMIT 1
    ) v ON true
    LEFT JOIN LATERAL (
      SELECT total_assessed_value
      FROM assessments
      WHERE property_id = pp.property_id
      ORDER BY created_at DESC
      LIMIT 1
    ) a ON true
    WHERE pp.portfolio_id = $1
      AND ABS((a.total_assessed_value - v.value_amount) / NULLIF(v.value_amount, 0) * 100) > $2
  `;

  const result = await query(sql, [params.portfolioId, params.thresholdPercent], tenantId);

  const outliers = result.rows;
  const values = outliers.map((o: any) => parseFloat(o.variance_percent));

  return {
    outlierCount: outliers.length,
    meanVariance: values.length > 0 ? mean(values) : 0,
    stdDeviation: values.length > 1 ? standardDeviation(values) : 0,
    outliers: outliers.map((o: any) => ({
      propertyId: o.property_id,
      address: o.address,
      city: o.city,
      type: o.property_type,
      marketValue: parseFloat(o.value_amount),
      assessedValue: parseFloat(o.total_assessed_value),
      variancePercent: parseFloat(o.variance_percent),
    })),
  };
}

/**
 * Find appeal opportunities
 */
export async function findAppealOpportunities(tenantId: string, params: any): Promise<any> {
  const sql = `
    SELECT
      p.property_id,
      p.street_number || ' ' || p.street_name as address,
      p.city,
      a.total_assessed_value,
      v.value_amount as market_value,
      (a.total_assessed_value - v.value_amount) as potential_savings,
      ((a.total_assessed_value - v.value_amount) / NULLIF(a.total_assessed_value, 0)) as assessment_ratio
    FROM portfolio_properties pp
    JOIN properties p ON pp.property_id = p.property_id
    JOIN LATERAL (
      SELECT total_assessed_value
      FROM assessments
      WHERE property_id = pp.property_id
      ORDER BY created_at DESC
      LIMIT 1
    ) a ON true
    JOIN LATERAL (
      SELECT value_amount
      FROM valuations
      WHERE property_id = pp.property_id
      ORDER BY valuation_date DESC
      LIMIT 1
    ) v ON true
    WHERE pp.portfolio_id = $1
      AND (a.total_assessed_value - v.value_amount) > $2
      AND a.total_assessed_value > v.value_amount
  `;

  const result = await query(sql, [params.portfolioId, params.minSavings], tenantId);

  const opportunities = result.rows.map((row: any) => {
    const successProbability = calculateSuccessProbability(
      parseFloat(row.assessment_ratio)
    );

    return {
      propertyId: row.property_id,
      address: row.address,
      city: row.city,
      assessedValue: parseFloat(row.total_assessed_value),
      marketValue: parseFloat(row.market_value),
      potentialSavings: parseFloat(row.potential_savings),
      successProbability,
      recommendation: successProbability >= params.successProbabilityThreshold ? 'APPEAL' : 'MONITOR',
    };
  });

  const totalSavings = opportunities.reduce((sum, o) => sum + o.potentialSavings, 0);

  return {
    opportunityCount: opportunities.length,
    totalPotentialSavings: totalSavings,
    opportunities: opportunities.filter(
      (o) => o.successProbability >= params.successProbabilityThreshold
    ),
  };
}

/**
 * Run scenario analysis
 */
export async function runScenario(tenantId: string, params: any): Promise<any> {
  const currentMetrics = await getCurrentMetrics(tenantId, params.portfolioId);

  let scenarioMetrics: any = { ...currentMetrics };

  if (params.scenarioType === 'value_change' && params.parameters.valueChangePercent) {
    scenarioMetrics.totalValue *= 1 + params.parameters.valueChangePercent / 100;
    scenarioMetrics.averageValue *= 1 + params.parameters.valueChangePercent / 100;
  } else if (params.scenarioType === 'tax_rate_change' && params.parameters.taxRateChange) {
    scenarioMetrics.estimatedTaxes *= 1 + params.parameters.taxRateChange / 100;
  }

  return {
    current: currentMetrics,
    scenario: scenarioMetrics,
    impact: {
      valueChange: scenarioMetrics.totalValue - currentMetrics.totalValue,
      valueChangePercent:
        ((scenarioMetrics.totalValue - currentMetrics.totalValue) / currentMetrics.totalValue) * 100,
      taxChange: scenarioMetrics.estimatedTaxes - currentMetrics.estimatedTaxes,
    },
  };
}

/**
 * Benchmark portfolio
 */
export async function benchmarkPortfolio(tenantId: string, params: any): Promise<any> {
  const portfolioMetrics = await getCurrentMetrics(tenantId, params.portfolioId);

  // Mock benchmark data - in production would compare to real market indices
  const marketIndex = {
    averageValue: portfolioMetrics.averageValue * 0.95,
    valueGrowth: 4.2,
    capRate: 7.5,
  };

  return {
    portfolio: portfolioMetrics,
    benchmarks: {
      marketIndex: {
        name: 'CRE Market Index',
        averageValue: marketIndex.averageValue,
        valueGrowth: marketIndex.valueGrowth,
        comparison: portfolioMetrics.averageValue > marketIndex.averageValue ? 'Above Market' : 'Below Market',
        percentageDiff:
          ((portfolioMetrics.averageValue - marketIndex.averageValue) / marketIndex.averageValue) * 100,
      },
    },
  };
}

/**
 * Calculate risk scores
 */
export async function calculateRiskScores(tenantId: string, params: any): Promise<any> {
  const sql = `
    SELECT
      p.property_id,
      p.street_number || ' ' || p.street_name as address,
      p.city,
      EXTRACT(YEAR FROM CURRENT_DATE) - p.year_built as property_age,
      COUNT(DISTINCT ap.appeal_id) as appeal_count
    FROM portfolio_properties pp
    JOIN properties p ON pp.property_id = p.property_id
    LEFT JOIN appeal_cases ap ON p.property_id = ap.property_id
    WHERE pp.portfolio_id = $1
    GROUP BY p.property_id, p.street_number, p.street_name, p.city, p.year_built
  `;

  const result = await query(sql, [params.portfolioId], tenantId);

  const properties = result.rows.map((row: any) => {
    const ageRisk = Math.min(parseFloat(row.property_age) / 50, 1) * 30;
    const appealRisk = Math.min(parseInt(row.appeal_count) * 15, 40);
    const totalRisk = ageRisk + appealRisk;

    return {
      propertyId: row.property_id,
      address: row.address,
      city: row.city,
      riskScore: Math.round(totalRisk),
      riskLevel: totalRisk < 25 ? 'Low' : totalRisk < 50 ? 'Medium' : totalRisk < 75 ? 'High' : 'Critical',
      factors: {
        propertyAge: Math.round(ageRisk),
        appealHistory: Math.round(appealRisk),
      },
    };
  });

  const avgRisk = properties.length > 0 ? mean(properties.map((p) => p.riskScore)) : 0;

  return {
    portfolioRiskScore: Math.round(avgRisk),
    properties,
  };
}

/**
 * Optimize tax burden
 */
export async function optimizeTaxBurden(tenantId: string, params: any): Promise<any> {
  const opportunities = await findAppealOpportunities(tenantId, {
    portfolioId: params.portfolioId,
    minSavings: 5000,
    successProbabilityThreshold: 0.5,
  });

  // Sort by ROI (savings / appeal cost estimate)
  const appealCostEstimate = 2500;
  const ranked = opportunities.opportunities
    .map((o: any) => ({
      ...o,
      roi: o.potentialSavings / appealCostEstimate,
      estimatedCost: appealCostEstimate,
    }))
    .sort((a: any, b: any) => b.roi - a.roi);

  const maxAppeals = params.constraints?.maxAppeals || ranked.length;
  const recommended = ranked.slice(0, maxAppeals);

  return {
    optimizationGoal: params.optimizationGoal,
    totalOpportunities: ranked.length,
    recommendedAppeals: recommended.length,
    estimatedSavings: recommended.reduce((sum: number, r: any) => sum + r.potentialSavings, 0),
    estimatedCost: recommended.length * appealCostEstimate,
    roi: recommended.reduce((sum: number, r: any) => sum + r.roi, 0) / (recommended.length || 1),
    recommendations: recommended,
  };
}

/**
 * Get portfolio trends
 */
export async function getTrends(tenantId: string, params: any): Promise<any> {
  // Mock trend data - in production would query historical data
  const periods = 12;
  const trends = [];
  const baseValue = 10000000;

  for (let i = periods; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    trends.push({
      period: date.toISOString().substring(0, 7),
      totalValue: baseValue * (1 + (periods - i) * 0.02 + Math.random() * 0.01),
      propertyCount: 50 + Math.floor((periods - i) * 2),
      averageValue: (baseValue * (1 + (periods - i) * 0.02)) / (50 + (periods - i) * 2),
    });
  }

  return { trends };
}

/**
 * Helper: Get current portfolio metrics
 */
async function getCurrentMetrics(tenantId: string, portfolioId: string): Promise<any> {
  const result = await query(
    `SELECT
      COUNT(pp.property_id) as property_count,
      COALESCE(SUM(v.value_amount), 0) as total_value,
      COALESCE(AVG(v.value_amount), 0) as avg_value,
      COALESCE(SUM(a.total_assessed_value * 0.012), 0) as estimated_taxes
     FROM portfolio_properties pp
     LEFT JOIN LATERAL (
       SELECT value_amount
       FROM valuations
       WHERE property_id = pp.property_id
       ORDER BY valuation_date DESC
       LIMIT 1
     ) v ON true
     LEFT JOIN LATERAL (
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

  const row = result.rows[0];

  return {
    propertyCount: parseInt(row.property_count),
    totalValue: parseFloat(row.total_value),
    averageValue: parseFloat(row.avg_value),
    estimatedTaxes: parseFloat(row.estimated_taxes),
  };
}

/**
 * Helper: Calculate appeal success probability
 */
function calculateSuccessProbability(assessmentRatio: number): number {
  // Simple model: higher over-assessment = higher success probability
  if (assessmentRatio > 1.2) return 0.85;
  if (assessmentRatio > 1.15) return 0.75;
  if (assessmentRatio > 1.10) return 0.65;
  if (assessmentRatio > 1.05) return 0.50;
  return 0.30;
}
