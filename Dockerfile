# ==============================
# Base
# ==============================
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk update
RUN apk add --no-cache libc6-compat

# ==============================
# Builder
# ==============================
FROM base AS builder

WORKDIR /app

RUN pnpm add -g turbo@2.5.8
COPY . .

RUN turbo prune @snipet/backend --docker

FROM base AS installer

WORKDIR /app
ENV NODE_ENV=development

COPY --from=builder /app/out/json/ .

RUN pnpm add -g turbo@2.5.8
RUN pnpm install

COPY --from=builder /app/out/full/ ./full

WORKDIR /app/full

RUN pnpm add -g bunchee@6.4.0

RUN pnpm install -g @nestjs/cli

RUN pnpm install

RUN pnpm turbo run build

FROM base AS runner
ENV NODE_ENV=production

WORKDIR /app

# COPY --from=installer /app/full/apps/frontend/dist ./public
COPY --from=installer /app/full/apps/backend/dist ./dist
COPY --from=installer /app/full/apps/backend/node_modules ./node_modules
COPY --from=installer /app/full/apps/backend/package.json ./package.json
COPY --from=installer /app/full/apps/backend/pnpm-lock.yaml ./pnpm-lock.yaml


CMD ["node", "dist/src/main"]
