# Multi-stage Dockerfile for Assessment Service
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY services/shared/package.json ./services/shared/
COPY services/assessment-service/package.json ./services/assessment-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/assessment-service
COPY services/shared ./services/shared
COPY services/assessment-service ./services/assessment-service
WORKDIR /app/services/shared
RUN npm run build
WORKDIR /app/services/assessment-service
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs services/shared/package.json ./services/shared/
COPY --chown=nodejs:nodejs services/assessment-service/package.json ./services/assessment-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/assessment-service --omit=dev
COPY --from=builder --chown=nodejs:nodejs /app/services/shared/dist ./services/shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/services/assessment-service/dist ./services/assessment-service/dist
USER nodejs
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3003/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
EXPOSE 3003
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "services/assessment-service/dist/server.js"]
