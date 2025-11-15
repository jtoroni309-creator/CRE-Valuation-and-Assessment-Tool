# ============================================================================
# Networking Module - Outputs
# ============================================================================

output "vnet_id" {
  description = "Virtual network ID"
  value       = azurerm_virtual_network.main.id
}

output "vnet_name" {
  description = "Virtual network name"
  value       = azurerm_virtual_network.main.name
}

output "aks_subnet_id" {
  description = "AKS subnet ID"
  value       = azurerm_subnet.aks.id
}

output "database_subnet_id" {
  description = "Database subnet ID"
  value       = azurerm_subnet.database.id
}

output "apim_subnet_id" {
  description = "API Management subnet ID"
  value       = azurerm_subnet.apim.id
}

output "app_gateway_subnet_id" {
  description = "Application Gateway subnet ID"
  value       = azurerm_subnet.app_gateway.id
}

output "private_endpoint_subnet_id" {
  description = "Private endpoints subnet ID"
  value       = azurerm_subnet.private_endpoints.id
}

output "bastion_subnet_id" {
  description = "Bastion subnet ID"
  value       = azurerm_subnet.bastion.id
}

output "nat_gateway_id" {
  description = "NAT Gateway ID"
  value       = azurerm_nat_gateway.main.id
}

output "private_dns_zone_ids" {
  description = "Private DNS zone IDs"
  value = {
    sql      = azurerm_private_dns_zone.sql.id
    blob     = azurerm_private_dns_zone.blob.id
    dfs      = azurerm_private_dns_zone.dfs.id
    keyvault = azurerm_private_dns_zone.keyvault.id
    openai   = azurerm_private_dns_zone.openai.id
  }
}
