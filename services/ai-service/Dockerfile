# Multi-stage Dockerfile for AI Service
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY services/shared/package.json ./services/shared/
COPY services/ai-service/package.json ./services/ai-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/ai-service
COPY services/shared ./services/shared
COPY services/ai-service ./services/ai-service
WORKDIR /app/services/shared
RUN npm run build
WORKDIR /app/services/ai-service
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs services/shared/package.json ./services/shared/
COPY --chown=nodejs:nodejs services/ai-service/package.json ./services/ai-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/ai-service --omit=dev
COPY --from=builder --chown=nodejs:nodejs /app/services/shared/dist ./services/shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/services/ai-service/dist ./services/ai-service/dist
USER nodejs
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3006/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
EXPOSE 3006
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "services/ai-service/dist/server.js"]
