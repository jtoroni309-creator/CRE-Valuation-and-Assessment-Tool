/**
 * API Configuration
 *
 * Production-ready configuration for API endpoints.
 * All values are externalized to environment variables.
 */

export const apiConfig = {
  // Base URLs
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  aiServiceUrl: process.env.NEXT_PUBLIC_AI_SERVICE_URL || '/api/v1/ai',
  visionServiceUrl: process.env.NEXT_PUBLIC_VISION_SERVICE_URL || '/api/v1/vision',
  documentServiceUrl: process.env.NEXT_PUBLIC_DOCUMENT_SERVICE_URL || '/api/v1/documents',

  // Timeouts
  defaultTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  aiTimeout: parseInt(process.env.NEXT_PUBLIC_AI_TIMEOUT || '60000', 10),
  uploadTimeout: parseInt(process.env.NEXT_PUBLIC_UPLOAD_TIMEOUT || '120000', 10),

  // Retry configuration
  maxRetries: parseInt(process.env.NEXT_PUBLIC_API_MAX_RETRIES || '3', 10),
  retryDelay: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || '1000', 10),

  // Feature flags
  enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
  enableDebugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
};

export default apiConfig;
