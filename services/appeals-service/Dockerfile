# Multi-stage Dockerfile for Appeals Service
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY services/shared/package.json ./services/shared/
COPY services/appeals-service/package.json ./services/appeals-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/appeals-service
COPY services/shared ./services/shared
COPY services/appeals-service ./services/appeals-service
WORKDIR /app/services/shared
RUN npm run build
WORKDIR /app/services/appeals-service
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs services/shared/package.json ./services/shared/
COPY --chown=nodejs:nodejs services/appeals-service/package.json ./services/appeals-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/appeals-service --omit=dev
COPY --from=builder --chown=nodejs:nodejs /app/services/shared/dist ./services/shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/services/appeals-service/dist ./services/appeals-service/dist
USER nodejs
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3004/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
EXPOSE 3004
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "services/appeals-service/dist/server.js"]
