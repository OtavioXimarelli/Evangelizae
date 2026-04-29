# Build stage
FROM node:20.18-bullseye-slim AS builder

# Install pnpm
RUN npm install -g pnpm@10

# Set working directory to workspace root
WORKDIR /workspace

# Do not force production yet — install needs devDependencies for build
ENV NEXT_TELEMETRY_DISABLED=1

# Use a pnpm store inside the container for determinism
ENV PNPM_HOME="/workspace/.pnpm-store"
ENV PNPM_STORE_PATH="/workspace/.pnpm-store"

# Copy workspace files (monorepo structure)
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY . ./

# Install dependencies (ensure devDependencies are present for the Next.js build)
# Temporarily set NODE_ENV=development so devDependencies are installed.
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile --store-dir /workspace/.pnpm-store

# Build the application in production mode
ENV NODE_ENV=production
ENV NEXT_DISABLE_TURBOPACK=1
RUN pnpm run build

# Production stage
FROM node:20.18-bullseye-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /workspace/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /workspace/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /workspace/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
