# ============================================================================
# Axxiom Platform - Terraform Variables for Google Cloud Platform
# ============================================================================

# ============================================================================
# Project Configuration
# ============================================================================

variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]{4,28}[a-z0-9]$", var.project_id))
    error_message = "Project ID must be 6-30 characters, start with a letter, and contain only lowercase letters, numbers, and hyphens."
  }
}

variable "region" {
  description = "Primary Google Cloud region"
  type        = string
  default     = "us-central1"

  validation {
    condition     = contains(["us-central1", "us-east1", "us-west1", "europe-west1", "asia-east1"], var.region)
    error_message = "Region must be a valid Google Cloud region."
  }
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "labels" {
  description = "Labels to apply to all resources"
  type        = map(string)
  default     = {}
}

# ============================================================================
# Networking Configuration
# ============================================================================

variable "subnet_cidr" {
  description = "CIDR range for the main subnet"
  type        = string
  default     = "10.0.0.0/20"
}

variable "services_cidr" {
  description = "CIDR range for services (GKE pods if used)"
  type        = string
  default     = "10.1.0.0/20"
}

variable "connector_cidr" {
  description = "CIDR range for Serverless VPC Access Connector"
  type        = string
  default     = "10.8.0.0/28"
}

# ============================================================================
# Database Configuration
# ============================================================================

variable "db_tier" {
  description = "Cloud SQL instance tier"
  type        = string
  default     = "db-custom-2-4096"

  validation {
    condition     = can(regex("^db-", var.db_tier))
    error_message = "Database tier must start with 'db-'."
  }
}

variable "db_disk_size" {
  description = "Cloud SQL disk size in GB"
  type        = number
  default     = 50

  validation {
    condition     = var.db_disk_size >= 10 && var.db_disk_size <= 65536
    error_message = "Disk size must be between 10 and 65536 GB."
  }
}

# ============================================================================
# Redis Configuration
# ============================================================================

variable "redis_memory_size" {
  description = "Redis memory size in GB"
  type        = number
  default     = 1

  validation {
    condition     = var.redis_memory_size >= 1 && var.redis_memory_size <= 300
    error_message = "Redis memory size must be between 1 and 300 GB."
  }
}

# ============================================================================
# Document AI Configuration
# ============================================================================

variable "document_ai_location" {
  description = "Location for Document AI processors"
  type        = string
  default     = "us"

  validation {
    condition     = contains(["us", "eu"], var.document_ai_location)
    error_message = "Document AI location must be 'us' or 'eu'."
  }
}

# ============================================================================
# Security Configuration
# ============================================================================

variable "allowed_origins" {
  description = "Allowed CORS origins"
  type        = list(string)
  default     = ["https://axxiom.app"]
}

# ============================================================================
# Monitoring Configuration
# ============================================================================

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = "devops@axxiom.app"
}

# ============================================================================
# Environment-Specific Defaults
# ============================================================================

variable "min_instances" {
  description = "Minimum number of Cloud Run instances per service"
  type        = map(number)
  default = {
    dev     = 0
    staging = 1
    prod    = 2
  }
}

variable "max_instances" {
  description = "Maximum number of Cloud Run instances per service"
  type        = map(number)
  default = {
    dev     = 10
    staging = 50
    prod    = 100
  }
}

# ============================================================================
# Feature Flags
# ============================================================================

variable "enable_vertex_ai" {
  description = "Enable Vertex AI features"
  type        = bool
  default     = true
}

variable "enable_document_ai" {
  description = "Enable Document AI features"
  type        = bool
  default     = true
}

variable "enable_vision_ai" {
  description = "Enable Vision AI features"
  type        = bool
  default     = true
}

variable "enable_natural_language" {
  description = "Enable Natural Language AI features"
  type        = bool
  default     = true
}
