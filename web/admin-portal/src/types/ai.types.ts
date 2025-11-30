/**
 * AI Service Types
 *
 * Type definitions for all AI service requests and responses.
 */

// Common types
export interface AIResponse<T> {
  success: boolean;
  data: T;
  metadata: {
    model: string;
    tokensUsed: number;
    processingTime: number;
    confidence: number;
    requestId: string;
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface AISource {
  type: string;
  title: string;
  confidence: number;
  url?: string;
}

// Valuation Types
export interface ValuationRequest {
  propertyAddress: string;
  propertyType: string;
  size: number;
  yearBuilt?: number;
  occupancy?: number;
  noi?: number;
  additionalData?: Record<string, unknown>;
}

export interface ValuationApproach {
  name: string;
  value: number;
  confidence: number;
  weight: number;
  details: Record<string, string | number>;
}

export interface ValuationComparable {
  address: string;
  salePrice: number;
  pricePerSF: number;
  saleDate: string;
  adjustedValue: number;
  similarity: number;
  adjustments: Record<string, number>;
}

export interface ValuationResult {
  propertyAddress: string;
  propertyType: string;
  size: number;
  finalValue: number;
  valueRange: { low: number; high: number };
  confidence: number;
  approaches: ValuationApproach[];
  comparables: ValuationComparable[];
  insights: string[];
  generatedAt: string;
}

// Market Intelligence Types
export interface MarketRequest {
  metro: string;
  propertyType: string;
  submarkets?: string[];
  timeframe?: string;
}

export interface MarketMetrics {
  capRate: number;
  capRateChange: number;
  vacancy: number;
  vacancyChange: number;
  rentGrowth: number;
  absorption: string;
  inventory: string;
  underConstruction: string;
}

export interface MarketForecast {
  year: number;
  capRate: number;
  vacancy: number;
  rentGrowth: number;
  confidence: number;
}

export interface SubmarketData {
  name: string;
  vacancy: number;
  rentGrowth: number;
  rating: number;
  signal: 'buy' | 'hold' | 'sell';
}

export interface MarketSignal {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  confidence: number;
  timeframe: string;
}

export interface MarketResult {
  metro: string;
  propertyType: string;
  asOfDate: string;
  metrics: MarketMetrics;
  forecast: MarketForecast[];
  submarkets: SubmarketData[];
  signals: MarketSignal[];
  insights: string[];
}

// Document Intelligence Types
export interface DocumentUploadRequest {
  file: File;
  documentType?: string;
  extractionConfig?: Record<string, unknown>;
}

export interface ExtractedField {
  name: string;
  value: string;
  confidence: number;
  location?: { page: number; boundingBox: number[] };
}

export interface DocumentEntity {
  type: string;
  value: string;
  count: number;
}

export interface DocumentResult {
  id: string;
  fileName: string;
  fileType: string;
  documentType: string;
  status: 'processing' | 'completed' | 'error';
  extractedFields: ExtractedField[];
  summary: string;
  entities: DocumentEntity[];
  processedAt: string;
  confidence: number;
}

// Vision Analysis Types
export interface VisionRequest {
  images: File[] | string[];
  analysisType: 'condition' | 'defects' | 'features' | 'all';
  propertyType?: string;
}

export interface ComponentAnalysis {
  name: string;
  score: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  findings: string[];
}

export interface DefectDetection {
  type: string;
  severity: 'Critical' | 'Major' | 'Minor' | 'Cosmetic';
  location: string;
  estimatedCost: number;
  confidence: number;
}

export interface FeatureDetection {
  name: string;
  detected: boolean;
  quality: string;
  confidence: number;
}

export interface VisionResult {
  overall: number;
  components: ComponentAnalysis[];
  defects: DefectDetection[];
  features: FeatureDetection[];
  recommendations: string[];
  processedAt: string;
}

// Prediction Types
export interface PredictionRequest {
  propertyId?: string;
  metrics: string[];
  horizon: number; // months
  scenario?: 'base' | 'bull' | 'bear';
}

export interface PredictionDataPoint {
  month: string;
  value: number;
  low: number;
  high: number;
}

export interface PredictionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
}

export interface PredictionResult {
  metric: string;
  current: number;
  predictions: PredictionDataPoint[];
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  factors: PredictionFactor[];
}

// Investment Analysis Types
export interface InvestmentRequest {
  propertyName: string;
  propertyType: string;
  location: string;
  price: number;
  size: number;
  noi?: number;
  occupancy?: number;
  additionalData?: Record<string, unknown>;
}

export interface InvestmentReturns {
  irr: number;
  equityMultiple: number;
  cashOnCash: number;
  capRate: number;
}

export interface InvestmentRisk {
  name: string;
  level: 'Low' | 'Medium' | 'High';
  impact: string;
  mitigation: string;
}

export interface InvestmentOpportunity {
  name: string;
  potential: string;
  probability: number;
}

export interface MarketComparison {
  metric: string;
  subject: number;
  market: number;
  percentile: number;
}

export interface InvestmentResult {
  property: {
    name: string;
    type: string;
    location: string;
    price: number;
    size: number;
  };
  score: number;
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Sell' | 'Strong Sell';
  returns: InvestmentReturns;
  risks: InvestmentRisk[];
  opportunities: InvestmentOpportunity[];
  comparisons: MarketComparison[];
  aiInsights: string[];
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: AISource[];
  suggestedActions?: string[];
  metadata?: {
    model: string;
    tokensUsed: number;
    responseTime: number;
    confidence: number;
  };
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    propertyId?: string;
    documentIds?: string[];
    marketData?: boolean;
  };
  model?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  conversationId: string;
  suggestedFollowUps: string[];
}
