# Multi-stage Dockerfile for Reporting Service
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY services/shared/package.json ./services/shared/
COPY services/reporting-service/package.json ./services/reporting-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/reporting-service
COPY services/shared ./services/shared
COPY services/reporting-service ./services/reporting-service
WORKDIR /app/services/shared
RUN npm run build
WORKDIR /app/services/reporting-service
RUN npm run build

FROM node:20-alpine
# Install Chromium for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs services/shared/package.json ./services/shared/
COPY --chown=nodejs:nodejs services/reporting-service/package.json ./services/reporting-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/reporting-service --omit=dev
COPY --from=builder --chown=nodejs:nodejs /app/services/shared/dist ./services/shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/services/reporting-service/dist ./services/reporting-service/dist
USER nodejs
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3005/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
EXPOSE 3005
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "services/reporting-service/dist/server.js"]
