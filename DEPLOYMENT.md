# CRE Valuation Platform - Google Cloud Deployment Guide

## Overview

This document provides comprehensive instructions for deploying the CRE Valuation Platform to Google Cloud Platform (GCP). The platform is designed as a microservices architecture running on Cloud Run with full integration of Google AI services.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Google Cloud Platform                               │
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  Cloud Load     │────│   Cloud Run     │────│  Cloud SQL      │         │
│  │  Balancer       │    │   Services      │    │  (PostgreSQL)   │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                │                        │                    │
│                                │                        │                    │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │  Cloud CDN      │    │   Memorystore   │    │  Cloud Storage  │         │
│  │  (Frontend)     │    │   (Redis)       │    │  (Documents)    │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │                      Vertex AI Services                          │       │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │       │
│  │  │ Gemini   │  │Document  │  │ Vision   │  │ Natural  │        │       │
│  │  │ Pro      │  │ AI       │  │ AI       │  │Language  │        │       │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │                      Security & Monitoring                        │       │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │       │
│  │  │ Secret   │  │ Cloud    │  │ Error    │  │ Cloud    │        │       │
│  │  │ Manager  │  │Monitoring│  │Reporting │  │ Logging  │        │       │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │       │
│  └─────────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **gcloud CLI** installed and configured
3. **Terraform** v1.5+ installed
4. **Docker** installed
5. **Node.js** v20+ installed

## Quick Start

### 1. Clone and Setup

```bash
# Clone repository
git clone <repository-url>
cd CRE-Valuation-and-Assessment-Tool

# Install dependencies
npm install
```

### 2. Configure GCP Project

```bash
# Set project ID
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"

# Authenticate
gcloud auth login
gcloud config set project $GCP_PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  secretmanager.googleapis.com \
  aiplatform.googleapis.com \
  documentai.googleapis.com \
  vision.googleapis.com \
  language.googleapis.com \
  monitoring.googleapis.com \
  logging.googleapis.com
```

### 3. Deploy Infrastructure with Terraform

```bash
cd infrastructure/terraform-gcp

# Copy and configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Apply infrastructure
terraform apply
```

### 4. Configure Secrets

```bash
# Database URL
echo -n "postgresql://user:password@/dbname?host=/cloudsql/project:region:instance" | \
  gcloud secrets create database-url --data-file=-

# Redis URL
echo -n "redis://10.0.0.1:6379" | \
  gcloud secrets create redis-url --data-file=-

# JWT Secret
echo -n "$(openssl rand -base64 32)" | \
  gcloud secrets create jwt-secret --data-file=-

# Google OAuth Credentials
echo -n "your-client-id" | \
  gcloud secrets create google-client-id --data-file=-
echo -n "your-client-secret" | \
  gcloud secrets create google-client-secret --data-file=-
```

### 5. Build and Deploy Services

```bash
# Using Cloud Build (recommended)
gcloud builds submit --config=cloudbuild.yaml

# Or using GitHub Actions
# Push to main branch to trigger deployment
```

## Environment Configuration

### Required Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `GCP_PROJECT_ID` | GCP Project ID | Environment |
| `GCP_LOCATION` | GCP Region | Environment |
| `DATABASE_URL` | PostgreSQL connection | Secret Manager |
| `REDIS_URL` | Redis connection | Secret Manager |
| `JWT_SECRET` | JWT signing secret | Secret Manager |
| `GOOGLE_CLIENT_ID` | OAuth client ID | Secret Manager |
| `GOOGLE_CLIENT_SECRET` | OAuth client secret | Secret Manager |

### Service-Specific Configuration

See `.env.gcp.example` for a complete list of environment variables for each service.

## Services Overview

| Service | Port | Description |
|---------|------|-------------|
| api-gateway | 8080 | Main API entry point |
| ai-service | 8080 | Vertex AI integrations |
| valuation-service | 8080 | Property valuations |
| comps-service | 8080 | Comparable sales |
| assessment-service | 8080 | Tax assessments |
| appeals-service | 8080 | Assessment appeals |
| reporting-service | 8080 | Report generation |
| portfolio-service | 8080 | Portfolio management |
| admin-portal | 8080 | Next.js frontend |

## AI Services Integration

### Vertex AI Gemini

Used for:
- Valuation narrative generation
- Appeal argument creation
- Market analysis
- Property value prediction

### Document AI

Used for:
- Appraisal report parsing
- Rent roll extraction
- Legal document processing

### Vision AI

Used for:
- Property image analysis
- Condition assessment
- Feature extraction from photos

### Natural Language AI

Used for:
- Entity extraction from documents
- Sentiment analysis for market reports

## Monitoring and Observability

### Cloud Monitoring

Access metrics at: `https://console.cloud.google.com/monitoring`

Key metrics:
- API latency
- AI token usage
- Valuation confidence scores
- Error rates

### Cloud Logging

Access logs at: `https://console.cloud.google.com/logs`

Filter by service:
```
resource.type="cloud_run_revision"
resource.labels.service_name="ai-service"
```

### Error Reporting

Access at: `https://console.cloud.google.com/errors`

## Local Development

### Using Docker Compose

```bash
# Start all services locally
docker-compose -f docker-compose.gcp.yml up

# Services available at:
# - API Gateway: http://localhost:3000
# - Admin Portal: http://localhost:3100
# - AI Service: http://localhost:3006
```

### Development Mode

```bash
# Start individual service
cd services/ai-service
npm run dev

# Start admin portal
cd web/admin-portal
npm run dev
```

## CI/CD Pipeline

### GitHub Actions (Recommended)

The `.github/workflows/gcp-deploy.yml` workflow:
1. Runs tests on all PRs
2. Builds Docker images on push to main
3. Deploys to staging automatically
4. Deploys to production on release branches

### Cloud Build

The `cloudbuild.yaml` provides:
- Parallel image building
- Automatic deployment to Cloud Run
- Database migrations
- Health checks

## Security Considerations

1. **Authentication**: Google Cloud Identity with OAuth 2.0
2. **Secrets**: All secrets stored in Secret Manager
3. **Network**: VPC connector for Cloud Run services
4. **IAM**: Principle of least privilege for service accounts
5. **HTTPS**: Automatic SSL/TLS on Cloud Run

## Cost Optimization

1. **Min Instances**: Set to 0 for staging, 1 for production
2. **Cold Start**: Use HTTP/2 and optimize container startup
3. **Caching**: Memorystore for session and query caching
4. **AI Costs**: Monitor token usage, implement rate limiting

## Troubleshooting

### Common Issues

1. **Service won't start**
   - Check Cloud Logging for errors
   - Verify Secret Manager permissions
   - Check VPC connector configuration

2. **Database connection failed**
   - Verify Cloud SQL instance is running
   - Check connection string format
   - Verify service account permissions

3. **AI services not responding**
   - Verify Vertex AI API is enabled
   - Check quota limits
   - Review service account IAM roles

### Support

For issues, please open a GitHub issue with:
- Service name
- Error message
- Cloud Logging excerpt
- Steps to reproduce

## License

Proprietary - All Rights Reserved
