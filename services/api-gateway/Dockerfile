# ============================================================================
# Multi-stage Dockerfile for API Gateway
# ============================================================================

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace root package files
COPY package*.json ./
COPY services/shared/package.json ./services/shared/
COPY services/api-gateway/package.json ./services/api-gateway/

# Install dependencies
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/api-gateway

# Copy source code
COPY services/shared ./services/shared
COPY services/api-gateway ./services/api-gateway

# Build shared library
WORKDIR /app/services/shared
RUN npm run build

# Build service
WORKDIR /app/services/api-gateway
RUN npm run build

# ============================================================================
# Stage 2: Production
# ============================================================================

FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs services/shared/package.json ./services/shared/
COPY --chown=nodejs:nodejs services/api-gateway/package.json ./services/api-gateway/

# Install production dependencies only
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/api-gateway --omit=dev

# Copy built artifacts from builder
COPY --from=builder --chown=nodejs:nodejs /app/services/shared/dist ./services/shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/services/api-gateway/dist ./services/api-gateway/dist

# Switch to app user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the service
CMD ["node", "services/api-gateway/dist/server.js"]
