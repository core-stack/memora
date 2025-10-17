# ==============================
# Base
# ==============================
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN apk update
RUN apk add --no-cache libc6-compat
RUN pnpm add -g turbo@2.5.8

# ==============================
# Builder
# ==============================
FROM base AS builder
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

# ==============================
# Runner
# ==============================
FROM base AS runner
ENV NODE_ENV=production
ENV SERVE_STATIC=/app/apps/frontend/dist
WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json

COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=builder /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/turbo.json ./turbo.json

CMD ["npm", "start:docker"]
