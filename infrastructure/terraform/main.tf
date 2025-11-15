# ============================================================================
# Axxiom Platform - Main Terraform Configuration
# ============================================================================
# This is the main entry point for Terraform infrastructure provisioning
# ============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.45"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Backend configuration for remote state storage
  backend "azurerm" {
    resource_group_name  = "rg-axxiom-tfstate"
    storage_account_name = "sttfstateaxxiom"
    container_name       = "tfstate"
    key                  = "axxiom.tfstate"
  }
}

# ============================================================================
# Provider Configuration
# ============================================================================

provider "azurerm" {
  features {
    key_vault {
      purge_soft_delete_on_destroy = false
      recover_soft_deleted_key_vaults = true
    }

    resource_group {
      prevent_deletion_if_contains_resources = true
    }

    virtual_machine {
      delete_os_disk_on_deletion = true
    }
  }
}

provider "azuread" {}

# ============================================================================
# Data Sources
# ============================================================================

data "azurerm_client_config" "current" {}

data "azurerm_subscription" "current" {}

# ============================================================================
# Local Variables
# ============================================================================

locals {
  # Project metadata
  project_name = "axxiom"
  environment  = var.environment
  location     = var.location

  # Common tags for all resources
  common_tags = merge(
    var.tags,
    {
      Project     = local.project_name
      Environment = local.environment
      ManagedBy   = "Terraform"
      CreatedDate = formatdate("YYYY-MM-DD", timestamp())
    }
  )

  # Naming conventions
  resource_prefix = "${local.project_name}-${local.environment}-${local.location}"

  # Network configuration
  vnet_address_space = var.vnet_address_space

  # Multi-region configuration
  primary_region   = var.location
  secondary_region = var.secondary_location
}

# ============================================================================
# Resource Groups
# ============================================================================

# Application resources
resource "azurerm_resource_group" "app" {
  name     = "rg-${local.resource_prefix}-app"
  location = local.location
  tags     = local.common_tags
}

# Data resources
resource "azurerm_resource_group" "data" {
  name     = "rg-${local.resource_prefix}-data"
  location = local.location
  tags     = local.common_tags
}

# ML/AI resources
resource "azurerm_resource_group" "ml" {
  name     = "rg-${local.resource_prefix}-ml"
  location = local.location
  tags     = local.common_tags
}

# Network resources
resource "azurerm_resource_group" "network" {
  name     = "rg-${local.resource_prefix}-network"
  location = local.location
  tags     = local.common_tags
}

# Security resources
resource "azurerm_resource_group" "security" {
  name     = "rg-${local.resource_prefix}-security"
  location = local.location
  tags     = local.common_tags
}

# Monitoring resources
resource "azurerm_resource_group" "monitoring" {
  name     = "rg-${local.resource_prefix}-monitoring"
  location = local.location
  tags     = local.common_tags
}

# ============================================================================
# Module Invocations
# ============================================================================

# Networking module
module "networking" {
  source = "./modules/networking"

  resource_group_name = azurerm_resource_group.network.name
  location            = local.location
  vnet_address_space  = local.vnet_address_space
  environment         = local.environment
  tags                = local.common_tags
}

# Security module (Key Vault, Managed Identities)
module "security" {
  source = "./modules/security"

  resource_group_name = azurerm_resource_group.security.name
  location            = local.location
  environment         = local.environment
  tenant_id           = data.azurerm_client_config.current.tenant_id
  tags                = local.common_tags

  depends_on = [azurerm_resource_group.security]
}

# Storage module (Data Lake, Blob Storage)
module "storage" {
  source = "./modules/storage"

  resource_group_name = azurerm_resource_group.data.name
  location            = local.location
  environment         = local.environment
  tags                = local.common_tags

  # Private endpoint configuration
  subnet_id = module.networking.private_endpoint_subnet_id

  depends_on = [azurerm_resource_group.data, module.networking]
}

# Database module (Azure SQL, Cosmos DB, PostgreSQL)
module "database" {
  source = "./modules/database"

  resource_group_name = azurerm_resource_group.data.name
  location            = local.location
  environment         = local.environment
  tags                = local.common_tags

  # Network configuration
  subnet_id           = module.networking.database_subnet_id
  allowed_subnet_ids  = [module.networking.aks_subnet_id]

  # Security configuration
  key_vault_id = module.security.key_vault_id

  depends_on = [azurerm_resource_group.data, module.networking, module.security]
}

# AKS module (Kubernetes cluster)
module "aks" {
  source = "./modules/aks"

  resource_group_name = azurerm_resource_group.app.name
  location            = local.location
  environment         = local.environment
  tags                = local.common_tags

  # Network configuration
  vnet_id           = module.networking.vnet_id
  aks_subnet_id     = module.networking.aks_subnet_id

  # Identity configuration
  key_vault_id = module.security.key_vault_id

  depends_on = [azurerm_resource_group.app, module.networking]
}

# Container Registry module
module "container_registry" {
  source = "./modules/acr"

  resource_group_name = azurerm_resource_group.app.name
  location            = local.location
  environment         = local.environment
  tags                = local.common_tags

  # AKS integration
  aks_principal_id = module.aks.kubelet_identity_object_id

  depends_on = [azurerm_resource_group.app]
}

# Azure ML module
module "machine_learning" {
  source = "./modules/ml"

  resource_group_name = azurerm_resource_group.ml.name
  location            = local.location
  environment         = local.environment
  tags                = local.common_tags

  # Storage configuration
  storage_account_id   = module.storage.storage_account_id
  container_registry_id = module.container_registry.registry_id

  # Security configuration
  key_vault_id = module.security.key_vault_id

  depends_on = [azurerm_resource_group.ml, module.storage, module.security]
}

# Azure OpenAI module
module "openai" {
  source = "./modules/openai"

  resource_group_name = azurerm_resource_group.ml.name
  location            = local.location # Note: OpenAI might require specific regions
  environment         = local.environment
  tags                = local.common_tags

  # Private endpoint configuration
  subnet_id = module.networking.private_endpoint_subnet_id

  depends_on = [azurerm_resource_group.ml, module.networking]
}

# AI Search module
module "ai_search" {
  source = "./modules/search"

  resource_group_name = azurerm_resource_group.ml.name
  location            = local.location
  environment         = local.environment
  tags                = local.common_tags

  depends_on = [azurerm_resource_group.ml]
}

# API Management module
module "api_management" {
  source = "./modules/apim"

  resource_group_name = azurerm_resource_group.app.name
  location            = local.location
  environment         = local.environment
  tags                = local.common_tags

  # Network configuration
  subnet_id = module.networking.apim_subnet_id

  # Security configuration
  key_vault_id = module.security.key_vault_id

  depends_on = [azurerm_resource_group.app, module.networking]
}

# Monitoring module (Application Insights, Log Analytics)
module "monitoring" {
  source = "./modules/monitoring"

  resource_group_name = azurerm_resource_group.monitoring.name
  location            = local.location
  environment         = local.environment
  tags                = local.common_tags

  depends_on = [azurerm_resource_group.monitoring]
}

# Event Hub / Service Bus module
module "messaging" {
  source = "./modules/messaging"

  resource_group_name = azurerm_resource_group.app.name
  location            = local.location
  environment         = local.environment
  tags                = local.common_tags

  depends_on = [azurerm_resource_group.app]
}

# ============================================================================
# Outputs
# ============================================================================

output "resource_groups" {
  description = "Resource group names"
  value = {
    app        = azurerm_resource_group.app.name
    data       = azurerm_resource_group.data.name
    ml         = azurerm_resource_group.ml.name
    network    = azurerm_resource_group.network.name
    security   = azurerm_resource_group.security.name
    monitoring = azurerm_resource_group.monitoring.name
  }
}

output "key_vault_name" {
  description = "Key Vault name"
  value       = module.security.key_vault_name
}

output "aks_cluster_name" {
  description = "AKS cluster name"
  value       = module.aks.cluster_name
}

output "container_registry_login_server" {
  description = "Container registry login server"
  value       = module.container_registry.login_server
}

output "storage_account_name" {
  description = "Data Lake storage account name"
  value       = module.storage.storage_account_name
}

output "application_insights_connection_string" {
  description = "Application Insights connection string"
  value       = module.monitoring.app_insights_connection_string
  sensitive   = true
}

output "openai_endpoint" {
  description = "Azure OpenAI endpoint"
  value       = module.openai.endpoint
}

output "ai_search_endpoint" {
  description = "AI Search endpoint"
  value       = module.ai_search.endpoint
}
