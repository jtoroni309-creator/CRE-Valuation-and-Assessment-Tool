/**
 * Analytics controller - Portfolio analytics handlers
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '@axxiom/shared';
import * as analyticsService from '../services/analyticsService';

const VarianceAnalysisSchema = z.object({
  portfolioId: z.string().uuid(),
  thresholdPercent: z.number().min(1).max(100).default(10),
});

const AppealOpportunitiesSchema = z.object({
  portfolioId: z.string().uuid(),
  minSavings: z.number().positive().default(10000),
  successProbabilityThreshold: z.number().min(0).max(1).default(0.6),
});

const ScenarioSchema = z.object({
  portfolioId: z.string().uuid(),
  scenarioType: z.enum(['acquisition', 'disposition', 'value_change', 'tax_rate_change']),
  parameters: z.object({
    propertyIds: z.array(z.string().uuid()).optional(),
    valueChangePercent: z.number().optional(),
    taxRateChange: z.number().optional(),
    acquisitionValue: z.number().optional(),
  }),
});

const BenchmarkingSchema = z.object({
  portfolioId: z.string().uuid(),
  benchmarks: z.array(z.enum(['market_index', 'peer_portfolios', 'historical_performance'])),
});

const RiskScoringSchema = z.object({
  portfolioId: z.string().uuid(),
  factors: z.array(z.enum(['assessment_volatility', 'appeal_history', 'market_conditions', 'property_age'])).optional(),
});

const OptimizationSchema = z.object({
  portfolioId: z.string().uuid(),
  optimizationGoal: z.enum(['minimize_tax', 'maximize_value', 'balance_risk']),
  constraints: z.object({
    maxAppeals: z.number().positive().optional(),
    budgetLimit: z.number().positive().optional(),
  }).optional(),
});

/**
 * Analyze variance
 */
export async function analyzeVariance(req: Request, res: Response) {
  const data = VarianceAnalysisSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, portfolioId: data.portfolioId }, 'Analyzing portfolio variance');

  const analysis = await analyticsService.analyzeVariance(tenantId, data);

  res.json({ success: true, data: analysis });
}

/**
 * Find appeal opportunities
 */
export async function findAppealOpportunities(req: Request, res: Response) {
  const data = AppealOpportunitiesSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, portfolioId: data.portfolioId }, 'Finding appeal opportunities');

  const opportunities = await analyticsService.findAppealOpportunities(tenantId, data);

  res.json({ success: true, data: opportunities });
}

/**
 * Run scenario
 */
export async function runScenario(req: Request, res: Response) {
  const data = ScenarioSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, portfolioId: data.portfolioId, type: data.scenarioType }, 'Running scenario');

  const results = await analyticsService.runScenario(tenantId, data);

  res.json({ success: true, data: results });
}

/**
 * Benchmark portfolio
 */
export async function benchmarkPortfolio(req: Request, res: Response) {
  const data = BenchmarkingSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, portfolioId: data.portfolioId }, 'Benchmarking portfolio');

  const benchmarks = await analyticsService.benchmarkPortfolio(tenantId, data);

  res.json({ success: true, data: benchmarks });
}

/**
 * Calculate risk scores
 */
export async function calculateRiskScores(req: Request, res: Response) {
  const data = RiskScoringSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, portfolioId: data.portfolioId }, 'Calculating risk scores');

  const riskScores = await analyticsService.calculateRiskScores(tenantId, data);

  res.json({ success: true, data: riskScores });
}

/**
 * Optimize tax burden
 */
export async function optimizeTaxBurden(req: Request, res: Response) {
  const data = OptimizationSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, portfolioId: data.portfolioId, goal: data.optimizationGoal }, 'Optimizing tax burden');

  const optimization = await analyticsService.optimizeTaxBurden(tenantId, data);

  res.json({ success: true, data: optimization });
}

/**
 * Get trends
 */
export async function getTrends(req: Request, res: Response) {
  const tenantId = req.tenantId!;
  const { portfolioId, metric, period } = req.query;

  const trends = await analyticsService.getTrends(tenantId, {
    portfolioId: portfolioId as string,
    metric: metric as string,
    period: period as string,
  });

  res.json({ success: true, data: trends });
}
