# Multi-stage Dockerfile for Data Ingestion Service
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY services/shared/package.json ./services/shared/
COPY services/data-ingestion-service/package.json ./services/data-ingestion-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/data-ingestion-service
COPY services/shared ./services/shared
COPY services/data-ingestion-service ./services/data-ingestion-service
WORKDIR /app/services/shared
RUN npm run build
WORKDIR /app/services/data-ingestion-service
RUN npm run build

FROM node:20-alpine
# Install Chromium and Tesseract for web scraping and OCR
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    dumb-init

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs services/shared/package.json ./services/shared/
COPY --chown=nodejs:nodejs services/data-ingestion-service/package.json ./services/data-ingestion-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/data-ingestion-service --omit=dev
COPY --from=builder --chown=nodejs:nodejs /app/services/shared/dist ./services/shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/services/data-ingestion-service/dist ./services/data-ingestion-service/dist
USER nodejs
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3007/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
EXPOSE 3007
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "services/data-ingestion-service/dist/server.js"]
