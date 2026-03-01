FROM node:20-slim AS base

# Install Python and rembg
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-pip python3-venv curl && \
    python3 -m venv /opt/rembg-venv && \
    /opt/rembg-venv/bin/pip install --no-cache-dir "rembg[cpu,cli]" && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV PATH="/opt/rembg-venv/bin:$PATH"

# Pre-download the U2Net model
RUN rembg d

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
