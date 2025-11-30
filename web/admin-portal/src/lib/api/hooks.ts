/**
 * React Hooks for AI Services
 *
 * Production-ready hooks with loading states, error handling, and caching.
 */

import { useState, useCallback } from 'react';
import { aiClient } from './ai.client';
import type {
  ValuationRequest,
  ValuationResult,
  MarketRequest,
  MarketResult,
  VisionRequest,
  VisionResult,
  PredictionRequest,
  PredictionResult,
  InvestmentRequest,
  InvestmentResult,
  ChatRequest,
  ChatResponse,
  DocumentResult,
  AIResponse,
} from '@/types/ai.types';

interface UseAIState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  metadata: AIResponse<T>['metadata'] | null;
}

interface UseAIReturn<T, R> extends UseAIState<T> {
  execute: (request: R) => Promise<void>;
  reset: () => void;
}

function useAIService<T, R>(
  serviceFn: (request: R) => Promise<AIResponse<T>>
): UseAIReturn<T, R> {
  const [state, setState] = useState<UseAIState<T>>({
    data: null,
    loading: false,
    error: null,
    metadata: null,
  });

  const execute = useCallback(async (request: R) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await serviceFn(request);

      if (response.success) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          metadata: response.metadata,
        });
      } else {
        throw new Error(response.error?.message || 'Request failed');
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        metadata: null,
      });
    }
  }, [serviceFn]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      metadata: null,
    });
  }, []);

  return { ...state, execute, reset };
}

/**
 * Hook for AI-powered property valuation
 */
export function useValuation() {
  return useAIService<ValuationResult, ValuationRequest>(aiClient.generateValuation);
}

/**
 * Hook for market intelligence data
 */
export function useMarketIntelligence() {
  return useAIService<MarketResult, MarketRequest>(aiClient.getMarketIntelligence);
}

/**
 * Hook for vision-based property analysis
 */
export function useVisionAnalysis() {
  return useAIService<VisionResult, VisionRequest>(aiClient.analyzeProperty);
}

/**
 * Hook for predictive analytics
 */
export function usePredictions() {
  return useAIService<PredictionResult[], PredictionRequest>(aiClient.getPredictions);
}

/**
 * Hook for investment analysis
 */
export function useInvestmentAnalysis() {
  return useAIService<InvestmentResult, InvestmentRequest>(aiClient.analyzeInvestment);
}

/**
 * Hook for document processing
 */
export function useDocumentProcessor() {
  const [state, setState] = useState<UseAIState<DocumentResult>>({
    data: null,
    loading: false,
    error: null,
    metadata: null,
  });

  const processDocument = useCallback(async (file: File, documentType?: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await aiClient.processDocument(file, documentType);

      if (response.success) {
        setState({
          data: response.data,
          loading: false,
          error: null,
          metadata: response.metadata,
        });
      } else {
        throw new Error(response.error?.message || 'Document processing failed');
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        metadata: null,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      metadata: null,
    });
  }, []);

  return { ...state, processDocument, reset };
}

/**
 * Hook for AI chat
 */
export function useAIChat() {
  const [messages, setMessages] = useState<ChatResponse['message'][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, context?: ChatRequest['context']) => {
    setLoading(true);
    setError(null);

    try {
      const response = await aiClient.chat({
        message: content,
        conversationId: conversationId || undefined,
        context,
      });

      if (response.success) {
        setMessages((prev) => [...prev, response.data.message]);
        setConversationId(response.data.conversationId);
        setLoading(false);
        return response.data;
      } else {
        throw new Error(response.error?.message || 'Chat request failed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      setLoading(false);
      throw error;
    }
  }, [conversationId]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    conversationId,
    sendMessage,
    clearChat,
  };
}

/**
 * Hook for checking AI service health
 */
export function useAIHealth() {
  const [health, setHealth] = useState<{
    status: string;
    models: Record<string, boolean>;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await aiClient.healthCheck();
      setHealth(response);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Health check failed'));
      setLoading(false);
    }
  }, []);

  return { health, loading, error, checkHealth };
}

export default {
  useValuation,
  useMarketIntelligence,
  useVisionAnalysis,
  usePredictions,
  useInvestmentAnalysis,
  useDocumentProcessor,
  useAIChat,
  useAIHealth,
};
