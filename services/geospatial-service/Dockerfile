# Multi-stage Dockerfile for Geospatial Analytics Service
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY services/shared/package.json ./services/shared/
COPY services/geospatial-service/package.json ./services/geospatial-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/geospatial-service
COPY services/shared ./services/shared
COPY services/geospatial-service ./services/geospatial-service
WORKDIR /app/services/shared
RUN npm run build
WORKDIR /app/services/geospatial-service
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache dumb-init
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs services/shared/package.json ./services/shared/
COPY --chown=nodejs:nodejs services/geospatial-service/package.json ./services/geospatial-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/geospatial-service --omit=dev
COPY --from=builder --chown=nodejs:nodejs /app/services/shared/dist ./services/shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/services/geospatial-service/dist ./services/geospatial-service/dist
USER nodejs
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "require('http').get('http://localhost:3009/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
EXPOSE 3009
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "services/geospatial-service/dist/server.js"]
