.PHONY: help install build dev start stop clean test migrate seed

# Default target
.DEFAULT_GOAL := help

# ============================================================================
# Help
# ============================================================================

help: ## Show this help message
	@echo 'Axxiom Platform - Development Commands'
	@echo ''
	@echo 'Usage:'
	@echo '  make <target>'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ============================================================================
# Installation
# ============================================================================

install: ## Install all dependencies
	npm install
	@echo "✓ Dependencies installed"

# ============================================================================
# Build
# ============================================================================

build: ## Build all services
	npm run build
	@echo "✓ All services built"

build-docker: ## Build Docker images
	docker-compose build
	@echo "✓ Docker images built"

# ============================================================================
# Development
# ============================================================================

dev: ## Start development servers (all services)
	@echo "Starting all services in development mode..."
	docker-compose up -d postgres redis
	@echo "Waiting for databases to be ready..."
	@sleep 5
	npm run dev

dev-docker: ## Start all services with Docker Compose
	docker-compose up -d
	@echo "✓ All services started"
	@echo ""
	@echo "Services running:"
	@echo "  API Gateway:      http://localhost:3000"
	@echo "  Valuation Service: http://localhost:3001"
	@echo "  Admin Portal:     http://localhost:3100"
	@echo "  PostgreSQL:       localhost:5432"
	@echo "  Redis:            localhost:6379"

# ============================================================================
# Service Management
# ============================================================================

start: ## Start services
	docker-compose up -d

stop: ## Stop services
	docker-compose down

restart: ## Restart services
	docker-compose restart

logs: ## View logs
	docker-compose logs -f

ps: ## Show running services
	docker-compose ps

# ============================================================================
# Database
# ============================================================================

migrate: ## Run database migrations
	docker-compose exec postgres psql -U axxiom_admin -d axxiom_dev -f /docker-entrypoint-initdb.d/001_initial_schema.sql
	@echo "✓ Migrations completed"

seed: ## Seed database with sample data
	docker-compose exec postgres psql -U axxiom_admin -d axxiom_dev -f /docker-entrypoint-initdb.d/002_seed_data.sql
	@echo "✓ Database seeded"

migrate-rollback: ## Rollback database migrations
	docker-compose exec postgres psql -U axxiom_admin -d axxiom_dev -f /docker-entrypoint-initdb.d/rollback_001.sql
	@echo "✓ Migrations rolled back"

db-shell: ## Open PostgreSQL shell
	docker-compose exec postgres psql -U axxiom_admin -d axxiom_dev

db-reset: migrate-rollback migrate seed ## Reset database (rollback, migrate, seed)
	@echo "✓ Database reset complete"

# ============================================================================
# Testing
# ============================================================================

test: ## Run all tests
	npm run test

test-unit: ## Run unit tests
	npm run test:unit

test-integration: ## Run integration tests
	npm run test:integration

test-e2e: ## Run E2E tests
	npm run test:e2e

test-coverage: ## Run tests with coverage
	npm run test:coverage

# ============================================================================
# Code Quality
# ============================================================================

lint: ## Run linter
	npm run lint

lint-fix: ## Fix linting issues
	npm run lint:fix

format: ## Format code
	npm run format

format-check: ## Check code formatting
	npm run format:check

typecheck: ## Type check TypeScript
	npm run typecheck

# ============================================================================
# Cleanup
# ============================================================================

clean: ## Clean build artifacts
	npm run clean
	@echo "✓ Build artifacts cleaned"

clean-all: clean ## Clean everything including node_modules and Docker volumes
	rm -rf node_modules
	docker-compose down -v
	@echo "✓ Everything cleaned"

# ============================================================================
# Infrastructure
# ============================================================================

infra-plan: ## Terraform plan
	cd infrastructure/terraform && terraform init && terraform plan

infra-apply: ## Terraform apply
	cd infrastructure/terraform && terraform apply

infra-destroy: ## Terraform destroy
	cd infrastructure/terraform && terraform destroy

# ============================================================================
# Utilities
# ============================================================================

init: install migrate seed ## Initialize project (install, migrate, seed)
	@echo "✓ Project initialized"
	@echo ""
	@echo "Next steps:"
	@echo "  make dev       - Start development servers"
	@echo "  make dev-docker - Start with Docker Compose"

health: ## Check health of all services
	@echo "Checking service health..."
	@curl -s http://localhost:3000/health | jq . || echo "✗ API Gateway not responding"
	@curl -s http://localhost:3001/health | jq . || echo "✗ Valuation Service not responding"
	@docker-compose exec postgres pg_isready -U axxiom_admin || echo "✗ PostgreSQL not ready"
	@docker-compose exec redis redis-cli ping || echo "✗ Redis not responding"
