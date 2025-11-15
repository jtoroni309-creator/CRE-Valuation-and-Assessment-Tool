/**
 * Appeals controller - Request handlers
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { logger, calculatePagination } from '@axxiom/shared';
import * as appealsService from '../services/appealsService';

const CreateAppealSchema = z.object({
  propertyId: z.string().uuid(),
  assessmentId: z.string().uuid().optional(),
  appealType: z.enum(['assessment_value', 'classification', 'exemption', 'other']),
  taxYear: z.number().int().min(2000).max(2100),
  claimedValue: z.number().positive().optional(),
  grounds: z.array(z.string()),
  description: z.string(),
  deadline: z.string().optional(),
});

const UpdateAppealSchema = z.object({
  status: z.enum(['draft', 'submitted', 'under_review', 'hearing_scheduled', 'decided', 'withdrawn']).optional(),
  claimedValue: z.number().positive().optional(),
  description: z.string().optional(),
});

const AddEvidenceSchema = z.object({
  evidenceType: z.enum(['comparable_sale', 'appraisal', 'income_statement', 'expense_report', 'photos', 'inspection_report', 'market_analysis', 'other']),
  title: z.string(),
  description: z.string().optional(),
  documentUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

const ScheduleHearingSchema = z.object({
  hearingDate: z.string(),
  location: z.string(),
  hearingType: z.enum(['in_person', 'virtual', 'hybrid']),
  notes: z.string().optional(),
});

const RecordDecisionSchema = z.object({
  decision: z.enum(['granted', 'partially_granted', 'denied', 'dismissed']),
  adjustedValue: z.number().positive().optional(),
  reasoning: z.string(),
  effectiveDate: z.string(),
});

const GenerateArgumentSchema = z.object({
  focusAreas: z.array(z.string()).optional(),
  includeComparables: z.boolean().default(true),
  includeMarketAnalysis: z.boolean().default(true),
  tone: z.enum(['formal', 'persuasive', 'technical']).default('persuasive'),
});

/**
 * List appeals
 */
export async function listAppeals(req: Request, res: Response) {
  const tenantId = req.tenantId!;
  const { propertyId, status, taxYear } = req.query;
  const { limit, offset } = calculatePagination(req);

  logger.info({ tenantId, status, taxYear }, 'Listing appeals');

  const appeals = await appealsService.listAppeals(tenantId, {
    propertyId: propertyId as string,
    status: status as string,
    taxYear: taxYear ? parseInt(taxYear as string) : undefined,
    limit,
    offset,
  });

  res.json({ success: true, data: appeals });
}

/**
 * Create appeal
 */
export async function createAppeal(req: Request, res: Response) {
  const data = CreateAppealSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, propertyId: data.propertyId, taxYear: data.taxYear }, 'Creating appeal');

  const appeal = await appealsService.createAppeal(tenantId, userId, data);

  res.status(201).json({ success: true, data: appeal });
}

/**
 * Get appeal details
 */
export async function getAppeal(req: Request, res: Response) {
  const { appealId } = req.params;
  const tenantId = req.tenantId!;

  const appeal = await appealsService.getAppeal(tenantId, appealId);

  res.json({ success: true, data: appeal });
}

/**
 * Update appeal
 */
export async function updateAppeal(req: Request, res: Response) {
  const { appealId } = req.params;
  const data = UpdateAppealSchema.parse(req.body);
  const tenantId = req.tenantId!;

  const appeal = await appealsService.updateAppeal(tenantId, appealId, data);

  res.json({ success: true, data: appeal });
}

/**
 * Add evidence
 */
export async function addEvidence(req: Request, res: Response) {
  const { appealId } = req.params;
  const data = AddEvidenceSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, appealId, evidenceType: data.evidenceType }, 'Adding evidence');

  const evidence = await appealsService.addEvidence(tenantId, userId, appealId, data);

  res.status(201).json({ success: true, data: evidence });
}

/**
 * List evidence
 */
export async function listEvidence(req: Request, res: Response) {
  const { appealId } = req.params;
  const tenantId = req.tenantId!;

  const evidence = await appealsService.listEvidence(tenantId, appealId);

  res.json({ success: true, data: evidence });
}

/**
 * Generate AI appeal argument
 */
export async function generateArgument(req: Request, res: Response) {
  const { appealId } = req.params;
  const data = GenerateArgumentSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, appealId, tone: data.tone }, 'Generating appeal argument');

  const argument = await appealsService.generateArgument(tenantId, appealId, data);

  res.json({ success: true, data: argument });
}

/**
 * Schedule hearing
 */
export async function scheduleHearing(req: Request, res: Response) {
  const { appealId } = req.params;
  const data = ScheduleHearingSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, appealId, hearingDate: data.hearingDate }, 'Scheduling hearing');

  const appeal = await appealsService.scheduleHearing(tenantId, userId, appealId, data);

  res.json({ success: true, data: appeal });
}

/**
 * Submit appeal
 */
export async function submitAppeal(req: Request, res: Response) {
  const { appealId } = req.params;
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, appealId }, 'Submitting appeal');

  const appeal = await appealsService.submitAppeal(tenantId, userId, appealId);

  res.json({ success: true, data: appeal });
}

/**
 * Record decision
 */
export async function recordDecision(req: Request, res: Response) {
  const { appealId } = req.params;
  const data = RecordDecisionSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, appealId, decision: data.decision }, 'Recording appeal decision');

  const appeal = await appealsService.recordDecision(tenantId, userId, appealId, data);

  res.json({ success: true, data: appeal });
}

/**
 * Get timeline
 */
export async function getTimeline(req: Request, res: Response) {
  const { appealId } = req.params;
  const tenantId = req.tenantId!;

  const timeline = await appealsService.getTimeline(tenantId, appealId);

  res.json({ success: true, data: timeline });
}

/**
 * Get statistics
 */
export async function getStatistics(req: Request, res: Response) {
  const tenantId = req.tenantId!;
  const { taxYear } = req.query;

  const stats = await appealsService.getStatistics(tenantId, taxYear ? parseInt(taxYear as string) : undefined);

  res.json({ success: true, data: stats });
}
