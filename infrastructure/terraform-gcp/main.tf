# ============================================================================
# Axxiom Platform - Google Cloud Platform Terraform Configuration
# ============================================================================
# Production-grade infrastructure for AI-powered CRE Valuation Platform
# ============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.10"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.10"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Backend configuration for remote state storage in GCS
  backend "gcs" {
    bucket = "axxiom-terraform-state"
    prefix = "terraform/state"
  }
}

# ============================================================================
# Provider Configuration
# ============================================================================

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# ============================================================================
# Data Sources
# ============================================================================

data "google_project" "current" {
  project_id = var.project_id
}

data "google_client_config" "current" {}

# ============================================================================
# Local Variables
# ============================================================================

locals {
  # Project metadata
  project_name = "axxiom"
  environment  = var.environment
  region       = var.region

  # Common labels for all resources
  common_labels = merge(
    var.labels,
    {
      project     = local.project_name
      environment = local.environment
      managed-by  = "terraform"
    }
  )

  # Service names
  services = {
    api_gateway       = "api-gateway"
    valuation         = "valuation-service"
    comps             = "comps-service"
    assessment        = "assessment-service"
    appeals           = "appeals-service"
    reporting         = "reporting-service"
    ai                = "ai-service"
    data_ingestion    = "data-ingestion-service"
    computer_vision   = "computer-vision-service"
    geospatial        = "geospatial-service"
    portfolio         = "portfolio-service"
  }

  # Cloud Run service URLs (will be populated after deployment)
  service_urls = {
    for name, service in local.services : name => "https://${service}-${random_id.service_suffix.hex}-${local.region}.a.run.app"
  }
}

# Random suffix for unique resource names
resource "random_id" "service_suffix" {
  byte_length = 4
}

# ============================================================================
# Enable Required APIs
# ============================================================================

resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "containerregistry.googleapis.com",
    "artifactregistry.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "secretmanager.googleapis.com",
    "aiplatform.googleapis.com",
    "documentai.googleapis.com",
    "vision.googleapis.com",
    "language.googleapis.com",
    "storage.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "compute.googleapis.com",
    "vpcaccess.googleapis.com",
    "servicenetworking.googleapis.com",
    "cloudtrace.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "clouderrorreporting.googleapis.com",
    "cloudprofiler.googleapis.com",
    "identitytoolkit.googleapis.com",
  ])

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

# ============================================================================
# Networking - VPC and Private Services Access
# ============================================================================

resource "google_compute_network" "main" {
  name                    = "${local.project_name}-vpc-${local.environment}"
  auto_create_subnetworks = false
  project                 = var.project_id

  depends_on = [google_project_service.apis["compute.googleapis.com"]]
}

resource "google_compute_subnetwork" "main" {
  name                     = "${local.project_name}-subnet-${local.environment}"
  ip_cidr_range            = var.subnet_cidr
  region                   = local.region
  network                  = google_compute_network.main.id
  private_ip_google_access = true

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = var.services_cidr
  }

  log_config {
    aggregation_interval = "INTERVAL_5_SEC"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

# Private services access for Cloud SQL
resource "google_compute_global_address" "private_ip_range" {
  name          = "${local.project_name}-private-ip-${local.environment}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.main.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.main.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]

  depends_on = [google_project_service.apis["servicenetworking.googleapis.com"]]
}

# Serverless VPC Access Connector for Cloud Run
resource "google_vpc_access_connector" "connector" {
  name          = "${local.project_name}-vpc-connector"
  region        = local.region
  network       = google_compute_network.main.name
  ip_cidr_range = var.connector_cidr

  min_instances = 2
  max_instances = 10

  depends_on = [google_project_service.apis["vpcaccess.googleapis.com"]]
}

# ============================================================================
# Artifact Registry - Container Images
# ============================================================================

resource "google_artifact_registry_repository" "main" {
  location      = local.region
  repository_id = "${local.project_name}-containers"
  format        = "DOCKER"
  description   = "Docker container images for Axxiom platform"

  labels = local.common_labels

  depends_on = [google_project_service.apis["artifactregistry.googleapis.com"]]
}

# ============================================================================
# Cloud SQL - PostgreSQL with PostGIS
# ============================================================================

resource "google_sql_database_instance" "main" {
  name                = "${local.project_name}-postgres-${local.environment}-${random_id.service_suffix.hex}"
  database_version    = "POSTGRES_15"
  region              = local.region
  deletion_protection = var.environment == "prod" ? true : false

  settings {
    tier              = var.db_tier
    availability_type = var.environment == "prod" ? "REGIONAL" : "ZONAL"
    disk_size         = var.db_disk_size
    disk_type         = "PD_SSD"
    disk_autoresize   = true

    database_flags {
      name  = "cloudsql.iam_authentication"
      value = "on"
    }

    database_flags {
      name  = "max_connections"
      value = "500"
    }

    database_flags {
      name  = "log_checkpoints"
      value = "on"
    }

    database_flags {
      name  = "log_connections"
      value = "on"
    }

    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = google_compute_network.main.id
      enable_private_path_for_google_cloud_services = true
    }

    backup_configuration {
      enabled                        = true
      start_time                     = "02:00"
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7

      backup_retention_settings {
        retained_backups = 30
        retention_unit   = "COUNT"
      }
    }

    maintenance_window {
      day          = 7
      hour         = 3
      update_track = "stable"
    }

    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags = true
      record_client_address   = true
    }

    user_labels = local.common_labels
  }

  depends_on = [
    google_service_networking_connection.private_vpc_connection,
    google_project_service.apis["sqladmin.googleapis.com"]
  ]
}

resource "google_sql_database" "main" {
  name     = "axxiom"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "app" {
  name     = "axxiom_app"
  instance = google_sql_database_instance.main.name
  password = random_password.db_password.result
}

resource "random_password" "db_password" {
  length  = 32
  special = true
}

# ============================================================================
# Memorystore Redis - Caching
# ============================================================================

resource "google_redis_instance" "main" {
  name               = "${local.project_name}-redis-${local.environment}"
  tier               = var.environment == "prod" ? "STANDARD_HA" : "BASIC"
  memory_size_gb     = var.redis_memory_size
  region             = local.region
  redis_version      = "REDIS_7_0"
  authorized_network = google_compute_network.main.id
  connect_mode       = "PRIVATE_SERVICE_ACCESS"

  transit_encryption_mode = "SERVER_AUTHENTICATION"
  auth_enabled            = true

  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 2
        minutes = 0
      }
    }
  }

  labels = local.common_labels

  depends_on = [
    google_service_networking_connection.private_vpc_connection,
    google_project_service.apis["redis.googleapis.com"]
  ]
}

# ============================================================================
# Cloud Storage - Data Lake and Assets
# ============================================================================

resource "google_storage_bucket" "data_lake" {
  name     = "${local.project_name}-data-lake-${var.project_id}-${local.environment}"
  location = local.region

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }

  cors {
    origin          = var.allowed_origins
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  labels = local.common_labels
}

resource "google_storage_bucket" "reports" {
  name     = "${local.project_name}-reports-${var.project_id}-${local.environment}"
  location = local.region

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type = "Delete"
    }
  }

  labels = local.common_labels
}

resource "google_storage_bucket" "ml_models" {
  name     = "${local.project_name}-ml-models-${var.project_id}-${local.environment}"
  location = local.region

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  versioning {
    enabled = true
  }

  labels = local.common_labels
}

# ============================================================================
# Secret Manager - Secure Configuration
# ============================================================================

resource "google_secret_manager_secret" "db_password" {
  secret_id = "${local.project_name}-db-password-${local.environment}"

  replication {
    auto {}
  }

  labels = local.common_labels

  depends_on = [google_project_service.apis["secretmanager.googleapis.com"]]
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = random_password.db_password.result
}

resource "google_secret_manager_secret" "redis_auth" {
  secret_id = "${local.project_name}-redis-auth-${local.environment}"

  replication {
    auto {}
  }

  labels = local.common_labels
}

resource "google_secret_manager_secret_version" "redis_auth" {
  secret      = google_secret_manager_secret.redis_auth.id
  secret_data = google_redis_instance.main.auth_string
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "${local.project_name}-jwt-secret-${local.environment}"

  replication {
    auto {}
  }

  labels = local.common_labels
}

resource "google_secret_manager_secret_version" "jwt_secret" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = random_password.jwt_secret.result
}

resource "random_password" "jwt_secret" {
  length  = 64
  special = false
}

# ============================================================================
# Service Account for Cloud Run Services
# ============================================================================

resource "google_service_account" "cloud_run" {
  account_id   = "${local.project_name}-cloud-run-${local.environment}"
  display_name = "Axxiom Cloud Run Service Account"
  description  = "Service account for Axxiom Cloud Run services"
}

# IAM bindings for the service account
resource "google_project_iam_member" "cloud_run_roles" {
  for_each = toset([
    "roles/cloudsql.client",
    "roles/secretmanager.secretAccessor",
    "roles/storage.objectAdmin",
    "roles/aiplatform.user",
    "roles/documentai.apiUser",
    "roles/cloudtrace.agent",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# ============================================================================
# Vertex AI - Gemini Models
# ============================================================================

resource "google_vertex_ai_featurestore" "main" {
  name   = "${local.project_name}_featurestore_${local.environment}"
  region = local.region

  online_serving_config {
    fixed_node_count = var.environment == "prod" ? 2 : 1
  }

  labels = local.common_labels

  depends_on = [google_project_service.apis["aiplatform.googleapis.com"]]
}

# ============================================================================
# Document AI Processor
# ============================================================================

resource "google_document_ai_processor" "ocr" {
  location     = var.document_ai_location
  display_name = "${local.project_name}-ocr-processor"
  type         = "OCR_PROCESSOR"

  depends_on = [google_project_service.apis["documentai.googleapis.com"]]
}

resource "google_document_ai_processor" "form_parser" {
  location     = var.document_ai_location
  display_name = "${local.project_name}-form-parser"
  type         = "FORM_PARSER_PROCESSOR"

  depends_on = [google_project_service.apis["documentai.googleapis.com"]]
}

# ============================================================================
# Cloud Run Services
# ============================================================================

# API Gateway
resource "google_cloud_run_v2_service" "api_gateway" {
  name     = "${local.services.api_gateway}-${random_id.service_suffix.hex}"
  location = local.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.cloud_run.email

    scaling {
      min_instance_count = var.environment == "prod" ? 2 : 0
      max_instance_count = 100
    }

    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    containers {
      image = "${local.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.main.repository_id}/${local.services.api_gateway}:latest"

      resources {
        limits = {
          cpu    = "2"
          memory = "2Gi"
        }
        cpu_idle = true
      }

      ports {
        container_port = 3000
      }

      env {
        name  = "NODE_ENV"
        value = var.environment == "prod" ? "production" : "development"
      }

      env {
        name  = "PORT"
        value = "3000"
      }

      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }

      env {
        name  = "GCP_REGION"
        value = local.region
      }

      # Service URLs - populated dynamically
      dynamic "env" {
        for_each = local.services
        content {
          name  = upper(replace(env.key, "-", "_")) != "API_GATEWAY" ? "${upper(replace(env.key, "-", "_"))}_URL" : "SKIP"
          value = env.key != "api_gateway" ? "https://${env.value}-${random_id.service_suffix.hex}-${local.region}.a.run.app" : ""
        }
      }

      startup_probe {
        http_get {
          path = "/health"
        }
        initial_delay_seconds = 5
        timeout_seconds       = 3
        period_seconds        = 10
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/health"
        }
        period_seconds    = 30
        timeout_seconds   = 3
        failure_threshold = 3
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  labels = local.common_labels

  depends_on = [google_project_service.apis["run.googleapis.com"]]
}

# Allow unauthenticated access to API Gateway
resource "google_cloud_run_v2_service_iam_member" "api_gateway_public" {
  project  = var.project_id
  location = local.region
  name     = google_cloud_run_v2_service.api_gateway.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# ============================================================================
# Cloud Monitoring - Alerting Policies
# ============================================================================

resource "google_monitoring_notification_channel" "email" {
  display_name = "Axxiom DevOps Email"
  type         = "email"

  labels = {
    email_address = var.alert_email
  }

  depends_on = [google_project_service.apis["monitoring.googleapis.com"]]
}

resource "google_monitoring_alert_policy" "high_latency" {
  display_name = "Cloud Run High Latency Alert"
  combiner     = "OR"

  conditions {
    display_name = "Request latency > 2s"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_latencies\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 2000

      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_PERCENTILE_99"
        cross_series_reducer = "REDUCE_MEAN"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.name]

  alert_strategy {
    auto_close = "604800s"
  }

  user_labels = local.common_labels
}

resource "google_monitoring_alert_policy" "error_rate" {
  display_name = "Cloud Run High Error Rate"
  combiner     = "OR"

  conditions {
    display_name = "Error rate > 1%"
    condition_threshold {
      filter          = "resource.type = \"cloud_run_revision\" AND metric.type = \"run.googleapis.com/request_count\" AND metric.labels.response_code_class != \"2xx\""
      duration        = "300s"
      comparison      = "COMPARISON_GT"
      threshold_value = 0.01

      aggregations {
        alignment_period     = "60s"
        per_series_aligner   = "ALIGN_RATE"
        cross_series_reducer = "REDUCE_SUM"
      }
    }
  }

  notification_channels = [google_monitoring_notification_channel.email.name]

  user_labels = local.common_labels
}

# ============================================================================
# Cloud Scheduler - Automated Jobs
# ============================================================================

resource "google_cloud_scheduler_job" "daily_data_sync" {
  name        = "${local.project_name}-daily-data-sync"
  description = "Trigger daily data synchronization"
  schedule    = "0 2 * * *"
  time_zone   = "America/New_York"

  http_target {
    http_method = "POST"
    uri         = "${google_cloud_run_v2_service.api_gateway.uri}/api/v1/ingestion/sync"

    oidc_token {
      service_account_email = google_service_account.cloud_run.email
    }
  }

  retry_config {
    retry_count = 3
  }
}

# ============================================================================
# Outputs
# ============================================================================

output "api_gateway_url" {
  description = "API Gateway URL"
  value       = google_cloud_run_v2_service.api_gateway.uri
}

output "database_connection_name" {
  description = "Cloud SQL connection name"
  value       = google_sql_database_instance.main.connection_name
}

output "redis_host" {
  description = "Redis host"
  value       = google_redis_instance.main.host
  sensitive   = true
}

output "artifact_registry" {
  description = "Artifact Registry URL"
  value       = "${local.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.main.repository_id}"
}

output "service_account_email" {
  description = "Cloud Run service account email"
  value       = google_service_account.cloud_run.email
}

output "vpc_connector_id" {
  description = "VPC Access Connector ID"
  value       = google_vpc_access_connector.connector.id
}

output "data_lake_bucket" {
  description = "Data lake bucket name"
  value       = google_storage_bucket.data_lake.name
}

output "reports_bucket" {
  description = "Reports bucket name"
  value       = google_storage_bucket.reports.name
}

output "document_ai_processors" {
  description = "Document AI processor IDs"
  value = {
    ocr         = google_document_ai_processor.ocr.id
    form_parser = google_document_ai_processor.form_parser.id
  }
}
