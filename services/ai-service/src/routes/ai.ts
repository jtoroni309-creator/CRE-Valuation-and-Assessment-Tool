/**
 * AI routes - OpenAI and RAG endpoints
 */

import { Router } from 'express';
import { authenticate, authorize, enforceTenantIsolation, asyncHandler, rateLimit } from '@axxiom/shared';
import * as controller from '../controllers/aiController';

export const router = Router();

router.use(authenticate);
router.use(enforceTenantIsolation);
router.use(rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 30 })); // Lower limit for AI requests

/**
 * POST /api/v1/ai/generate/valuation-narrative
 * Generate valuation narrative using AI
 */
router.post('/generate/valuation-narrative', authorize('ai.generate'), asyncHandler(controller.generateValuationNarrative));

/**
 * POST /api/v1/ai/generate/appeal-argument
 * Generate appeal argument using AI with RAG
 */
router.post('/generate/appeal-argument', authorize('ai.generate'), asyncHandler(controller.generateAppealArgument));

/**
 * POST /api/v1/ai/generate/market-analysis
 * Generate market analysis using AI
 */
router.post('/generate/market-analysis', authorize('ai.generate'), asyncHandler(controller.generateMarketAnalysis));

/**
 * POST /api/v1/ai/analyze/property
 * Analyze property data and provide insights
 */
router.post('/analyze/property', authorize('ai.analyze'), asyncHandler(controller.analyzeProperty));

/**
 * POST /api/v1/ai/chat
 * Interactive chat with document context (RAG)
 */
router.post('/chat', authorize('ai.chat'), asyncHandler(controller.chat));

/**
 * POST /api/v1/ai/embeddings/index
 * Index documents for RAG
 */
router.post('/embeddings/index', authorize('ai.admin'), asyncHandler(controller.indexDocuments));

/**
 * POST /api/v1/ai/embeddings/search
 * Semantic search using embeddings
 */
router.post('/embeddings/search', authorize('ai.search'), asyncHandler(controller.semanticSearch));

/**
 * POST /api/v1/ai/summarize
 * Summarize long documents or reports
 */
router.post('/summarize', authorize('ai.generate'), asyncHandler(controller.summarize));
