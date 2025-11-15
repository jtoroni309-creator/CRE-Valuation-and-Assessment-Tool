/**
 * Reports controller - Request handlers
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { logger, calculatePagination } from '@axxiom/shared';
import * as reportsService from '../services/reportsService';

const ValuationReportSchema = z.object({
  format: z.enum(['pdf', 'html']).default('pdf'),
  includeComparables: z.boolean().default(true),
  includePhotos: z.boolean().default(true),
  includeExplanations: z.boolean().default(true),
  templateId: z.string().optional(),
});

const AssessmentRollSchema = z.object({
  format: z.enum(['xlsx', 'csv']).default('xlsx'),
  includeNeighborhood: z.boolean().default(true),
  includePropertyType: z.boolean().default(true),
  groupBy: z.enum(['none', 'neighborhood', 'property_type']).default('none'),
});

const AppealReportSchema = z.object({
  format: z.enum(['pdf', 'html']).default('pdf'),
  includeEvidence: z.boolean().default(true),
  includeTimeline: z.boolean().default(true),
  includeComparables: z.boolean().default(true),
});

const BatchValuationsSchema = z.object({
  valuationIds: z.array(z.string().uuid()).min(1).max(100),
  format: z.enum(['pdf', 'zip']).default('zip'),
  options: ValuationReportSchema.optional(),
});

const BatchAssessmentsSchema = z.object({
  runId: z.string().uuid(),
  propertyIds: z.array(z.string().uuid()).optional(),
  format: z.enum(['pdf', 'zip']).default('zip'),
});

/**
 * Generate valuation report
 */
export async function generateValuationReport(req: Request, res: Response) {
  const { valuationId } = req.params;
  const options = ValuationReportSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, valuationId, format: options.format }, 'Generating valuation report');

  const result = await reportsService.generateValuationReport(tenantId, userId, valuationId, options);

  if (options.format === 'pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="valuation-${valuationId}.pdf"`);
    res.send(result.buffer);
  } else {
    res.json({ success: true, data: { html: result.html, reportId: result.reportId } });
  }
}

/**
 * Generate assessment roll
 */
export async function generateAssessmentRoll(req: Request, res: Response) {
  const { runId } = req.params;
  const options = AssessmentRollSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, runId, format: options.format }, 'Generating assessment roll');

  const result = await reportsService.generateAssessmentRoll(tenantId, userId, runId, options);

  const contentType = options.format === 'xlsx'
    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    : 'text/csv';
  const extension = options.format === 'xlsx' ? 'xlsx' : 'csv';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="assessment-roll-${runId}.${extension}"`);
  res.send(result.buffer);
}

/**
 * Generate appeal report
 */
export async function generateAppealReport(req: Request, res: Response) {
  const { appealId } = req.params;
  const options = AppealReportSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, appealId, format: options.format }, 'Generating appeal report');

  const result = await reportsService.generateAppealReport(tenantId, userId, appealId, options);

  if (options.format === 'pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="appeal-${appealId}.pdf"`);
    res.send(result.buffer);
  } else {
    res.json({ success: true, data: { html: result.html, reportId: result.reportId } });
  }
}

/**
 * Batch generate valuation reports
 */
export async function batchGenerateValuations(req: Request, res: Response) {
  const data = BatchValuationsSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, count: data.valuationIds.length }, 'Batch generating valuation reports');

  const result = await reportsService.batchGenerateValuations(
    tenantId,
    userId,
    data.valuationIds,
    data.options || {}
  );

  if (data.format === 'zip') {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="valuations-${Date.now()}.zip"`);
    res.send(result.buffer);
  } else {
    res.json({ success: true, data: { reportIds: result.reportIds } });
  }
}

/**
 * Batch generate assessment notices
 */
export async function batchGenerateAssessments(req: Request, res: Response) {
  const data = BatchAssessmentsSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, runId: data.runId }, 'Batch generating assessment notices');

  const result = await reportsService.batchGenerateAssessments(
    tenantId,
    userId,
    data.runId,
    data.propertyIds
  );

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="assessments-${data.runId}.zip"`);
  res.send(result.buffer);
}

/**
 * Get report history
 */
export async function getReportHistory(req: Request, res: Response) {
  const tenantId = req.tenantId!;
  const { reportType } = req.query;
  const { limit, offset } = calculatePagination(req);

  const history = await reportsService.getReportHistory(tenantId, {
    reportType: reportType as string,
    limit,
    offset,
  });

  res.json({ success: true, data: history });
}

/**
 * Download report
 */
export async function downloadReport(req: Request, res: Response) {
  const { reportId } = req.params;
  const tenantId = req.tenantId!;

  const report = await reportsService.downloadReport(tenantId, reportId);

  res.setHeader('Content-Type', report.contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${report.filename}"`);
  res.send(report.buffer);
}

/**
 * List templates
 */
export async function listTemplates(req: Request, res: Response) {
  const tenantId = req.tenantId!;

  const templates = await reportsService.listTemplates(tenantId);

  res.json({ success: true, data: templates });
}
