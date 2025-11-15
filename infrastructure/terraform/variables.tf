# ============================================================================
# Axxiom Platform - Terraform Variables
# ============================================================================

# ============================================================================
# Environment Configuration
# ============================================================================

variable "environment" {
  description = "Environment name (dev, test, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "test", "prod"], var.environment)
    error_message = "Environment must be dev, test, or prod."
  }
}

variable "location" {
  description = "Primary Azure region for resources"
  type        = string
  default     = "eastus2"
}

variable "secondary_location" {
  description = "Secondary Azure region for disaster recovery"
  type        = string
  default     = "centralus"
}

# ============================================================================
# Networking Configuration
# ============================================================================

variable "vnet_address_space" {
  description = "Address space for the virtual network"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "enable_ddos_protection" {
  description = "Enable DDoS protection for virtual network"
  type        = bool
  default     = false # Set to true for production
}

variable "enable_private_endpoints" {
  description = "Enable private endpoints for PaaS services"
  type        = bool
  default     = true
}

# ============================================================================
# AKS Configuration
# ============================================================================

variable "aks_node_pools" {
  description = "Configuration for AKS node pools"
  type = object({
    system = object({
      vm_size   = string
      min_count = number
      max_count = number
    })
    api = object({
      vm_size   = string
      min_count = number
      max_count = number
    })
    compute = object({
      vm_size   = string
      min_count = number
      max_count = number
    })
    gpu = object({
      vm_size   = string
      min_count = number
      max_count = number
    })
  })
  default = {
    system = {
      vm_size   = "Standard_D4s_v5"
      min_count = 3
      max_count = 10
    }
    api = {
      vm_size   = "Standard_D8s_v5"
      min_count = 5
      max_count = 20
    }
    compute = {
      vm_size   = "Standard_D16s_v5"
      min_count = 3
      max_count = 15
    }
    gpu = {
      vm_size   = "Standard_NC6s_v3"
      min_count = 0
      max_count = 5
    }
  }
}

variable "kubernetes_version" {
  description = "Kubernetes version for AKS"
  type        = string
  default     = "1.28.3"
}

variable "enable_aks_network_policy" {
  description = "Enable network policy for AKS (azure or calico)"
  type        = string
  default     = "azure"
  validation {
    condition     = contains(["azure", "calico", "none"], var.enable_aks_network_policy)
    error_message = "Network policy must be azure, calico, or none."
  }
}

# ============================================================================
# Database Configuration
# ============================================================================

variable "sql_sku" {
  description = "SKU for Azure SQL Database"
  type        = string
  default     = "GP_S_Gen5_4" # General Purpose Serverless, 4 vCores
}

variable "sql_max_size_gb" {
  description = "Maximum size for SQL database in GB"
  type        = number
  default     = 250
}

variable "enable_sql_geo_replication" {
  description = "Enable geo-replication for SQL database"
  type        = bool
  default     = false # Set to true for production
}

variable "cosmos_consistency_level" {
  description = "Consistency level for Cosmos DB"
  type        = string
  default     = "Session"
  validation {
    condition     = contains(["Eventual", "Session", "BoundedStaleness", "Strong", "ConsistentPrefix"], var.cosmos_consistency_level)
    error_message = "Invalid Cosmos DB consistency level."
  }
}

variable "postgresql_sku" {
  description = "SKU for PostgreSQL Flexible Server"
  type        = string
  default     = "GP_Standard_D4s_v3"
}

# ============================================================================
# Storage Configuration
# ============================================================================

variable "storage_account_tier" {
  description = "Storage account performance tier"
  type        = string
  default     = "Standard"
  validation {
    condition     = contains(["Standard", "Premium"], var.storage_account_tier)
    error_message = "Storage tier must be Standard or Premium."
  }
}

variable "storage_replication_type" {
  description = "Storage account replication type"
  type        = string
  default     = "ZRS" # Zone-Redundant Storage for production
  validation {
    condition     = contains(["LRS", "ZRS", "GRS", "GZRS"], var.storage_replication_type)
    error_message = "Invalid storage replication type."
  }
}

variable "enable_data_lake_hierarchical_namespace" {
  description = "Enable hierarchical namespace for Data Lake Gen2"
  type        = bool
  default     = true
}

# ============================================================================
# ML/AI Configuration
# ============================================================================

variable "azure_ml_sku" {
  description = "SKU for Azure ML workspace"
  type        = string
  default     = "Basic"
  validation {
    condition     = contains(["Basic", "Enterprise"], var.azure_ml_sku)
    error_message = "Azure ML SKU must be Basic or Enterprise."
  }
}

variable "openai_deployments" {
  description = "Azure OpenAI model deployments"
  type = map(object({
    model_name    = string
    model_version = string
    scale_type    = string
    capacity      = number
  }))
  default = {
    gpt4o = {
      model_name    = "gpt-4o"
      model_version = "2024-05-13"
      scale_type    = "Standard"
      capacity      = 100
    }
    gpt4_turbo = {
      model_name    = "gpt-4"
      model_version = "turbo-2024-04-09"
      scale_type    = "Standard"
      capacity      = 50
    }
    embeddings = {
      model_name    = "text-embedding-ada-002"
      model_version = "2"
      scale_type    = "Standard"
      capacity      = 120
    }
  }
}

variable "ai_search_sku" {
  description = "SKU for Azure AI Search"
  type        = string
  default     = "standard"
  validation {
    condition     = contains(["free", "basic", "standard", "standard2", "standard3", "storage_optimized_l1", "storage_optimized_l2"], var.ai_search_sku)
    error_message = "Invalid AI Search SKU."
  }
}

# ============================================================================
# API Management Configuration
# ============================================================================

variable "apim_sku" {
  description = "SKU for API Management"
  type        = string
  default     = "Developer_1"
}

variable "apim_publisher_name" {
  description = "Publisher name for API Management"
  type        = string
  default     = "Axxiom"
}

variable "apim_publisher_email" {
  description = "Publisher email for API Management"
  type        = string
  default     = "admin@axxiom.ai"
}

# ============================================================================
# Monitoring Configuration
# ============================================================================

variable "log_analytics_retention_days" {
  description = "Retention period for Log Analytics in days"
  type        = number
  default     = 90
}

variable "enable_application_insights" {
  description = "Enable Application Insights"
  type        = bool
  default     = true
}

variable "app_insights_sampling_percentage" {
  description = "Sampling percentage for Application Insights"
  type        = number
  default     = 100
  validation {
    condition     = var.app_insights_sampling_percentage >= 0 && var.app_insights_sampling_percentage <= 100
    error_message = "Sampling percentage must be between 0 and 100."
  }
}

# ============================================================================
# Security Configuration
# ============================================================================

variable "enable_key_vault_soft_delete" {
  description = "Enable soft delete for Key Vault"
  type        = bool
  default     = true
}

variable "key_vault_soft_delete_retention_days" {
  description = "Retention period for soft-deleted Key Vault items"
  type        = number
  default     = 90
}

variable "enable_azure_defender" {
  description = "Enable Azure Defender for Cloud"
  type        = bool
  default     = true
}

variable "allowed_ip_ranges" {
  description = "Allowed IP ranges for firewall rules"
  type        = list(string)
  default     = []
}

# ============================================================================
# Messaging Configuration
# ============================================================================

variable "event_hub_sku" {
  description = "SKU for Event Hubs namespace"
  type        = string
  default     = "Standard"
  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.event_hub_sku)
    error_message = "Event Hub SKU must be Basic, Standard, or Premium."
  }
}

variable "service_bus_sku" {
  description = "SKU for Service Bus namespace"
  type        = string
  default     = "Premium"
  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.service_bus_sku)
    error_message = "Service Bus SKU must be Basic, Standard, or Premium."
  }
}

# ============================================================================
# Backup & DR Configuration
# ============================================================================

variable "enable_backups" {
  description = "Enable automated backups"
  type        = bool
  default     = true
}

variable "backup_retention_days" {
  description = "Retention period for backups in days"
  type        = number
  default     = 30
}

variable "enable_geo_redundancy" {
  description = "Enable geo-redundancy for critical services"
  type        = bool
  default     = false # Set to true for production
}

# ============================================================================
# Tagging
# ============================================================================

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default = {
    Platform    = "Axxiom"
    CostCenter  = "Engineering"
    Owner       = "Platform Team"
    Compliance  = "SOC2"
  }
}

# ============================================================================
# Feature Flags
# ============================================================================

variable "enable_experimental_features" {
  description = "Enable experimental features (not for production)"
  type        = bool
  default     = false
}

variable "enable_cost_optimization" {
  description = "Enable cost optimization features (auto-shutdown, right-sizing)"
  type        = bool
  default     = true
}

variable "enable_high_availability" {
  description = "Enable high availability configurations (availability zones, multi-region)"
  type        = bool
  default     = false # Set to true for production
}
