# ==============================
# Base
# ==============================
FROM node:20-alpine AS base

ENV NODE_ENV=production
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

RUN turbo prune @memora/backend --docker

FROM base AS installer

WORKDIR /app

COPY --from=builder /app/out/json/ .

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN yarn turbo run build

FROM base AS runner
WORKDIR /app

COPY --from=installer /app/apps/frontend/dist ./public

COPY --from=installer /app/apps/backend/dist ./dist

CMD ["node", "dist/src/main"]
