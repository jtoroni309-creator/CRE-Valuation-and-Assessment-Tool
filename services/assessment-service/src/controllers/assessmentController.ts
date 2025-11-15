/**
 * Assessment controller - Request handlers
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { logger, calculatePagination } from '@axxiom/shared';
import * as assessmentService from '../services/assessmentService';

const CreateAssessmentRunSchema = z.object({
  jurisdictionId: z.string().uuid(),
  assessmentYear: z.number().int().min(2000).max(2100),
  taxYear: z.number().int().min(2000).max(2100),
  valuationDate: z.string(),
  runType: z.enum(['annual', 'revaluation', 'appeal_adjustment']),
  description: z.string().optional(),
});

const ExecuteAssessmentSchema = z.object({
  modelVersion: z.string().optional(),
  propertyTypes: z.array(z.string()).optional(),
  neighborhoods: z.array(z.string()).optional(),
});

/**
 * List assessment runs
 */
export async function listAssessmentRuns(req: Request, res: Response) {
  const tenantId = req.tenantId!;
  const { jurisdictionId, assessmentYear, status } = req.query;
  const { limit, offset } = calculatePagination(req);

  logger.info({ tenantId, jurisdictionId, assessmentYear }, 'Listing assessment runs');

  const runs = await assessmentService.listAssessmentRuns(tenantId, {
    jurisdictionId: jurisdictionId as string,
    assessmentYear: assessmentYear ? parseInt(assessmentYear as string) : undefined,
    status: status as string,
    limit,
    offset,
  });

  res.json({ success: true, data: runs });
}

/**
 * Create new assessment run
 */
export async function createAssessmentRun(req: Request, res: Response) {
  const data = CreateAssessmentRunSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, jurisdictionId: data.jurisdictionId, year: data.assessmentYear }, 'Creating assessment run');

  const run = await assessmentService.createAssessmentRun(tenantId, userId, data);

  res.status(201).json({ success: true, data: run });
}

/**
 * Get assessment run details
 */
export async function getAssessmentRun(req: Request, res: Response) {
  const { runId } = req.params;
  const tenantId = req.tenantId!;

  const run = await assessmentService.getAssessmentRun(tenantId, runId);

  res.json({ success: true, data: run });
}

/**
 * Execute mass appraisal for assessment run
 */
export async function executeAssessmentRun(req: Request, res: Response) {
  const { runId } = req.params;
  const data = ExecuteAssessmentSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, runId, modelVersion: data.modelVersion }, 'Executing assessment run');

  const result = await assessmentService.executeAssessmentRun(tenantId, userId, runId, data);

  res.json({ success: true, data: result });
}

/**
 * List properties in assessment run
 */
export async function listAssessmentProperties(req: Request, res: Response) {
  const { runId } = req.params;
  const tenantId = req.tenantId!;
  const { limit, offset } = calculatePagination(req);

  const properties = await assessmentService.listAssessmentProperties(tenantId, runId, limit, offset);

  res.json({ success: true, data: properties });
}

/**
 * Approve assessment run
 */
export async function approveAssessmentRun(req: Request, res: Response) {
  const { runId } = req.params;
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, runId, userId }, 'Approving assessment run');

  const run = await assessmentService.approveAssessmentRun(tenantId, userId, runId);

  res.json({ success: true, data: run });
}

/**
 * Get assessment statistics
 */
export async function getAssessmentStatistics(req: Request, res: Response) {
  const { runId } = req.params;
  const tenantId = req.tenantId!;

  const stats = await assessmentService.getAssessmentStatistics(tenantId, runId);

  res.json({ success: true, data: stats });
}

/**
 * Get equity analysis
 */
export async function getEquityAnalysis(req: Request, res: Response) {
  const { runId } = req.params;
  const tenantId = req.tenantId!;

  logger.info({ tenantId, runId }, 'Calculating equity analysis');

  const analysis = await assessmentService.getEquityAnalysis(tenantId, runId);

  res.json({ success: true, data: analysis });
}

/**
 * Generate assessment notices
 */
export async function generateNotices(req: Request, res: Response) {
  const { runId } = req.params;
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, runId }, 'Generating assessment notices');

  const result = await assessmentService.generateNotices(tenantId, userId, runId);

  res.json({ success: true, data: result });
}
