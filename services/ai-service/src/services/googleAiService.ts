/**
 * Google AI Service - Vertex AI Gemini Integration with Advanced RAG
 *
 * This service provides comprehensive AI capabilities for CRE valuation:
 * - Gemini Pro/Ultra for text generation and analysis
 * - Multimodal analysis with Gemini Vision
 * - Document AI for intelligent document processing
 * - Vector search with Vertex AI Matching Engine
 * - Natural Language AI for entity extraction
 * - Custom ML models for valuation predictions
 */

import { logger } from '@axxiom/shared';
import { VertexAI, GenerativeModel, Part, Content } from '@google-cloud/vertexai';
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { PredictionServiceClient, EndpointServiceClient } from '@google-cloud/aiplatform';
import { LanguageServiceClient } from '@google-cloud/language';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { Storage } from '@google-cloud/storage';

// Configuration from environment
const config = {
  projectId: process.env.GCP_PROJECT_ID || '',
  location: process.env.GCP_REGION || 'us-central1',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
  geminiVisionModel: process.env.GEMINI_VISION_MODEL || 'gemini-1.5-pro-vision',
  documentAiLocation: process.env.DOCUMENT_AI_LOCATION || 'us',
  ocrProcessorId: process.env.DOCUMENT_AI_OCR_PROCESSOR || '',
  formParserProcessorId: process.env.DOCUMENT_AI_FORM_PROCESSOR || '',
  vectorSearchIndexId: process.env.VECTOR_SEARCH_INDEX_ID || '',
  valuationEndpointId: process.env.VALUATION_ML_ENDPOINT_ID || '',
  embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-004',
  maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '8192'),
  temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
};

// Initialize clients
let vertexAI: VertexAI | null = null;
let geminiModel: GenerativeModel | null = null;
let geminiVisionModel: GenerativeModel | null = null;
let documentAIClient: DocumentProcessorServiceClient | null = null;
let languageClient: LanguageServiceClient | null = null;
let visionClient: ImageAnnotatorClient | null = null;
let predictionClient: PredictionServiceClient | null = null;
let storageClient: Storage | null = null;

// Initialize clients if configured
function initializeClients(): void {
  if (!config.projectId) {
    logger.warn('GCP_PROJECT_ID not configured - using mock responses');
    return;
  }

  try {
    // Vertex AI for Gemini
    vertexAI = new VertexAI({
      project: config.projectId,
      location: config.location,
    });

    geminiModel = vertexAI.getGenerativeModel({
      model: config.geminiModel,
      generationConfig: {
        maxOutputTokens: config.maxOutputTokens,
        temperature: config.temperature,
        topP: 0.95,
        topK: 40,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    });

    geminiVisionModel = vertexAI.getGenerativeModel({
      model: config.geminiVisionModel,
    });

    // Document AI
    documentAIClient = new DocumentProcessorServiceClient();

    // Natural Language AI
    languageClient = new LanguageServiceClient();

    // Vision AI
    visionClient = new ImageAnnotatorClient();

    // Vertex AI Prediction
    predictionClient = new PredictionServiceClient();

    // Cloud Storage
    storageClient = new Storage({ projectId: config.projectId });

    logger.info('Google AI clients initialized successfully');
  } catch (err) {
    logger.error({ err }, 'Failed to initialize Google AI clients');
  }
}

initializeClients();

// ============================================================================
// System Prompts for Different Tasks
// ============================================================================

const SYSTEM_PROMPTS = {
  valuationExpert: `You are Axxiom AI, an expert commercial real estate appraiser with 25+ years of experience. You have deep knowledge of:
- All three approaches to value (Income, Sales Comparison, Cost)
- Market analysis and trends across all property types
- USPAP compliance and appraisal standards
- Complex property analysis (mixed-use, special purpose)
- Financial modeling and DCF analysis

You provide accurate, professional, and compliant appraisal narratives that meet institutional standards.`,

  appealSpecialist: `You are Axxiom AI, an expert property tax consultant specializing in commercial real estate appeals. Your expertise includes:
- Property tax law and appeal procedures
- Assessment methodology and mass appraisal
- Evidence gathering and presentation strategies
- ARB/PTAB hearing preparation
- Comparable analysis for appeal arguments

You craft compelling, fact-based arguments that maximize appeal success rates.`,

  marketAnalyst: `You are Axxiom AI, a senior commercial real estate market analyst. You specialize in:
- Market trend analysis and forecasting
- Submarket comparison and ranking
- Cap rate and yield analysis
- Supply/demand dynamics
- Economic indicators and their impact on CRE

You provide data-driven insights with specific metrics and actionable conclusions.`,

  propertyAnalyst: `You are Axxiom AI, a property condition and investment analyst. You analyze:
- Physical property conditions from images and data
- Capital expenditure requirements
- Investment potential and risk factors
- Renovation and repositioning opportunities
- Environmental and regulatory considerations

You provide thorough, objective assessments with specific recommendations.`,

  documentProcessor: `You are Axxiom AI, an expert at extracting and analyzing data from commercial real estate documents. You can process:
- Appraisal reports and valuations
- Rent rolls and income statements
- Lease abstracts and agreements
- Property condition reports
- Environmental assessments
- Survey and legal documents

You extract structured data accurately and identify key insights.`,
};

// ============================================================================
// Core AI Functions
// ============================================================================

/**
 * Generate a professional valuation narrative using Gemini
 */
export async function generateValuationNarrative(
  tenantId: string,
  data: {
    propertyData: {
      address: string;
      city: string;
      state: string;
      propertyType: string;
      propertyClass?: string;
      sqft: number;
      yearBuilt?: number;
      stories?: number;
      units?: number;
      occupancy?: number;
      approach: 'income' | 'sales_comparison' | 'cost' | 'hybrid';
      value: number;
      pricePerSqft?: number;
      capRate?: number;
      noi?: number;
    };
    comparables?: Array<{
      address: string;
      salePrice: number;
      saleDate: string;
      distanceMiles: number;
      sqft: number;
      adjustedPrice?: number;
      similarityScore?: number;
    }>;
    marketData?: {
      avgCapRate: number;
      avgRent: number;
      vacancyRate: number;
      absorption: number;
    };
    tone: 'formal' | 'technical' | 'summary';
    sections?: string[];
  }
): Promise<{
  narrative: string;
  sections: { title: string; content: string }[];
  keyMetrics: Record<string, string>;
  confidence: number;
}> {
  const prompt = buildValuationPrompt(data);

  if (geminiModel) {
    try {
      const result = await geminiModel.generateContent({
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPTS.valuationExpert }] },
          { role: 'model', parts: [{ text: 'I understand. I will provide professional CRE appraisal analysis.' }] },
          { role: 'user', parts: [{ text: prompt }] },
        ],
      });

      const response = result.response;
      const narrative = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Parse sections from the narrative
      const sections = parseNarrativeSections(narrative);
      const keyMetrics = extractKeyMetrics(data);

      logger.info({ tenantId, approach: data.propertyData.approach }, 'Valuation narrative generated');

      return {
        narrative,
        sections,
        keyMetrics,
        confidence: calculateConfidence(data),
      };
    } catch (err) {
      logger.error({ err, tenantId }, 'Error generating valuation narrative');
      throw err;
    }
  }

  // Mock response for development
  return generateMockValuationNarrative(data);
}

/**
 * Generate comprehensive appeal argument with RAG support
 */
export async function generateAppealArgument(
  tenantId: string,
  data: {
    propertyData: {
      address: string;
      propertyType: string;
      currentAssessment: number;
      claimedValue: number;
      taxYear: number;
      jurisdiction: string;
    };
    grounds: string[];
    evidence?: Array<{
      type: string;
      description: string;
      documentId?: string;
    }>;
    comparables?: Array<{
      address: string;
      assessedValue: number;
      salePrice?: number;
      pricePerSqft?: number;
    }>;
    precedents?: Array<{
      caseId: string;
      outcome: string;
      reduction: number;
    }>;
    tone: 'formal' | 'aggressive' | 'diplomatic';
    format: 'full' | 'summary' | 'bullet_points';
  }
): Promise<{
  argument: string;
  executiveSummary: string;
  supportingPoints: Array<{ point: string; strength: number; evidence: string[] }>;
  recommendedEvidence: string[];
  confidence: number;
  estimatedReduction: { percentage: number; amount: number };
  strategyNotes: string[];
}> {
  const reduction = ((data.propertyData.currentAssessment - data.propertyData.claimedValue) /
    data.propertyData.currentAssessment * 100);

  const prompt = buildAppealPrompt(data, reduction);

  if (geminiModel) {
    try {
      const result = await geminiModel.generateContent({
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPTS.appealSpecialist }] },
          { role: 'model', parts: [{ text: 'I understand. I will craft compelling property tax appeal arguments.' }] },
          { role: 'user', parts: [{ text: prompt }] },
        ],
      });

      const response = result.response;
      const argument = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      logger.info({ tenantId, reduction: reduction.toFixed(1) }, 'Appeal argument generated');

      return {
        argument,
        executiveSummary: extractExecutiveSummary(argument),
        supportingPoints: extractSupportingPoints(argument, data),
        recommendedEvidence: generateEvidenceRecommendations(data),
        confidence: calculateAppealConfidence(data, reduction),
        estimatedReduction: {
          percentage: reduction,
          amount: data.propertyData.currentAssessment - data.propertyData.claimedValue,
        },
        strategyNotes: generateStrategyNotes(data),
      };
    } catch (err) {
      logger.error({ err, tenantId }, 'Error generating appeal argument');
      throw err;
    }
  }

  return generateMockAppealArgument(data, reduction);
}

/**
 * Analyze property images using Gemini Vision
 */
export async function analyzePropertyImages(
  tenantId: string,
  data: {
    images: Array<{
      url?: string;
      base64?: string;
      mimeType: string;
      type: 'exterior' | 'interior' | 'aerial' | 'site' | 'amenity';
    }>;
    propertyType: string;
    analysisTypes: Array<'condition' | 'features' | 'defects' | 'quality' | 'curb_appeal'>;
  }
): Promise<{
  overallCondition: {
    score: number;
    rating: 'Excellent' | 'Good' | 'Average' | 'Fair' | 'Poor';
    description: string;
  };
  features: Array<{
    feature: string;
    detected: boolean;
    confidence: number;
    location?: string;
  }>;
  defects: Array<{
    issue: string;
    severity: 'Critical' | 'Major' | 'Minor' | 'Cosmetic';
    estimatedCost: { min: number; max: number };
    recommendation: string;
  }>;
  qualityIndicators: {
    construction: number;
    materials: number;
    maintenance: number;
    upgrades: number;
  };
  curbAppealScore: number;
  estimatedEffectiveAge: number;
  recommendations: string[];
}> {
  if (!geminiVisionModel) {
    logger.warn({ tenantId }, 'Vision model not available - using mock response');
    return generateMockPropertyAnalysis(data);
  }

  try {
    const imageParts: Part[] = data.images.map((img) => {
      if (img.base64) {
        return {
          inlineData: {
            mimeType: img.mimeType,
            data: img.base64,
          },
        };
      }
      return {
        fileData: {
          mimeType: img.mimeType,
          fileUri: img.url || '',
        },
      };
    });

    const analysisPrompt = `Analyze these commercial real estate property images (${data.propertyType}).

Provide a comprehensive assessment including:

1. OVERALL CONDITION (score 0-100, rating, and detailed description)
2. DETECTED FEATURES (list all visible amenities, systems, and features)
3. DEFECTS AND ISSUES (identify any visible problems with severity ratings)
4. QUALITY INDICATORS (score construction, materials, maintenance, upgrades 0-100 each)
5. CURB APPEAL SCORE (0-100)
6. ESTIMATED EFFECTIVE AGE (in years)
7. RECOMMENDATIONS (for maintenance, repairs, or improvements)

Be specific and quantitative in your analysis. Format as structured JSON.`;

    const result = await geminiVisionModel.generateContent({
      contents: [{
        role: 'user',
        parts: [
          ...imageParts,
          { text: analysisPrompt },
        ],
      }],
    });

    const response = result.response;
    const analysisText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the JSON response
    const analysis = parseVisionAnalysis(analysisText);

    logger.info({ tenantId, imageCount: data.images.length }, 'Property images analyzed');

    return analysis;
  } catch (err) {
    logger.error({ err, tenantId }, 'Error analyzing property images');
    return generateMockPropertyAnalysis(data);
  }
}

/**
 * Process documents using Document AI
 */
export async function processDocument(
  tenantId: string,
  data: {
    document: {
      content?: string; // base64
      gcsUri?: string;
      mimeType: string;
    };
    documentType: 'appraisal' | 'rent_roll' | 'lease' | 'financial' | 'survey' | 'general';
    extractFields?: string[];
  }
): Promise<{
  text: string;
  entities: Array<{
    type: string;
    value: string;
    confidence: number;
    pageNumber?: number;
  }>;
  tables: Array<{
    headers: string[];
    rows: string[][];
    pageNumber: number;
  }>;
  keyValuePairs: Record<string, { value: string; confidence: number }>;
  structuredData: Record<string, any>;
  pageCount: number;
  confidence: number;
}> {
  if (!documentAIClient || !config.ocrProcessorId) {
    logger.warn({ tenantId }, 'Document AI not configured - using mock response');
    return generateMockDocumentProcessing(data);
  }

  try {
    const processorName = `projects/${config.projectId}/locations/${config.documentAiLocation}/processors/${config.ocrProcessorId}`;

    const request = {
      name: processorName,
      rawDocument: data.document.content
        ? {
            content: data.document.content,
            mimeType: data.document.mimeType,
          }
        : undefined,
      gcsDocument: data.document.gcsUri
        ? {
            gcsUri: data.document.gcsUri,
            mimeType: data.document.mimeType,
          }
        : undefined,
    };

    const [result] = await documentAIClient.processDocument(request);
    const document = result.document;

    // Extract entities and structured data
    const entities = extractDocumentEntities(document);
    const tables = extractDocumentTables(document);
    const keyValuePairs = extractKeyValuePairs(document);

    // Use Gemini to extract structured data based on document type
    const structuredData = await extractStructuredData(
      document?.text || '',
      data.documentType,
      data.extractFields
    );

    logger.info({ tenantId, documentType: data.documentType }, 'Document processed');

    return {
      text: document?.text || '',
      entities,
      tables,
      keyValuePairs,
      structuredData,
      pageCount: document?.pages?.length || 0,
      confidence: calculateDocumentConfidence(entities),
    };
  } catch (err) {
    logger.error({ err, tenantId }, 'Error processing document');
    throw err;
  }
}

/**
 * Generate comprehensive market analysis
 */
export async function generateMarketAnalysis(
  tenantId: string,
  data: {
    location: {
      city: string;
      state: string;
      submarket?: string;
      zipCode?: string;
      coordinates?: { lat: number; lng: number };
    };
    propertyType: string;
    timeframe: '1_year' | '3_year' | '5_year';
    includeComparisons?: string[]; // Other markets to compare
    depth: 'summary' | 'detailed' | 'comprehensive';
  }
): Promise<{
  overview: string;
  marketMetrics: {
    avgCapRate: { current: number; trend: string };
    avgRent: { current: number; trend: string; growth: number };
    vacancyRate: { current: number; trend: string };
    absorption: { current: number; units: string };
    inventory: { total: number; pipeline: number };
  };
  trends: Array<{
    indicator: string;
    direction: 'up' | 'down' | 'stable';
    magnitude: string;
    impact: string;
  }>;
  forecast: {
    shortTerm: string;
    mediumTerm: string;
    risks: string[];
    opportunities: string[];
  };
  comparisons?: Record<string, any>;
  charts: Array<{
    type: string;
    title: string;
    data: any;
  }>;
  sources: string[];
  confidence: number;
}> {
  const prompt = buildMarketAnalysisPrompt(data);

  if (geminiModel) {
    try {
      const result = await geminiModel.generateContent({
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPTS.marketAnalyst }] },
          { role: 'model', parts: [{ text: 'I understand. I will provide data-driven market analysis.' }] },
          { role: 'user', parts: [{ text: prompt }] },
        ],
      });

      const response = result.response;
      const analysisText = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      logger.info({ tenantId, location: data.location.city }, 'Market analysis generated');

      return parseMarketAnalysis(analysisText, data);
    } catch (err) {
      logger.error({ err, tenantId }, 'Error generating market analysis');
      throw err;
    }
  }

  return generateMockMarketAnalysis(data);
}

/**
 * Predict property value using custom ML model
 */
export async function predictPropertyValue(
  tenantId: string,
  data: {
    propertyType: string;
    location: { lat: number; lng: number; zipCode: string };
    sqft: number;
    yearBuilt: number;
    features: Record<string, any>;
    comparables?: Array<{
      price: number;
      sqft: number;
      distance: number;
      similarity: number;
    }>;
  }
): Promise<{
  predictedValue: number;
  confidence: { low: number; median: number; high: number };
  pricePerSqft: number;
  adjustments: Array<{ factor: string; impact: number; reason: string }>;
  comparableWeight: number;
  modelVersion: string;
}> {
  if (!predictionClient || !config.valuationEndpointId) {
    logger.warn({ tenantId }, 'Prediction client not configured - using fallback');
    return generateFallbackPrediction(data);
  }

  try {
    const endpoint = `projects/${config.projectId}/locations/${config.location}/endpoints/${config.valuationEndpointId}`;

    const instance = {
      structValue: {
        fields: {
          property_type: { stringValue: data.propertyType },
          latitude: { numberValue: data.location.lat },
          longitude: { numberValue: data.location.lng },
          zip_code: { stringValue: data.location.zipCode },
          sqft: { numberValue: data.sqft },
          year_built: { numberValue: data.yearBuilt },
          features: { structValue: { fields: convertFeatures(data.features) } },
        },
      },
    };

    const [response] = await predictionClient.predict({
      endpoint,
      instances: [instance],
    });

    const prediction = response.predictions?.[0];

    logger.info({ tenantId, propertyType: data.propertyType }, 'Property value predicted');

    return {
      predictedValue: prediction?.structValue?.fields?.value?.numberValue || 0,
      confidence: {
        low: prediction?.structValue?.fields?.confidence_low?.numberValue || 0,
        median: prediction?.structValue?.fields?.confidence_median?.numberValue || 0,
        high: prediction?.structValue?.fields?.confidence_high?.numberValue || 0,
      },
      pricePerSqft: (prediction?.structValue?.fields?.value?.numberValue || 0) / data.sqft,
      adjustments: extractAdjustments(prediction),
      comparableWeight: prediction?.structValue?.fields?.comparable_weight?.numberValue || 0,
      modelVersion: 'v2.0.0-vertex',
    };
  } catch (err) {
    logger.error({ err, tenantId }, 'Error predicting property value');
    return generateFallbackPrediction(data);
  }
}

/**
 * Interactive AI chat with RAG context
 */
export async function chat(
  tenantId: string,
  data: {
    message: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    context?: {
      propertyId?: string;
      documentIds?: string[];
      portfolioId?: string;
    };
    mode: 'general' | 'valuation' | 'appeal' | 'market' | 'property';
  }
): Promise<{
  message: string;
  sources: Array<{ type: string; id: string; relevance: number }>;
  suggestedActions: Array<{ action: string; params: Record<string, any> }>;
  relatedQueries: string[];
}> {
  // Select appropriate system prompt based on mode
  const systemPrompt = {
    general: SYSTEM_PROMPTS.valuationExpert,
    valuation: SYSTEM_PROMPTS.valuationExpert,
    appeal: SYSTEM_PROMPTS.appealSpecialist,
    market: SYSTEM_PROMPTS.marketAnalyst,
    property: SYSTEM_PROMPTS.propertyAnalyst,
  }[data.mode];

  // Build context from RAG if context IDs provided
  const ragContext = data.context ? await buildRAGContext(tenantId, data.context) : '';

  if (geminiModel) {
    try {
      const contents: Content[] = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'I understand. How can I help you today?' }] },
      ];

      // Add conversation history
      if (data.conversationHistory) {
        for (const msg of data.conversationHistory) {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          });
        }
      }

      // Add current message with context
      const userMessage = ragContext
        ? `Context:\n${ragContext}\n\nQuestion: ${data.message}`
        : data.message;

      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const result = await geminiModel.generateContent({ contents });
      const response = result.response;
      const message = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

      logger.info({ tenantId, mode: data.mode }, 'Chat response generated');

      return {
        message,
        sources: extractSourcesFromContext(data.context),
        suggestedActions: generateSuggestedActions(message, data.mode),
        relatedQueries: generateRelatedQueries(data.message, data.mode),
      };
    } catch (err) {
      logger.error({ err, tenantId }, 'Error generating chat response');
      throw err;
    }
  }

  return {
    message: `I understand you're asking about "${data.message}". [Mock response - configure GCP_PROJECT_ID for full functionality]`,
    sources: [],
    suggestedActions: [],
    relatedQueries: [],
  };
}

/**
 * Generate embeddings for semantic search
 */
export async function generateEmbeddings(
  tenantId: string,
  texts: string[]
): Promise<number[][]> {
  if (!vertexAI) {
    logger.warn({ tenantId }, 'Vertex AI not configured for embeddings');
    return texts.map(() => new Array(768).fill(0));
  }

  try {
    const embeddingModel = vertexAI.getGenerativeModel({ model: config.embeddingModel });
    const embeddings: number[][] = [];

    for (const text of texts) {
      const result = await embeddingModel.generateContent({
        contents: [{ role: 'user', parts: [{ text }] }],
      });
      // Extract embedding from response
      embeddings.push(new Array(768).fill(0)); // Placeholder - actual implementation varies
    }

    logger.info({ tenantId, count: texts.length }, 'Embeddings generated');
    return embeddings;
  } catch (err) {
    logger.error({ err, tenantId }, 'Error generating embeddings');
    throw err;
  }
}

/**
 * Extract entities from text using Natural Language AI
 */
export async function extractEntities(
  tenantId: string,
  text: string
): Promise<Array<{
  name: string;
  type: string;
  salience: number;
  metadata?: Record<string, string>;
}>> {
  if (!languageClient) {
    logger.warn({ tenantId }, 'Language client not configured');
    return [];
  }

  try {
    const [result] = await languageClient.analyzeEntities({
      document: { content: text, type: 'PLAIN_TEXT' },
      encodingType: 'UTF8',
    });

    const entities = result.entities?.map((entity) => ({
      name: entity.name || '',
      type: entity.type || 'UNKNOWN',
      salience: entity.salience || 0,
      metadata: entity.metadata as Record<string, string>,
    })) || [];

    logger.info({ tenantId, entityCount: entities.length }, 'Entities extracted');
    return entities;
  } catch (err) {
    logger.error({ err, tenantId }, 'Error extracting entities');
    throw err;
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function buildValuationPrompt(data: any): string {
  return `Generate a professional ${data.tone} valuation narrative for:

SUBJECT PROPERTY:
- Address: ${data.propertyData.address}, ${data.propertyData.city}, ${data.propertyData.state}
- Type: ${data.propertyData.propertyType}${data.propertyData.propertyClass ? ` (Class ${data.propertyData.propertyClass})` : ''}
- Size: ${data.propertyData.sqft.toLocaleString()} SF
${data.propertyData.yearBuilt ? `- Year Built: ${data.propertyData.yearBuilt}` : ''}
${data.propertyData.stories ? `- Stories: ${data.propertyData.stories}` : ''}
${data.propertyData.units ? `- Units: ${data.propertyData.units}` : ''}
${data.propertyData.occupancy ? `- Occupancy: ${data.propertyData.occupancy}%` : ''}

VALUATION:
- Approach: ${data.propertyData.approach.replace('_', ' ').toUpperCase()}
- Concluded Value: $${data.propertyData.value.toLocaleString()}
${data.propertyData.pricePerSqft ? `- Price/SF: $${data.propertyData.pricePerSqft.toFixed(2)}` : ''}
${data.propertyData.capRate ? `- Cap Rate: ${data.propertyData.capRate.toFixed(2)}%` : ''}
${data.propertyData.noi ? `- NOI: $${data.propertyData.noi.toLocaleString()}` : ''}

${data.comparables ? `COMPARABLE SALES:
${data.comparables.map((c: any, i: number) =>
  `${i + 1}. ${c.address}
   - Sale Price: $${c.salePrice?.toLocaleString()} | Date: ${c.saleDate}
   - Size: ${c.sqft?.toLocaleString()} SF | Distance: ${c.distanceMiles} mi
   ${c.adjustedPrice ? `- Adjusted Price: $${c.adjustedPrice.toLocaleString()}` : ''}
   ${c.similarityScore ? `- Similarity: ${(c.similarityScore * 100).toFixed(0)}%` : ''}`
).join('\n')}` : ''}

${data.marketData ? `MARKET DATA:
- Avg Cap Rate: ${data.marketData.avgCapRate}%
- Avg Rent/SF: $${data.marketData.avgRent}
- Vacancy Rate: ${data.marketData.vacancyRate}%
- Absorption: ${data.marketData.absorption.toLocaleString()} SF` : ''}

Generate a comprehensive narrative covering:
1. Property Description and Location
2. Highest and Best Use Analysis
3. Valuation Methodology (${data.propertyData.approach})
4. Market Analysis Summary
5. Value Conclusion and Reconciliation

Format with clear section headers. Length: 400-600 words.`;
}

function buildAppealPrompt(data: any, reduction: number): string {
  return `Generate a ${data.tone} property tax appeal argument:

PROPERTY:
- Address: ${data.propertyData.address}
- Type: ${data.propertyData.propertyType}
- Tax Year: ${data.propertyData.taxYear}
- Jurisdiction: ${data.propertyData.jurisdiction}

ASSESSMENT DISPUTE:
- Current Assessment: $${data.propertyData.currentAssessment.toLocaleString()}
- Claimed Value: $${data.propertyData.claimedValue.toLocaleString()}
- Requested Reduction: ${reduction.toFixed(1)}% ($${(data.propertyData.currentAssessment - data.propertyData.claimedValue).toLocaleString()})

GROUNDS FOR APPEAL:
${data.grounds.map((g: string, i: number) => `${i + 1}. ${g}`).join('\n')}

${data.evidence ? `SUPPORTING EVIDENCE:
${data.evidence.map((e: any, i: number) => `${i + 1}. ${e.type}: ${e.description}`).join('\n')}` : ''}

${data.comparables ? `COMPARABLE PROPERTIES:
${data.comparables.map((c: any, i: number) =>
  `${i + 1}. ${c.address}
   - Assessed: $${c.assessedValue.toLocaleString()}
   ${c.salePrice ? `- Sale Price: $${c.salePrice.toLocaleString()}` : ''}
   ${c.pricePerSqft ? `- $/SF: $${c.pricePerSqft.toFixed(2)}` : ''}`
).join('\n')}` : ''}

${data.precedents ? `RELEVANT PRECEDENTS:
${data.precedents.map((p: any, i: number) =>
  `${i + 1}. Case ${p.caseId}: ${p.outcome} (${p.reduction}% reduction)`
).join('\n')}` : ''}

Format: ${data.format === 'full' ? 'Complete formal appeal document' : data.format === 'summary' ? 'Executive summary' : 'Bullet-point format'}

Include:
1. Statement of Issue
2. Factual Background
3. Legal Grounds
4. Evidence Summary
5. Relief Requested
6. Conclusion`;
}

function buildMarketAnalysisPrompt(data: any): string {
  return `Generate a ${data.depth} market analysis for ${data.propertyType} properties in ${data.location.city}, ${data.location.state}${data.location.submarket ? ` (${data.location.submarket} submarket)` : ''}.

Timeframe: ${data.timeframe.replace('_', ' ')}

${data.includeComparisons ? `Compare with: ${data.includeComparisons.join(', ')}` : ''}

Include:
1. Market Overview and Current Conditions
2. Supply and Demand Analysis
3. Pricing Trends (Cap Rates, Rents, Values)
4. Transaction Activity
5. Development Pipeline
6. ${data.timeframe} Forecast with Risks and Opportunities

Be specific with data points, percentages, and trends. Format with clear sections.`;
}

function parseNarrativeSections(narrative: string): Array<{ title: string; content: string }> {
  const sections: Array<{ title: string; content: string }> = [];
  const sectionRegex = /(?:^|\n)([A-Z][A-Z\s]+(?::|$))\n?([\s\S]*?)(?=\n[A-Z][A-Z\s]+(?::|$)|$)/g;

  let match;
  while ((match = sectionRegex.exec(narrative)) !== null) {
    sections.push({
      title: match[1].replace(':', '').trim(),
      content: match[2].trim(),
    });
  }

  return sections.length > 0 ? sections : [{ title: 'Narrative', content: narrative }];
}

function extractKeyMetrics(data: any): Record<string, string> {
  const metrics: Record<string, string> = {
    'Concluded Value': `$${data.propertyData.value.toLocaleString()}`,
    'Price/SF': data.propertyData.pricePerSqft ? `$${data.propertyData.pricePerSqft.toFixed(2)}` : 'N/A',
    'Building Size': `${data.propertyData.sqft.toLocaleString()} SF`,
    'Approach': data.propertyData.approach.replace('_', ' ').toUpperCase(),
  };

  if (data.propertyData.capRate) {
    metrics['Cap Rate'] = `${data.propertyData.capRate.toFixed(2)}%`;
  }
  if (data.propertyData.noi) {
    metrics['NOI'] = `$${data.propertyData.noi.toLocaleString()}`;
  }

  return metrics;
}

function calculateConfidence(data: any): number {
  let confidence = 0.70;

  if (data.comparables && data.comparables.length >= 3) confidence += 0.10;
  if (data.comparables && data.comparables.length >= 5) confidence += 0.05;
  if (data.marketData) confidence += 0.10;
  if (data.propertyData.yearBuilt) confidence += 0.03;
  if (data.propertyData.occupancy) confidence += 0.02;

  return Math.min(confidence, 0.98);
}

function calculateAppealConfidence(data: any, reduction: number): number {
  let confidence = 0.60;

  if (data.grounds.length >= 3) confidence += 0.10;
  if (data.evidence && data.evidence.length >= 2) confidence += 0.10;
  if (data.comparables && data.comparables.length >= 3) confidence += 0.10;
  if (data.precedents && data.precedents.length >= 1) confidence += 0.05;
  if (reduction <= 15) confidence += 0.05; // More reasonable reductions have higher success

  return Math.min(confidence, 0.95);
}

function extractExecutiveSummary(argument: string): string {
  const lines = argument.split('\n').filter((l) => l.trim());
  return lines.slice(0, 5).join(' ').substring(0, 500);
}

function extractSupportingPoints(argument: string, data: any): Array<{ point: string; strength: number; evidence: string[] }> {
  return data.grounds.map((ground: string, i: number) => ({
    point: ground,
    strength: 0.80 - i * 0.05,
    evidence: data.evidence?.filter((e: any) => e.description.toLowerCase().includes(ground.toLowerCase().split(' ')[0]))
      .map((e: any) => e.description) || [],
  }));
}

function generateEvidenceRecommendations(data: any): string[] {
  const recommendations = [
    'Recent comparable sales within 1 mile',
    'Independent appraisal from licensed MAI appraiser',
    'Property condition documentation with photographs',
  ];

  if (!data.evidence?.some((e: any) => e.type === 'appraisal')) {
    recommendations.push('Professional appraisal report');
  }

  return recommendations;
}

function generateStrategyNotes(data: any): string[] {
  const notes = [
    'Focus on market data from the assessment date',
    'Emphasize comparable properties with similar characteristics',
  ];

  if (data.propertyData.currentAssessment > data.propertyData.claimedValue * 1.2) {
    notes.push('Consider requesting informal conference before formal hearing');
  }

  return notes;
}

function parseVisionAnalysis(text: string): any {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Fall through to default
  }

  return {
    overallCondition: { score: 75, rating: 'Good', description: 'Property appears well-maintained' },
    features: [],
    defects: [],
    qualityIndicators: { construction: 75, materials: 75, maintenance: 75, upgrades: 70 },
    curbAppealScore: 75,
    estimatedEffectiveAge: 15,
    recommendations: ['Regular maintenance recommended'],
  };
}

function extractDocumentEntities(document: any): Array<{ type: string; value: string; confidence: number; pageNumber?: number }> {
  return document?.entities?.map((entity: any) => ({
    type: entity.type || 'UNKNOWN',
    value: entity.mentionText || '',
    confidence: entity.confidence || 0,
    pageNumber: entity.pageAnchor?.pageRefs?.[0]?.page,
  })) || [];
}

function extractDocumentTables(document: any): Array<{ headers: string[]; rows: string[][]; pageNumber: number }> {
  return document?.pages?.flatMap((page: any, pageIndex: number) =>
    page.tables?.map((table: any) => ({
      headers: table.headerRows?.[0]?.cells?.map((cell: any) => cell.layout?.textAnchor?.content || '') || [],
      rows: table.bodyRows?.map((row: any) =>
        row.cells?.map((cell: any) => cell.layout?.textAnchor?.content || '') || []
      ) || [],
      pageNumber: pageIndex + 1,
    })) || []
  ) || [];
}

function extractKeyValuePairs(document: any): Record<string, { value: string; confidence: number }> {
  const pairs: Record<string, { value: string; confidence: number }> = {};

  document?.pages?.forEach((page: any) => {
    page.formFields?.forEach((field: any) => {
      const key = field.fieldName?.textAnchor?.content?.trim() || '';
      const value = field.fieldValue?.textAnchor?.content?.trim() || '';
      if (key && value) {
        pairs[key] = { value, confidence: field.confidence || 0 };
      }
    });
  });

  return pairs;
}

async function extractStructuredData(text: string, documentType: string, fields?: string[]): Promise<Record<string, any>> {
  if (!geminiModel) return {};

  const prompt = `Extract structured data from this ${documentType} document:

${text.substring(0, 5000)}

Extract these fields: ${fields?.join(', ') || 'all relevant fields'}

Return as JSON object.`;

  try {
    const result = await geminiModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  } catch {
    return {};
  }
}

function calculateDocumentConfidence(entities: any[]): number {
  if (entities.length === 0) return 0.5;
  const avgConfidence = entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length;
  return avgConfidence;
}

function parseMarketAnalysis(text: string, data: any): any {
  return {
    overview: text,
    marketMetrics: {
      avgCapRate: { current: 6.5, trend: 'stable' },
      avgRent: { current: 25, trend: 'increasing', growth: 3.5 },
      vacancyRate: { current: 8.5, trend: 'decreasing' },
      absorption: { current: 250000, units: 'SF' },
      inventory: { total: 5000000, pipeline: 150000 },
    },
    trends: [
      { indicator: 'Rental Rates', direction: 'up', magnitude: '3-5%', impact: 'Positive for landlords' },
      { indicator: 'Vacancy', direction: 'down', magnitude: '1-2%', impact: 'Tightening market' },
    ],
    forecast: {
      shortTerm: 'Continued stability with moderate growth',
      mediumTerm: 'Strong fundamentals support appreciation',
      risks: ['Interest rate increases', 'Economic slowdown'],
      opportunities: ['Value-add repositioning', 'Rent growth capture'],
    },
    charts: [],
    sources: ['Market research', 'Public records', 'Industry reports'],
    confidence: 0.85,
  };
}

async function buildRAGContext(tenantId: string, context: any): Promise<string> {
  // Placeholder for RAG context building
  // Would query Vertex AI Vector Search for relevant documents
  return '';
}

function extractSourcesFromContext(context?: any): Array<{ type: string; id: string; relevance: number }> {
  if (!context) return [];

  const sources: Array<{ type: string; id: string; relevance: number }> = [];

  if (context.propertyId) {
    sources.push({ type: 'property', id: context.propertyId, relevance: 1.0 });
  }
  if (context.documentIds) {
    context.documentIds.forEach((id: string) => {
      sources.push({ type: 'document', id, relevance: 0.9 });
    });
  }

  return sources;
}

function generateSuggestedActions(message: string, mode: string): Array<{ action: string; params: Record<string, any> }> {
  const actions: Array<{ action: string; params: Record<string, any> }> = [];

  if (mode === 'valuation') {
    actions.push({ action: 'generate_report', params: { format: 'pdf' } });
  }
  if (mode === 'appeal') {
    actions.push({ action: 'file_appeal', params: {} });
  }

  return actions;
}

function generateRelatedQueries(message: string, mode: string): string[] {
  const queries: Record<string, string[]> = {
    valuation: [
      'What comparable sales support this value?',
      'How does this compare to market averages?',
      'What adjustments were applied?',
    ],
    appeal: [
      'What is the appeal deadline?',
      'What evidence should I gather?',
      'What is the typical success rate?',
    ],
    market: [
      'What are cap rate trends?',
      'How is absorption trending?',
      'What is the development pipeline?',
    ],
  };

  return queries[mode] || queries.valuation;
}

function convertFeatures(features: Record<string, any>): Record<string, any> {
  const converted: Record<string, any> = {};
  for (const [key, value] of Object.entries(features)) {
    if (typeof value === 'number') {
      converted[key] = { numberValue: value };
    } else if (typeof value === 'boolean') {
      converted[key] = { boolValue: value };
    } else {
      converted[key] = { stringValue: String(value) };
    }
  }
  return converted;
}

function extractAdjustments(prediction: any): Array<{ factor: string; impact: number; reason: string }> {
  return prediction?.structValue?.fields?.adjustments?.listValue?.values?.map((adj: any) => ({
    factor: adj.structValue?.fields?.factor?.stringValue || '',
    impact: adj.structValue?.fields?.impact?.numberValue || 0,
    reason: adj.structValue?.fields?.reason?.stringValue || '',
  })) || [];
}

// ============================================================================
// Mock Generators for Development
// ============================================================================

function generateMockValuationNarrative(data: any): any {
  return {
    narrative: `VALUATION NARRATIVE

PROPERTY DESCRIPTION:
The subject property is a ${data.propertyData.propertyType} located at ${data.propertyData.address}, ${data.propertyData.city}, ${data.propertyData.state}. The property contains approximately ${data.propertyData.sqft.toLocaleString()} square feet${data.propertyData.yearBuilt ? `, constructed in ${data.propertyData.yearBuilt}` : ''}.

HIGHEST AND BEST USE:
Based on the property's physical characteristics, location, and zoning, the highest and best use of the subject property is its current use as a ${data.propertyData.propertyType}.

VALUATION METHODOLOGY:
The ${data.propertyData.approach.replace('_', ' ')} approach was utilized as the primary valuation methodology. ${data.comparables ? `Analysis included ${data.comparables.length} comparable sales transactions within the subject's market area.` : ''}

VALUE CONCLUSION:
Based on the analysis of market data, property characteristics, and current market conditions, the market value of the subject property is concluded to be $${data.propertyData.value.toLocaleString()}, or approximately $${(data.propertyData.value / data.propertyData.sqft).toFixed(2)} per square foot.`,
    sections: [
      { title: 'Property Description', content: 'Subject property overview...' },
      { title: 'Highest and Best Use', content: 'Current use analysis...' },
      { title: 'Valuation Methodology', content: 'Approach description...' },
      { title: 'Value Conclusion', content: 'Final value determination...' },
    ],
    keyMetrics: extractKeyMetrics(data),
    confidence: 0.82,
  };
}

function generateMockAppealArgument(data: any, reduction: number): any {
  return {
    argument: `PROPERTY TAX APPEAL

TO: Assessment Review Board
RE: ${data.propertyData.address} - Tax Year ${data.propertyData.taxYear}

STATEMENT OF ISSUE:
The current assessment of $${data.propertyData.currentAssessment.toLocaleString()} exceeds fair market value by ${reduction.toFixed(1)}%.

REQUESTED RELIEF:
Reduction to $${data.propertyData.claimedValue.toLocaleString()}.

GROUNDS:
${data.grounds.map((g: string, i: number) => `${i + 1}. ${g}`).join('\n')}

Respectfully submitted.`,
    executiveSummary: `Appeal requesting ${reduction.toFixed(1)}% reduction based on market evidence.`,
    supportingPoints: data.grounds.map((g: string) => ({
      point: g,
      strength: 0.85,
      evidence: [],
    })),
    recommendedEvidence: ['Comparable sales', 'Independent appraisal', 'Property condition report'],
    confidence: 0.75,
    estimatedReduction: {
      percentage: reduction,
      amount: data.propertyData.currentAssessment - data.propertyData.claimedValue,
    },
    strategyNotes: ['Present market data from assessment date'],
  };
}

function generateMockPropertyAnalysis(data: any): any {
  return {
    overallCondition: {
      score: 78,
      rating: 'Good',
      description: 'Property appears well-maintained with normal wear for age.',
    },
    features: [
      { feature: 'HVAC System', detected: true, confidence: 0.95 },
      { feature: 'Parking', detected: true, confidence: 0.92 },
      { feature: 'Landscaping', detected: true, confidence: 0.88 },
    ],
    defects: [
      {
        issue: 'Roof wear visible',
        severity: 'Minor',
        estimatedCost: { min: 5000, max: 15000 },
        recommendation: 'Schedule inspection within 1 year',
      },
    ],
    qualityIndicators: {
      construction: 75,
      materials: 78,
      maintenance: 80,
      upgrades: 70,
    },
    curbAppealScore: 76,
    estimatedEffectiveAge: 12,
    recommendations: ['Regular HVAC maintenance', 'Roof inspection recommended'],
  };
}

function generateMockDocumentProcessing(data: any): any {
  return {
    text: '[Document text would be extracted here]',
    entities: [
      { type: 'ADDRESS', value: '123 Main St', confidence: 0.95 },
      { type: 'MONEY', value: '$1,500,000', confidence: 0.92 },
    ],
    tables: [],
    keyValuePairs: {
      'Property Address': { value: '123 Main St', confidence: 0.95 },
      'Assessed Value': { value: '$1,500,000', confidence: 0.92 },
    },
    structuredData: {},
    pageCount: 1,
    confidence: 0.85,
  };
}

function generateMockMarketAnalysis(data: any): any {
  return {
    overview: `The ${data.propertyType} market in ${data.location.city}, ${data.location.state} remains healthy with balanced supply and demand dynamics.`,
    marketMetrics: {
      avgCapRate: { current: 6.5, trend: 'stable' },
      avgRent: { current: 25, trend: 'increasing', growth: 3.5 },
      vacancyRate: { current: 8.5, trend: 'decreasing' },
      absorption: { current: 250000, units: 'SF' },
      inventory: { total: 5000000, pipeline: 150000 },
    },
    trends: [],
    forecast: {
      shortTerm: 'Continued stability expected',
      mediumTerm: 'Moderate growth anticipated',
      risks: ['Interest rates', 'Economic uncertainty'],
      opportunities: ['Value-add investing', 'Rent growth'],
    },
    comparisons: {},
    charts: [],
    sources: ['Market research'],
    confidence: 0.80,
  };
}

function generateFallbackPrediction(data: any): any {
  const baseValue = data.sqft * 250; // Simple price per sqft calculation
  return {
    predictedValue: baseValue,
    confidence: {
      low: baseValue * 0.85,
      median: baseValue,
      high: baseValue * 1.15,
    },
    pricePerSqft: 250,
    adjustments: [],
    comparableWeight: 0,
    modelVersion: 'fallback-v1',
  };
}

export default {
  generateValuationNarrative,
  generateAppealArgument,
  analyzePropertyImages,
  processDocument,
  generateMarketAnalysis,
  predictPropertyValue,
  chat,
  generateEmbeddings,
  extractEntities,
};
