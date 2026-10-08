# ==============================================================================
# Multi-stage Dockerfile for Nexus Agent Swarm Runtime & Backend API
# ==============================================================================

FROM node:20-alpine AS base
WORKDIR /app

# Stage 1: Build agents TypeScript backend
FROM base AS builder
WORKDIR /app/agents
COPY agents/package*.json ./
RUN npm ci
COPY agents/ ./
RUN npm run build

# Stage 2: Production runtime image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app/agents
COPY agents/package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/agents/dist ./dist

EXPOSE 3001

CMD ["node", "dist/server.js"]
