/**
 * Google Cloud Monitoring and Observability Service
 * Comprehensive monitoring, error reporting, and tracing
 */

import { Monitoring } from '@google-cloud/monitoring';
import { ErrorReporting } from '@google-cloud/error-reporting';
import { Logging } from '@google-cloud/logging';

export interface MetricConfig {
  projectId: string;
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
}

export interface CustomMetric {
  name: string;
  type: 'gauge' | 'counter' | 'histogram';
  description: string;
  unit: string;
  labels?: Record<string, string>;
}

export interface LogEntry {
  severity: 'DEBUG' | 'INFO' | 'NOTICE' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'ALERT' | 'EMERGENCY';
  message: string;
  metadata?: Record<string, any>;
  labels?: Record<string, string>;
}

/**
 * Cloud Monitoring Service
 */
export class CloudMonitoringService {
  private monitoringClient: Monitoring.MetricServiceClient | null = null;
  private errorReporting: ErrorReporting | null = null;
  private logging: Logging | null = null;
  private log: any = null;
  private config: MetricConfig;
  private isConfigured: boolean = false;

  constructor(config: MetricConfig) {
    this.config = config;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      if (!this.config.projectId) {
        console.warn('Cloud Monitoring: Project ID not configured. Using mock mode.');
        return;
      }

      // Initialize Cloud Monitoring
      this.monitoringClient = new Monitoring.MetricServiceClient();

      // Initialize Error Reporting
      this.errorReporting = new ErrorReporting({
        projectId: this.config.projectId,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        reportMode: process.env.NODE_ENV === 'production' ? 'production' : 'always',
        serviceContext: {
          service: this.config.serviceName,
          version: this.config.serviceVersion || '1.0.0',
        },
      });

      // Initialize Cloud Logging
      this.logging = new Logging({ projectId: this.config.projectId });
      this.log = this.logging.log(this.config.serviceName);

      this.isConfigured = true;
      console.log('Cloud Monitoring: Initialized successfully');
    } catch (error) {
      console.warn('Cloud Monitoring: Failed to initialize:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Write a log entry
   */
  async writeLog(entry: LogEntry): Promise<void> {
    if (!this.isConfigured || !this.log) {
      console.log(`[${entry.severity}] ${entry.message}`, entry.metadata);
      return;
    }

    try {
      const metadata = {
        severity: entry.severity,
        labels: {
          service: this.config.serviceName,
          environment: this.config.environment || 'development',
          ...entry.labels,
        },
        resource: {
          type: 'cloud_run_revision',
          labels: {
            project_id: this.config.projectId,
            service_name: this.config.serviceName,
          },
        },
      };

      const logEntry = this.log.entry(metadata, {
        message: entry.message,
        ...entry.metadata,
      });

      await this.log.write(logEntry);
    } catch (error) {
      console.error('Failed to write log:', error);
      console.log(`[${entry.severity}] ${entry.message}`, entry.metadata);
    }
  }

  /**
   * Report an error
   */
  async reportError(error: Error, context?: Record<string, any>): Promise<void> {
    // Always log to console
    console.error('Error:', error.message, context);

    if (!this.isConfigured || !this.errorReporting) {
      return;
    }

    try {
      this.errorReporting.report(error, undefined, {
        user: context?.userId,
        httpRequest: context?.httpRequest,
        serviceContext: {
          service: this.config.serviceName,
          version: this.config.serviceVersion || '1.0.0',
        },
      });
    } catch (reportError) {
      console.error('Failed to report error to Cloud Error Reporting:', reportError);
    }
  }

  /**
   * Create a custom metric
   */
  async createCustomMetric(metric: CustomMetric): Promise<void> {
    if (!this.isConfigured || !this.monitoringClient) {
      console.log('Would create metric:', metric.name);
      return;
    }

    const metricDescriptor = {
      type: `custom.googleapis.com/${this.config.serviceName}/${metric.name}`,
      metricKind: metric.type === 'counter' ? 'CUMULATIVE' : 'GAUGE',
      valueType: metric.type === 'histogram' ? 'DISTRIBUTION' : 'DOUBLE',
      description: metric.description,
      displayName: metric.name,
      unit: metric.unit,
      labels: Object.entries(metric.labels || {}).map(([key, description]) => ({
        key,
        valueType: 'STRING',
        description,
      })),
    };

    try {
      await this.monitoringClient.createMetricDescriptor({
        name: `projects/${this.config.projectId}`,
        metricDescriptor,
      });
      console.log(`Created custom metric: ${metric.name}`);
    } catch (error: any) {
      if (error.code === 6) { // Already exists
        console.log(`Metric already exists: ${metric.name}`);
      } else {
        console.error('Failed to create metric:', error);
      }
    }
  }

  /**
   * Write a custom metric value
   */
  async writeMetric(
    metricName: string,
    value: number,
    labels?: Record<string, string>
  ): Promise<void> {
    if (!this.isConfigured || !this.monitoringClient) {
      console.log(`Metric ${metricName}: ${value}`, labels);
      return;
    }

    const now = new Date();
    const timeSeriesData = {
      name: `projects/${this.config.projectId}`,
      timeSeries: [
        {
          metric: {
            type: `custom.googleapis.com/${this.config.serviceName}/${metricName}`,
            labels: labels || {},
          },
          resource: {
            type: 'global',
            labels: {
              project_id: this.config.projectId,
            },
          },
          points: [
            {
              interval: {
                endTime: {
                  seconds: Math.floor(now.getTime() / 1000),
                },
              },
              value: {
                doubleValue: value,
              },
            },
          ],
        },
      ],
    };

    try {
      await this.monitoringClient.createTimeSeries(timeSeriesData);
    } catch (error) {
      console.error('Failed to write metric:', error);
    }
  }

  /**
   * Record API latency
   */
  async recordLatency(
    endpoint: string,
    method: string,
    latencyMs: number,
    statusCode: number
  ): Promise<void> {
    await this.writeMetric('api_latency', latencyMs, {
      endpoint,
      method,
      status_code: String(statusCode),
    });

    // Also log for debugging
    await this.writeLog({
      severity: latencyMs > 1000 ? 'WARNING' : 'INFO',
      message: `API Request: ${method} ${endpoint}`,
      metadata: {
        latencyMs,
        statusCode,
      },
    });
  }

  /**
   * Record AI model usage
   */
  async recordAIUsage(
    model: string,
    operation: string,
    tokensUsed: number,
    latencyMs: number
  ): Promise<void> {
    await Promise.all([
      this.writeMetric('ai_tokens_used', tokensUsed, { model, operation }),
      this.writeMetric('ai_latency', latencyMs, { model, operation }),
    ]);

    await this.writeLog({
      severity: 'INFO',
      message: `AI Operation: ${operation} with ${model}`,
      metadata: {
        model,
        operation,
        tokensUsed,
        latencyMs,
      },
    });
  }

  /**
   * Record valuation event
   */
  async recordValuationEvent(
    propertyId: string,
    approach: string,
    confidence: number,
    latencyMs: number
  ): Promise<void> {
    await Promise.all([
      this.writeMetric('valuation_confidence', confidence, { approach }),
      this.writeMetric('valuation_latency', latencyMs, { approach }),
      this.writeMetric('valuations_total', 1, { approach }),
    ]);

    await this.writeLog({
      severity: 'INFO',
      message: `Valuation completed for property ${propertyId}`,
      metadata: {
        propertyId,
        approach,
        confidence,
        latencyMs,
      },
    });
  }

  /**
   * Express middleware for request monitoring
   */
  middleware() {
    return async (req: any, res: any, next: any) => {
      const startTime = Date.now();
      const path = req.path;
      const method = req.method;

      // Attach monitoring context to request
      req.monitoring = {
        startTime,
        log: (entry: Partial<LogEntry>) => this.writeLog({
          severity: entry.severity || 'INFO',
          message: entry.message || '',
          metadata: entry.metadata,
          labels: {
            request_id: req.headers['x-request-id'] || 'unknown',
            ...entry.labels,
          },
        }),
        reportError: (error: Error, context?: Record<string, any>) =>
          this.reportError(error, {
            ...context,
            path,
            method,
            userId: req.user?.id,
          }),
      };

      // Capture response
      const originalEnd = res.end;
      res.end = async (...args: any[]) => {
        const latency = Date.now() - startTime;
        await this.recordLatency(path, method, latency, res.statusCode);
        originalEnd.apply(res, args);
      };

      next();
    };
  }
}

/**
 * Create Cloud Monitoring service from environment
 */
export function createCloudMonitoringFromEnv(): CloudMonitoringService {
  return new CloudMonitoringService({
    projectId: process.env.GCP_PROJECT_ID || '',
    serviceName: process.env.SERVICE_NAME || 'cre-platform',
    serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
}

/**
 * Health check response with monitoring info
 */
export function createHealthCheck(monitoring: CloudMonitoringService) {
  return async (req: any, res: any) => {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || 'unknown',
      version: process.env.SERVICE_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };

    await monitoring.writeLog({
      severity: 'DEBUG',
      message: 'Health check performed',
      metadata: healthData,
    });

    res.json(healthData);
  };
}

export default CloudMonitoringService;
