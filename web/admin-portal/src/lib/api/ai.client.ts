/**
 * AI API Client
 *
 * Production-ready client for AI service endpoints.
 * Includes retry logic, error handling, and mock data fallback.
 */

import { apiConfig } from './config';
import type {
  AIResponse,
  ValuationRequest,
  ValuationResult,
  MarketRequest,
  MarketResult,
  DocumentResult,
  VisionRequest,
  VisionResult,
  PredictionRequest,
  PredictionResult,
  InvestmentRequest,
  InvestmentResult,
  ChatRequest,
  ChatResponse,
} from '@/types/ai.types';

class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

interface RequestOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

async function fetchWithRetry<T>(
  url: string,
  options: RequestInit & RequestOptions = {}
): Promise<T> {
  const {
    timeout = apiConfig.defaultTimeout,
    retries = apiConfig.maxRetries,
    headers = {},
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code || 'API_ERROR',
          errorData.details
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on client errors (4xx)
      if (error instanceof APIError && error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }

      // Wait before retrying
      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, apiConfig.retryDelay * Math.pow(2, attempt))
        );
      }
    }
  }

  throw lastError || new Error('Request failed');
}

/**
 * AI Service API Client
 */
export const aiClient = {
  /**
   * Generate property valuation using AI
   */
  async generateValuation(request: ValuationRequest): Promise<AIResponse<ValuationResult>> {
    if (apiConfig.enableMockData) {
      return generateMockValuation(request);
    }

    return fetchWithRetry<AIResponse<ValuationResult>>(
      `${apiConfig.aiServiceUrl}/generate/valuation`,
      {
        method: 'POST',
        body: JSON.stringify(request),
        timeout: apiConfig.aiTimeout,
      }
    );
  },

  /**
   * Get market intelligence data
   */
  async getMarketIntelligence(request: MarketRequest): Promise<AIResponse<MarketResult>> {
    if (apiConfig.enableMockData) {
      return generateMockMarket(request);
    }

    return fetchWithRetry<AIResponse<MarketResult>>(
      `${apiConfig.aiServiceUrl}/generate/market-analysis`,
      {
        method: 'POST',
        body: JSON.stringify(request),
        timeout: apiConfig.aiTimeout,
      }
    );
  },

  /**
   * Process document with AI
   */
  async processDocument(file: File, documentType?: string): Promise<AIResponse<DocumentResult>> {
    if (apiConfig.enableMockData) {
      return generateMockDocument(file);
    }

    const formData = new FormData();
    formData.append('file', file);
    if (documentType) {
      formData.append('documentType', documentType);
    }

    return fetchWithRetry<AIResponse<DocumentResult>>(
      `${apiConfig.documentServiceUrl}/process`,
      {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set content-type for FormData
        timeout: apiConfig.uploadTimeout,
      }
    );
  },

  /**
   * Analyze property images with Vision AI
   */
  async analyzeProperty(request: VisionRequest): Promise<AIResponse<VisionResult>> {
    if (apiConfig.enableMockData) {
      return generateMockVision();
    }

    const formData = new FormData();
    request.images.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`images[${index}]`, image);
      } else {
        formData.append(`imageUrls[${index}]`, image);
      }
    });
    formData.append('analysisType', request.analysisType);
    if (request.propertyType) {
      formData.append('propertyType', request.propertyType);
    }

    return fetchWithRetry<AIResponse<VisionResult>>(
      `${apiConfig.visionServiceUrl}/analyze/property`,
      {
        method: 'POST',
        body: formData,
        headers: {},
        timeout: apiConfig.aiTimeout,
      }
    );
  },

  /**
   * Get predictive analytics
   */
  async getPredictions(request: PredictionRequest): Promise<AIResponse<PredictionResult[]>> {
    if (apiConfig.enableMockData) {
      return generateMockPredictions(request);
    }

    return fetchWithRetry<AIResponse<PredictionResult[]>>(
      `${apiConfig.aiServiceUrl}/predictions`,
      {
        method: 'POST',
        body: JSON.stringify(request),
        timeout: apiConfig.aiTimeout,
      }
    );
  },

  /**
   * Get investment analysis
   */
  async analyzeInvestment(request: InvestmentRequest): Promise<AIResponse<InvestmentResult>> {
    if (apiConfig.enableMockData) {
      return generateMockInvestment(request);
    }

    return fetchWithRetry<AIResponse<InvestmentResult>>(
      `${apiConfig.aiServiceUrl}/analyze/investment`,
      {
        method: 'POST',
        body: JSON.stringify(request),
        timeout: apiConfig.aiTimeout,
      }
    );
  },

  /**
   * Send chat message
   */
  async chat(request: ChatRequest): Promise<AIResponse<ChatResponse>> {
    if (apiConfig.enableMockData) {
      return generateMockChat(request);
    }

    return fetchWithRetry<AIResponse<ChatResponse>>(
      `${apiConfig.aiServiceUrl}/chat`,
      {
        method: 'POST',
        body: JSON.stringify(request),
        timeout: apiConfig.aiTimeout,
      }
    );
  },

  /**
   * Check AI service health
   */
  async healthCheck(): Promise<{ status: string; models: Record<string, boolean> }> {
    return fetchWithRetry<{ status: string; models: Record<string, boolean> }>(
      `${apiConfig.aiServiceUrl}/health`,
      { method: 'GET' }
    );
  },
};

// Mock data generators for development/testing
function generateMockValuation(request: ValuationRequest): AIResponse<ValuationResult> {
  const baseValue = request.size * 250;
  const finalValue = Math.round(baseValue * (0.9 + Math.random() * 0.2));

  return {
    success: true,
    data: {
      propertyAddress: request.propertyAddress,
      propertyType: request.propertyType,
      size: request.size,
      finalValue,
      valueRange: { low: finalValue * 0.95, high: finalValue * 1.05 },
      confidence: 0.85 + Math.random() * 0.1,
      approaches: [
        {
          name: 'Income Approach',
          value: finalValue * 1.02,
          confidence: 0.88,
          weight: 45,
          details: {
            'Net Operating Income': `$${Math.round(finalValue * 0.06).toLocaleString()}`,
            'Cap Rate': '5.75%',
          },
        },
        {
          name: 'Sales Comparison',
          value: finalValue * 0.98,
          confidence: 0.85,
          weight: 40,
          details: { 'Comparables Analyzed': 8, 'Average $/SF': `$${Math.round(finalValue / request.size)}` },
        },
        {
          name: 'Cost Approach',
          value: finalValue * 1.01,
          confidence: 0.75,
          weight: 15,
          details: { 'Land Value': `$${Math.round(finalValue * 0.3).toLocaleString()}` },
        },
      ],
      comparables: [],
      insights: [
        'Property value supported by strong submarket fundamentals',
        'Income approach most reliable given stable tenancy',
        'Consider ESG improvements to enhance value',
      ],
      generatedAt: new Date().toISOString(),
    },
    metadata: {
      model: 'gemini-1.5-pro',
      tokensUsed: 1500,
      processingTime: 2100,
      confidence: 0.89,
      requestId: `val-${Date.now()}`,
    },
  };
}

function generateMockMarket(request: MarketRequest): AIResponse<MarketResult> {
  return {
    success: true,
    data: {
      metro: request.metro,
      propertyType: request.propertyType,
      asOfDate: new Date().toISOString(),
      metrics: {
        capRate: 5.5 + Math.random() * 1.5,
        capRateChange: -0.25 + Math.random() * 0.5,
        vacancy: 4 + Math.random() * 4,
        vacancyChange: -1 + Math.random() * 2,
        rentGrowth: 3 + Math.random() * 5,
        absorption: `${Math.round(5 + Math.random() * 10)}M SF`,
        inventory: `${Math.round(800 + Math.random() * 400)}M SF`,
        underConstruction: `${Math.round(30 + Math.random() * 30)}M SF`,
      },
      forecast: [],
      submarkets: [],
      signals: [
        { metric: 'Cap Rate', direction: 'down', confidence: 78, timeframe: '12 months' },
        { metric: 'Rent Growth', direction: 'up', confidence: 82, timeframe: '6 months' },
      ],
      insights: ['Strong demand fundamentals support continued growth'],
    },
    metadata: {
      model: 'gemini-1.5-pro',
      tokensUsed: 1200,
      processingTime: 1800,
      confidence: 0.85,
      requestId: `mkt-${Date.now()}`,
    },
  };
}

function generateMockDocument(file: File): AIResponse<DocumentResult> {
  return {
    success: true,
    data: {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      fileType: file.type.split('/')[1]?.toUpperCase() || 'UNKNOWN',
      documentType: 'Appraisal Report',
      status: 'completed',
      extractedFields: [
        { name: 'Property Address', value: '123 Main Street', confidence: 0.95 },
        { name: 'Appraised Value', value: '$5,000,000', confidence: 0.92 },
      ],
      summary: 'Document processed successfully with high confidence extraction.',
      entities: [
        { type: 'Currency', value: 'USD', count: 15 },
        { type: 'Date', value: 'Various', count: 8 },
      ],
      processedAt: new Date().toISOString(),
      confidence: 0.91,
    },
    metadata: {
      model: 'document-ai',
      tokensUsed: 0,
      processingTime: 3500,
      confidence: 0.91,
      requestId: `doc-${Date.now()}`,
    },
  };
}

function generateMockVision(): AIResponse<VisionResult> {
  return {
    success: true,
    data: {
      overall: 75 + Math.floor(Math.random() * 15),
      components: [
        { name: 'Roof', score: 78, condition: 'Good', findings: ['Minor wear visible'] },
        { name: 'Exterior', score: 82, condition: 'Good', findings: ['Well maintained'] },
      ],
      defects: [
        { type: 'Minor Wear', severity: 'Minor', location: 'Roof', estimatedCost: 5000, confidence: 0.85 },
      ],
      features: [
        { name: 'Parking', detected: true, quality: 'Good', confidence: 0.92 },
      ],
      recommendations: ['Schedule roof inspection within 12 months'],
      processedAt: new Date().toISOString(),
    },
    metadata: {
      model: 'gemini-vision',
      tokensUsed: 800,
      processingTime: 4200,
      confidence: 0.88,
      requestId: `vis-${Date.now()}`,
    },
  };
}

function generateMockPredictions(request: PredictionRequest): AIResponse<PredictionResult[]> {
  return {
    success: true,
    data: request.metrics.map((metric) => ({
      metric,
      current: metric === 'Cap Rate' ? 5.75 : 1000000,
      predictions: [],
      trend: 'up' as const,
      confidence: 0.82,
      factors: [
        { name: 'Market Conditions', impact: 'positive' as const, weight: 40 },
      ],
    })),
    metadata: {
      model: 'vertex-ml',
      tokensUsed: 0,
      processingTime: 1500,
      confidence: 0.82,
      requestId: `pred-${Date.now()}`,
    },
  };
}

function generateMockInvestment(request: InvestmentRequest): AIResponse<InvestmentResult> {
  const score = 70 + Math.floor(Math.random() * 20);
  return {
    success: true,
    data: {
      property: {
        name: request.propertyName,
        type: request.propertyType,
        location: request.location,
        price: request.price,
        size: request.size,
      },
      score,
      recommendation: score >= 80 ? 'Buy' : score >= 60 ? 'Hold' : 'Sell',
      returns: {
        irr: 15 + Math.random() * 8,
        equityMultiple: 1.8 + Math.random() * 0.6,
        cashOnCash: 6 + Math.random() * 4,
        capRate: 5.5 + Math.random() * 1.5,
      },
      risks: [],
      opportunities: [],
      comparisons: [],
      aiInsights: ['Strong investment fundamentals identified'],
    },
    metadata: {
      model: 'gemini-1.5-pro',
      tokensUsed: 2000,
      processingTime: 2800,
      confidence: 0.86,
      requestId: `inv-${Date.now()}`,
    },
  };
}

function generateMockChat(request: ChatRequest): AIResponse<ChatResponse> {
  return {
    success: true,
    data: {
      message: {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'I understand your question. Based on my analysis of the commercial real estate market...',
        timestamp: new Date().toISOString(),
        sources: [{ type: 'Market Data', title: 'Q4 2024 Report', confidence: 0.92 }],
        suggestedActions: ['Generate detailed report', 'View comparable sales'],
        metadata: {
          model: 'gemini-1.5-pro',
          tokensUsed: 500,
          responseTime: 1200,
          confidence: 0.88,
        },
      },
      conversationId: request.conversationId || `conv-${Date.now()}`,
      suggestedFollowUps: ['Tell me more about market trends', 'What are the risks?'],
    },
    metadata: {
      model: 'gemini-1.5-pro',
      tokensUsed: 500,
      processingTime: 1200,
      confidence: 0.88,
      requestId: `chat-${Date.now()}`,
    },
  };
}

export default aiClient;
