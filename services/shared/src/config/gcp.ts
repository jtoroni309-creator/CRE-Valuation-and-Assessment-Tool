/**
 * Google Cloud Platform Configuration Module
 *
 * This module handles all GCP-related configuration, including:
 * - Secret Manager integration for secure credential retrieval
 * - Environment-aware configuration loading
 * - Service URLs and connection strings
 * - Feature flag management
 */

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { logger } from '../utils/logger';

// Initialize Secret Manager client
let secretManagerClient: SecretManagerServiceClient | null = null;

// Cache for secrets to avoid repeated API calls
const secretCache = new Map<string, { value: string; expiry: number }>();
const SECRET_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Initialize Secret Manager client
 */
function initSecretManager(): SecretManagerServiceClient {
  if (!secretManagerClient) {
    secretManagerClient = new SecretManagerServiceClient();
    logger.info('Secret Manager client initialized');
  }
  return secretManagerClient;
}

/**
 * Retrieve a secret from Google Secret Manager with caching
 */
export async function getSecret(secretName: string): Promise<string> {
  // Check cache first
  const cached = secretCache.get(secretName);
  if (cached && cached.expiry > Date.now()) {
    return cached.value;
  }

  // Check if it's a full resource name or just a secret ID
  const isFullName = secretName.startsWith('projects/');
  const projectId = process.env.GCP_PROJECT_ID;

  if (!isFullName && !projectId) {
    logger.warn({ secretName }, 'GCP_PROJECT_ID not set - cannot retrieve secret');
    return '';
  }

  const name = isFullName
    ? secretName
    : `projects/${projectId}/secrets/${secretName}/versions/latest`;

  try {
    const client = initSecretManager();
    const [version] = await client.accessSecretVersion({ name });
    const value = version.payload?.data?.toString() || '';

    // Cache the secret
    secretCache.set(secretName, {
      value,
      expiry: Date.now() + SECRET_CACHE_TTL,
    });

    logger.debug({ secretName }, 'Secret retrieved from Secret Manager');
    return value;
  } catch (err) {
    logger.error({ err, secretName }, 'Failed to retrieve secret');
    return '';
  }
}

/**
 * Get environment variable or secret
 * Supports _SECRET suffix convention for Secret Manager references
 */
export async function getConfigValue(key: string): Promise<string> {
  // First check for direct environment variable
  const directValue = process.env[key];
  if (directValue) {
    return directValue;
  }

  // Check for _SECRET suffix version
  const secretRef = process.env[`${key}_SECRET`];
  if (secretRef) {
    return getSecret(secretRef);
  }

  return '';
}

/**
 * GCP Configuration interface
 */
export interface GCPConfig {
  projectId: string;
  region: string;
  zone: string;

  // Vertex AI
  geminiModel: string;
  geminiVisionModel: string;
  geminiMaxTokens: number;
  geminiTemperature: number;
  embeddingModel: string;
  valuationEndpointId: string;
  vectorSearchIndexId: string;

  // Document AI
  documentAiLocation: string;
  ocrProcessorId: string;
  formProcessorId: string;

  // Cloud SQL
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    poolMin: number;
    poolMax: number;
    idleTimeout: number;
    connectionTimeout: number;
  };

  // Redis
  redis: {
    host: string;
    port: number;
    password: string;
    tlsEnabled: boolean;
  };

  // Storage
  storage: {
    dataLakeBucket: string;
    reportsBucket: string;
    mlModelsBucket: string;
    uploadsBucket: string;
  };

  // Authentication
  auth: {
    firebaseProjectId: string;
    firebaseApiKey: string;
    firebaseAuthDomain: string;
    googleClientId: string;
    googleClientSecret: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
  };

  // Maps
  maps: {
    apiKey: string;
    enable3d: boolean;
    enableStreetView: boolean;
    enableHeatmap: boolean;
  };

  // Feature Flags
  features: {
    enableAiChat: boolean;
    enableAppeals: boolean;
    enableMassAssessment: boolean;
    enablePortfolio: boolean;
    enable3dMaps: boolean;
    enableDocumentAi: boolean;
    enableVisionAi: boolean;
    enableMlPredictions: boolean;
  };

  // Services
  services: {
    apiGateway: string;
    valuation: string;
    comps: string;
    assessment: string;
    appeals: string;
    reporting: string;
    ai: string;
    dataIngestion: string;
    computerVision: string;
    geospatial: string;
    portfolio: string;
  };

  // Observability
  observability: {
    enableTrace: boolean;
    enableProfiler: boolean;
    enableErrorReporting: boolean;
    traceSampleRate: number;
  };
}

/**
 * Load complete GCP configuration
 */
export async function loadGCPConfig(): Promise<GCPConfig> {
  const [
    dbPassword,
    redisPassword,
    jwtSecret,
    googleClientSecret,
    mapsApiKey,
  ] = await Promise.all([
    getConfigValue('DATABASE_PASSWORD'),
    getConfigValue('REDIS_PASSWORD'),
    getConfigValue('JWT_SECRET'),
    getConfigValue('GOOGLE_CLIENT_SECRET'),
    getConfigValue('GOOGLE_MAPS_API_KEY'),
  ]);

  return {
    projectId: process.env.GCP_PROJECT_ID || '',
    region: process.env.GCP_REGION || 'us-central1',
    zone: process.env.GCP_ZONE || 'us-central1-a',

    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
    geminiVisionModel: process.env.GEMINI_VISION_MODEL || 'gemini-1.5-pro-vision',
    geminiMaxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '8192'),
    geminiTemperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
    embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-004',
    valuationEndpointId: process.env.VALUATION_ML_ENDPOINT_ID || '',
    vectorSearchIndexId: process.env.VECTOR_SEARCH_INDEX_ID || '',

    documentAiLocation: process.env.DOCUMENT_AI_LOCATION || 'us',
    ocrProcessorId: process.env.DOCUMENT_AI_OCR_PROCESSOR || '',
    formProcessorId: process.env.DOCUMENT_AI_FORM_PROCESSOR || '',

    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      name: process.env.DATABASE_NAME || 'axxiom',
      user: process.env.DATABASE_USER || 'axxiom_app',
      password: dbPassword,
      poolMin: parseInt(process.env.DATABASE_POOL_MIN || '5'),
      poolMax: parseInt(process.env.DATABASE_POOL_MAX || '20'),
      idleTimeout: parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000'),
      connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '10000'),
    },

    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: redisPassword,
      tlsEnabled: process.env.REDIS_TLS_ENABLED === 'true',
    },

    storage: {
      dataLakeBucket: process.env.GCS_DATA_LAKE_BUCKET || '',
      reportsBucket: process.env.GCS_REPORTS_BUCKET || '',
      mlModelsBucket: process.env.GCS_ML_MODELS_BUCKET || '',
      uploadsBucket: process.env.GCS_UPLOADS_BUCKET || '',
    },

    auth: {
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
      firebaseApiKey: process.env.FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      googleClientSecret: googleClientSecret,
      jwtSecret: jwtSecret,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
      jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    maps: {
      apiKey: mapsApiKey,
      enable3d: process.env.MAPS_ENABLE_3D !== 'false',
      enableStreetView: process.env.MAPS_ENABLE_STREET_VIEW !== 'false',
      enableHeatmap: process.env.MAPS_ENABLE_HEATMAP !== 'false',
    },

    features: {
      enableAiChat: process.env.FEATURE_ENABLE_AI_CHAT !== 'false',
      enableAppeals: process.env.FEATURE_ENABLE_APPEALS !== 'false',
      enableMassAssessment: process.env.FEATURE_ENABLE_MASS_ASSESSMENT !== 'false',
      enablePortfolio: process.env.FEATURE_ENABLE_PORTFOLIO !== 'false',
      enable3dMaps: process.env.FEATURE_ENABLE_3D_MAPS !== 'false',
      enableDocumentAi: process.env.FEATURE_ENABLE_DOCUMENT_AI !== 'false',
      enableVisionAi: process.env.FEATURE_ENABLE_VISION_AI !== 'false',
      enableMlPredictions: process.env.FEATURE_ENABLE_ML_PREDICTIONS !== 'false',
    },

    services: {
      apiGateway: process.env.API_GATEWAY_URL || 'http://localhost:3000',
      valuation: process.env.VALUATION_SERVICE_URL || 'http://localhost:3001',
      comps: process.env.COMPS_SERVICE_URL || 'http://localhost:3002',
      assessment: process.env.ASSESSMENT_SERVICE_URL || 'http://localhost:3003',
      appeals: process.env.APPEALS_SERVICE_URL || 'http://localhost:3004',
      reporting: process.env.REPORTING_SERVICE_URL || 'http://localhost:3005',
      ai: process.env.AI_SERVICE_URL || 'http://localhost:3006',
      dataIngestion: process.env.DATA_INGESTION_SERVICE_URL || 'http://localhost:3007',
      computerVision: process.env.COMPUTER_VISION_SERVICE_URL || 'http://localhost:3008',
      geospatial: process.env.GEOSPATIAL_SERVICE_URL || 'http://localhost:3009',
      portfolio: process.env.PORTFOLIO_SERVICE_URL || 'http://localhost:3010',
    },

    observability: {
      enableTrace: process.env.ENABLE_CLOUD_TRACE === 'true',
      enableProfiler: process.env.ENABLE_CLOUD_PROFILER === 'true',
      enableErrorReporting: process.env.ENABLE_ERROR_REPORTING === 'true',
      traceSampleRate: parseFloat(process.env.CLOUD_TRACE_SAMPLE_RATE || '0.1'),
    },
  };
}

/**
 * Validate required configuration
 */
export function validateConfig(config: GCPConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.projectId) {
    errors.push('GCP_PROJECT_ID is required');
  }

  if (!config.database.host) {
    errors.push('DATABASE_HOST is required');
  }

  if (!config.database.password && process.env.NODE_ENV === 'production') {
    errors.push('DATABASE_PASSWORD is required in production');
  }

  if (!config.auth.jwtSecret && process.env.NODE_ENV === 'production') {
    errors.push('JWT_SECRET is required in production');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Cloud Run environment detection
 */
export function isCloudRun(): boolean {
  return !!process.env.K_SERVICE;
}

/**
 * Get Cloud Run service metadata
 */
export function getCloudRunMetadata(): {
  service: string;
  revision: string;
  configuration: string;
} | null {
  if (!isCloudRun()) return null;

  return {
    service: process.env.K_SERVICE || '',
    revision: process.env.K_REVISION || '',
    configuration: process.env.K_CONFIGURATION || '',
  };
}

// Export singleton instance for easy access
let configInstance: GCPConfig | null = null;

export async function getConfig(): Promise<GCPConfig> {
  if (!configInstance) {
    configInstance = await loadGCPConfig();
    const validation = validateConfig(configInstance);
    if (!validation.valid) {
      logger.error({ errors: validation.errors }, 'Configuration validation failed');
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
      }
    }
  }
  return configInstance;
}

export default {
  getSecret,
  getConfigValue,
  loadGCPConfig,
  validateConfig,
  isCloudRun,
  getCloudRunMetadata,
  getConfig,
};
