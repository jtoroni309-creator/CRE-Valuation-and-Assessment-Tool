/**
 * Sources controller - Data source management
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '@axxiom/shared';
import * as sourcesService from '../services/sourcesService';

const CreateSourceSchema = z.object({
  name: z.string(),
  sourceType: z.enum(['mls', 'public_records', 'api', 'web_scraper', 'manual']),
  configuration: z.object({
    apiKey: z.string().optional(),
    endpoint: z.string().url().optional(),
    credentials: z.record(z.string()).optional(),
    schedule: z.string().optional(),
  }),
  isActive: z.boolean().default(true),
});

const UpdateSourceSchema = z.object({
  name: z.string().optional(),
  configuration: z.object({
    apiKey: z.string().optional(),
    endpoint: z.string().url().optional(),
    credentials: z.record(z.string()).optional(),
    schedule: z.string().optional(),
  }).optional(),
  isActive: z.boolean().optional(),
});

/**
 * List data sources
 */
export async function listSources(req: Request, res: Response) {
  const tenantId = req.tenantId!;
  const { sourceType, isActive } = req.query;

  const sources = await sourcesService.listSources(tenantId, {
    sourceType: sourceType as string,
    isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
  });

  res.json({ success: true, data: sources });
}

/**
 * Create data source
 */
export async function createSource(req: Request, res: Response) {
  const data = CreateSourceSchema.parse(req.body);
  const tenantId = req.tenantId!;
  const userId = req.user!.userId;

  logger.info({ tenantId, sourceType: data.sourceType }, 'Creating data source');

  const source = await sourcesService.createSource(tenantId, userId, data);

  res.status(201).json({ success: true, data: source });
}

/**
 * Get data source
 */
export async function getSource(req: Request, res: Response) {
  const { sourceId } = req.params;
  const tenantId = req.tenantId!;

  const source = await sourcesService.getSource(tenantId, sourceId);

  res.json({ success: true, data: source });
}

/**
 * Update data source
 */
export async function updateSource(req: Request, res: Response) {
  const { sourceId } = req.params;
  const data = UpdateSourceSchema.parse(req.body);
  const tenantId = req.tenantId!;

  const source = await sourcesService.updateSource(tenantId, sourceId, data);

  res.json({ success: true, data: source });
}

/**
 * Delete data source
 */
export async function deleteSource(req: Request, res: Response) {
  const { sourceId } = req.params;
  const tenantId = req.tenantId!;

  await sourcesService.deleteSource(tenantId, sourceId);

  res.json({ success: true, message: 'Data source deleted' });
}

/**
 * Test data source connection
 */
export async function testSource(req: Request, res: Response) {
  const { sourceId } = req.params;
  const tenantId = req.tenantId!;

  logger.info({ tenantId, sourceId }, 'Testing data source connection');

  const result = await sourcesService.testSource(tenantId, sourceId);

  res.json({ success: true, data: result });
}

/**
 * Get source statistics
 */
export async function getSourceStatistics(req: Request, res: Response) {
  const { sourceId } = req.params;
  const tenantId = req.tenantId!;

  const stats = await sourcesService.getSourceStatistics(tenantId, sourceId);

  res.json({ success: true, data: stats });
}
