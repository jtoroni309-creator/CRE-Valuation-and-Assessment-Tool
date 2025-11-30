/**
 * API Module Exports
 *
 * Central export point for all API-related functionality.
 */

export { apiConfig } from './config';
export { aiClient } from './ai.client';
export {
  useValuation,
  useMarketIntelligence,
  useVisionAnalysis,
  usePredictions,
  useInvestmentAnalysis,
  useDocumentProcessor,
  useAIChat,
  useAIHealth,
} from './hooks';

// Re-export types for convenience
export type {
  AIResponse,
  AISource,
  ValuationRequest,
  ValuationResult,
  ValuationApproach,
  ValuationComparable,
  MarketRequest,
  MarketResult,
  MarketMetrics,
  MarketForecast,
  SubmarketData,
  MarketSignal,
  DocumentResult,
  ExtractedField,
  DocumentEntity,
  VisionRequest,
  VisionResult,
  ComponentAnalysis,
  DefectDetection,
  FeatureDetection,
  PredictionRequest,
  PredictionResult,
  PredictionDataPoint,
  PredictionFactor,
  InvestmentRequest,
  InvestmentResult,
  InvestmentReturns,
  InvestmentRisk,
  InvestmentOpportunity,
  MarketComparison,
  ChatMessage,
  ChatRequest,
  ChatResponse,
} from '@/types/ai.types';
