/**
 * AI Service Configuration
 *
 * Production-ready configuration for all AI services.
 * All values are externalized to environment variables with sensible defaults.
 */

// Model Configuration
export const aiConfig = {
  // Gemini Models
  gemini: {
    model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    visionModel: process.env.GEMINI_VISION_MODEL || 'gemini-1.5-pro-vision',
    embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-004',
    maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '8192', 10),
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
    topP: parseFloat(process.env.GEMINI_TOP_P || '0.95'),
    topK: parseInt(process.env.GEMINI_TOP_K || '40', 10),
  },

  // Azure OpenAI (fallback)
  azureOpenAI: {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview',
    deploymentGPT4: process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 || 'gpt-4o',
    deploymentGPT4Turbo: process.env.AZURE_OPENAI_DEPLOYMENT_GPT4_TURBO || 'gpt-4-turbo',
    deploymentEmbeddings: process.env.AZURE_OPENAI_DEPLOYMENT_EMBEDDINGS || 'text-embedding-ada-002',
    maxTokens: parseInt(process.env.AZURE_OPENAI_MAX_TOKENS || '4096', 10),
    temperature: parseFloat(process.env.AZURE_OPENAI_TEMPERATURE || '0.7'),
  },

  // Task-specific temperature settings
  temperatures: {
    valuation: parseFloat(process.env.AI_TEMP_VALUATION || '0.7'),
    appeal: parseFloat(process.env.AI_TEMP_APPEAL || '0.7'),
    marketAnalysis: parseFloat(process.env.AI_TEMP_MARKET || '0.6'),
    summarization: parseFloat(process.env.AI_TEMP_SUMMARY || '0.5'),
    chat: parseFloat(process.env.AI_TEMP_CHAT || '0.8'),
    documentExtraction: parseFloat(process.env.AI_TEMP_DOCUMENT || '0.3'),
  },

  // Safety settings
  safetySettings: {
    harassmentThreshold: process.env.AI_SAFETY_HARASSMENT || 'BLOCK_MEDIUM_AND_ABOVE',
    hateSpeechThreshold: process.env.AI_SAFETY_HATE_SPEECH || 'BLOCK_MEDIUM_AND_ABOVE',
    sexuallyExplicitThreshold: process.env.AI_SAFETY_SEXUAL || 'BLOCK_MEDIUM_AND_ABOVE',
    dangerousContentThreshold: process.env.AI_SAFETY_DANGEROUS || 'BLOCK_MEDIUM_AND_ABOVE',
  },

  // Confidence scoring configuration
  confidence: {
    valuation: {
      base: parseFloat(process.env.AI_CONFIDENCE_VALUATION_BASE || '0.70'),
      maxScore: parseFloat(process.env.AI_CONFIDENCE_VALUATION_MAX || '0.98'),
      comparablesBonus3: parseFloat(process.env.AI_CONFIDENCE_COMPS_3 || '0.10'),
      comparablesBonus5: parseFloat(process.env.AI_CONFIDENCE_COMPS_5 || '0.05'),
      marketDataBonus: parseFloat(process.env.AI_CONFIDENCE_MARKET || '0.10'),
      yearBuiltBonus: parseFloat(process.env.AI_CONFIDENCE_YEAR || '0.03'),
      occupancyBonus: parseFloat(process.env.AI_CONFIDENCE_OCCUPANCY || '0.02'),
    },
    appeal: {
      base: parseFloat(process.env.AI_CONFIDENCE_APPEAL_BASE || '0.60'),
      maxScore: parseFloat(process.env.AI_CONFIDENCE_APPEAL_MAX || '0.95'),
      groundsBonus: parseFloat(process.env.AI_CONFIDENCE_GROUNDS || '0.10'),
      evidenceBonus: parseFloat(process.env.AI_CONFIDENCE_EVIDENCE || '0.10'),
      comparablesBonus: parseFloat(process.env.AI_CONFIDENCE_APPEAL_COMPS || '0.10'),
      precedentsBonus: parseFloat(process.env.AI_CONFIDENCE_PRECEDENTS || '0.05'),
      lowReductionBonus: parseFloat(process.env.AI_CONFIDENCE_LOW_REDUCTION || '0.05'),
    },
    vision: {
      base: parseFloat(process.env.AI_CONFIDENCE_VISION_BASE || '0.75'),
      maxScore: parseFloat(process.env.AI_CONFIDENCE_VISION_MAX || '0.95'),
    },
    document: {
      base: parseFloat(process.env.AI_CONFIDENCE_DOCUMENT_BASE || '0.85'),
      maxScore: parseFloat(process.env.AI_CONFIDENCE_DOCUMENT_MAX || '0.99'),
    },
  },

  // Rate limiting
  rateLimits: {
    ai: {
      windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
      maxRequests: parseInt(process.env.AI_RATE_LIMIT_MAX || '30', 10),
    },
    vision: {
      windowMs: parseInt(process.env.VISION_RATE_LIMIT_WINDOW || '900000', 10),
      maxRequests: parseInt(process.env.VISION_RATE_LIMIT_MAX || '50', 10),
    },
    document: {
      windowMs: parseInt(process.env.DOCUMENT_RATE_LIMIT_WINDOW || '900000', 10),
      maxRequests: parseInt(process.env.DOCUMENT_RATE_LIMIT_MAX || '100', 10),
    },
  },

  // Caching
  cache: {
    secretTTL: parseInt(process.env.SECRET_CACHE_TTL || '300000', 10), // 5 minutes
    responseTTL: parseInt(process.env.AI_RESPONSE_CACHE_TTL || '3600000', 10), // 1 hour
    embeddingTTL: parseInt(process.env.EMBEDDING_CACHE_TTL || '86400000', 10), // 24 hours
  },

  // Document AI
  documentAI: {
    location: process.env.DOCUMENT_AI_LOCATION || 'us',
    ocrProcessorId: process.env.DOCUMENT_AI_OCR_PROCESSOR,
    formProcessorId: process.env.DOCUMENT_AI_FORM_PROCESSOR,
    invoiceProcessorId: process.env.DOCUMENT_AI_INVOICE_PROCESSOR,
    customProcessorId: process.env.DOCUMENT_AI_CUSTOM_PROCESSOR,
  },

  // Vision AI
  visionAI: {
    maxImageSize: parseInt(process.env.VISION_MAX_IMAGE_SIZE || '20971520', 10), // 20MB
    supportedFormats: (process.env.VISION_SUPPORTED_FORMATS || 'jpg,jpeg,png,gif,webp,heic').split(','),
    batchSize: parseInt(process.env.VISION_BATCH_SIZE || '10', 10),
  },

  // Vertex AI ML
  vertexML: {
    valuationEndpointId: process.env.VERTEX_VALUATION_ENDPOINT_ID,
    riskEndpointId: process.env.VERTEX_RISK_ENDPOINT_ID,
    forecastEndpointId: process.env.VERTEX_FORECAST_ENDPOINT_ID,
    vectorSearchIndexId: process.env.VERTEX_VECTOR_SEARCH_INDEX_ID,
  },

  // Feature flags
  features: {
    enableAIChat: process.env.FEATURE_ENABLE_AI_CHAT !== 'false',
    enableDocumentAI: process.env.FEATURE_ENABLE_DOCUMENT_AI !== 'false',
    enableVisionAI: process.env.FEATURE_ENABLE_VISION_AI !== 'false',
    enableMLPredictions: process.env.FEATURE_ENABLE_ML_PREDICTIONS !== 'false',
    enableVectorSearch: process.env.FEATURE_ENABLE_VECTOR_SEARCH !== 'false',
    enableStreamingResponses: process.env.FEATURE_ENABLE_STREAMING !== 'false',
    enableMultiModal: process.env.FEATURE_ENABLE_MULTIMODAL !== 'false',
  },

  // Timeouts
  timeouts: {
    generation: parseInt(process.env.AI_TIMEOUT_GENERATION || '60000', 10), // 60s
    embedding: parseInt(process.env.AI_TIMEOUT_EMBEDDING || '30000', 10), // 30s
    vision: parseInt(process.env.AI_TIMEOUT_VISION || '45000', 10), // 45s
    document: parseInt(process.env.AI_TIMEOUT_DOCUMENT || '120000', 10), // 2min
    prediction: parseInt(process.env.AI_TIMEOUT_PREDICTION || '30000', 10), // 30s
  },

  // Retry configuration
  retry: {
    maxAttempts: parseInt(process.env.AI_RETRY_MAX_ATTEMPTS || '3', 10),
    baseDelay: parseInt(process.env.AI_RETRY_BASE_DELAY || '1000', 10),
    maxDelay: parseInt(process.env.AI_RETRY_MAX_DELAY || '10000', 10),
  },
};

// System prompts (can be overridden via environment or config service)
export const systemPrompts = {
  valuationExpert: process.env.AI_PROMPT_VALUATION || `You are an expert commercial real estate appraiser and valuation analyst.
You have extensive experience in property valuation using income, sales comparison, and cost approaches.
Provide detailed, professional analysis with specific numbers and supporting rationale.
Always cite comparable data and market evidence when available.
Format responses with clear sections and bullet points for readability.`,

  appealSpecialist: process.env.AI_PROMPT_APPEAL || `You are a property tax appeal specialist with deep expertise in assessment challenges.
You understand assessment methodologies, appeal grounds, and evidence requirements.
Provide strategic recommendations with specific action items and timelines.
Quantify potential tax savings and success probabilities when possible.`,

  marketAnalyst: process.env.AI_PROMPT_MARKET || `You are a commercial real estate market research analyst.
You specialize in market trends, cap rates, vacancy, absorption, and rent analysis.
Provide data-driven insights with specific metrics and forecasts.
Include submarket analysis and investment recommendations when relevant.`,

  propertyAnalyst: process.env.AI_PROMPT_PROPERTY || `You are a property condition and investment analyst.
You assess physical conditions, identify value-add opportunities, and quantify risks.
Provide specific cost estimates and ROI projections for improvements.
Consider both current state and potential based on market positioning.`,

  documentProcessor: process.env.AI_PROMPT_DOCUMENT || `You are a document analysis specialist for commercial real estate.
Extract key data points accurately including addresses, values, dates, and terms.
Validate extracted data against expected formats and flag anomalies.
Provide confidence scores and highlight any ambiguous or unclear information.`,

  investmentAdvisor: process.env.AI_PROMPT_INVESTMENT || `You are a commercial real estate investment advisor.
Analyze deals for risk-adjusted returns, comparing to market benchmarks.
Provide specific recommendations with supporting financial analysis.
Consider exit strategies, value-add potential, and downside scenarios.`,
};

// Validation function
export function validateAIConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required GCP configuration
  if (!process.env.GCP_PROJECT_ID) {
    errors.push('GCP_PROJECT_ID is required');
  }

  // Check for Vertex AI endpoints if ML predictions are enabled
  if (aiConfig.features.enableMLPredictions) {
    if (!aiConfig.vertexML.valuationEndpointId) {
      errors.push('VERTEX_VALUATION_ENDPOINT_ID is required when ML predictions are enabled');
    }
  }

  // Check for Document AI processors if enabled
  if (aiConfig.features.enableDocumentAI) {
    if (!aiConfig.documentAI.ocrProcessorId) {
      errors.push('DOCUMENT_AI_OCR_PROCESSOR is required when Document AI is enabled');
    }
  }

  // Validate numeric ranges
  if (aiConfig.gemini.temperature < 0 || aiConfig.gemini.temperature > 2) {
    errors.push('GEMINI_TEMPERATURE must be between 0 and 2');
  }

  if (aiConfig.gemini.topP < 0 || aiConfig.gemini.topP > 1) {
    errors.push('GEMINI_TOP_P must be between 0 and 1');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default aiConfig;
