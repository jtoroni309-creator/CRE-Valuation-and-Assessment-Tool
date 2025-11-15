# Multi-stage Dockerfile for Computer Vision Service
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY services/shared/package.json ./services/shared/
COPY services/computer-vision-service/package.json ./services/computer-vision-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/computer-vision-service
COPY services/shared ./services/shared
COPY services/computer-vision-service ./services/computer-vision-service
WORKDIR /app/services/shared
RUN npm run build
WORKDIR /app/services/computer-vision-service
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache dumb-init vips-dev
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs services/shared/package.json ./services/shared/
COPY --chown=nodejs:nodejs services/computer-vision-service/package.json ./services/computer-vision-service/
RUN npm ci --workspace=@axxiom/shared --workspace=@axxiom/computer-vision-service --omit=dev
COPY --from=builder --chown=nodejs:nodejs /app/services/shared/dist ./services/shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/services/computer-vision-service/dist ./services/computer-vision-service/dist
USER nodejs
HEALTHCHECK --interval=30s --timeout=3s CMD node -e "require('http').get('http://localhost:3008/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
EXPOSE 3008
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "services/computer-vision-service/dist/server.js"]
