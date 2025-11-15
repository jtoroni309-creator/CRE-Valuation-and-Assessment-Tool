/**
 * AI controller - Request handlers for OpenAI operations
 */

import { Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '@axxiom/shared';
import * as aiService from '../services/aiService';

const ValuationNarrativeSchema = z.object({
  valuationId: z.string().uuid(),
  propertyData: z.object({
    address: z.string(),
    propertyType: z.string(),
    sqft: z.number(),
    yearBuilt: z.number().optional(),
    value: z.number(),
    approach: z.string(),
  }),
  comparables: z.array(z.any()).optional(),
  tone: z.enum(['formal', 'technical', 'concise']).default('formal'),
});

const AppealArgumentSchema = z.object({
  appealId: z.string().uuid(),
  propertyData: z.object({
    address: z.string(),
    currentAssessment: z.number(),
    claimedValue: z.number(),
    propertyType: z.string(),
  }),
  grounds: z.array(z.string()),
  evidence: z.array(z.object({
    type: z.string(),
    description: z.string(),
  })).optional(),
  tone: z.enum(['formal', 'persuasive', 'technical']).default('persuasive'),
});

const MarketAnalysisSchema = z.object({
  location: z.object({
    city: z.string(),
    state: z.string(),
    neighborhood: z.string().optional(),
  }),
  propertyType: z.string(),
  timeframe: z.enum(['current', 'historical_1yr', 'historical_3yr', 'forecast']).default('current'),
});

const PropertyAnalysisSchema = z.object({
  propertyId: z.string().uuid(),
  propertyData: z.any(),
  analysisType: z.enum(['valuation_insights', 'risk_assessment', 'market_positioning', 'investment_potential']),
});

const ChatSchema = z.object({
  message: z.string(),
  context: z.object({
    documentIds: z.array(z.string()).optional(),
    propertyId: z.string().uuid().optional(),
    conversationHistory: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })).optional(),
  }).optional(),
});

const IndexDocumentsSchema = z.object({
  documents: z.array(z.object({
    documentId: z.string(),
    content: z.string(),
    metadata: z.record(z.any()),
  })),
});

const SemanticSearchSchema = z.object({
  query: z.string(),
  filters: z.record(z.any()).optional(),
  topK: z.number().min(1).max(50).default(10),
});

const SummarizeSchema = z.object({
  content: z.string(),
  maxLength: z.number().min(50).max(1000).default(300),
  style: z.enum(['bullet_points', 'paragraph', 'executive']).default('paragraph'),
});

/**
 * Generate valuation narrative
 */
export async function generateValuationNarrative(req: Request, res: Response) {
  const data = ValuationNarrativeSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, valuationId: data.valuationId }, 'Generating valuation narrative');

  const narrative = await aiService.generateValuationNarrative(tenantId, data);

  res.json({ success: true, data: { narrative } });
}

/**
 * Generate appeal argument
 */
export async function generateAppealArgument(req: Request, res: Response) {
  const data = AppealArgumentSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, appealId: data.appealId }, 'Generating appeal argument');

  const argument = await aiService.generateAppealArgument(tenantId, data);

  res.json({ success: true, data: argument });
}

/**
 * Generate market analysis
 */
export async function generateMarketAnalysis(req: Request, res: Response) {
  const data = MarketAnalysisSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, location: data.location, propertyType: data.propertyType }, 'Generating market analysis');

  const analysis = await aiService.generateMarketAnalysis(tenantId, data);

  res.json({ success: true, data: { analysis } });
}

/**
 * Analyze property
 */
export async function analyzeProperty(req: Request, res: Response) {
  const data = PropertyAnalysisSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, propertyId: data.propertyId, analysisType: data.analysisType }, 'Analyzing property');

  const insights = await aiService.analyzeProperty(tenantId, data);

  res.json({ success: true, data: { insights } });
}

/**
 * Interactive chat with RAG
 */
export async function chat(req: Request, res: Response) {
  const data = ChatSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, hasContext: !!data.context }, 'Processing chat request');

  const response = await aiService.chat(tenantId, data);

  res.json({ success: true, data: response });
}

/**
 * Index documents for RAG
 */
export async function indexDocuments(req: Request, res: Response) {
  const data = IndexDocumentsSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, documentCount: data.documents.length }, 'Indexing documents');

  const result = await aiService.indexDocuments(tenantId, data.documents);

  res.json({ success: true, data: result });
}

/**
 * Semantic search
 */
export async function semanticSearch(req: Request, res: Response) {
  const data = SemanticSearchSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, query: data.query, topK: data.topK }, 'Performing semantic search');

  const results = await aiService.semanticSearch(tenantId, data);

  res.json({ success: true, data: { results } });
}

/**
 * Summarize content
 */
export async function summarize(req: Request, res: Response) {
  const data = SummarizeSchema.parse(req.body);
  const tenantId = req.tenantId!;

  logger.info({ tenantId, contentLength: data.content.length, style: data.style }, 'Summarizing content');

  const summary = await aiService.summarize(tenantId, data);

  res.json({ success: true, data: { summary } });
}
