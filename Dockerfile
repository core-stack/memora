
FROM node:20-alpine AS base

ARG APP_PORT=3100
ENV APP_PORT=${APP_PORT}
ARG DATABASE_URL=postgresql://postgres:postgres@db/postgres
ENV DATABASE_URL=${DATABASE_URL}

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN apk update
RUN apk add --no-cache libc6-compat
RUN pnpm add -g turbo@2.5.8

FROM base AS builder
WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm install bunchee@^6.4.0 --filter @snipet/schemas
RUN pnpm install bunchee@^6.4.0 --filter @snipet/permission

RUN pnpm generate:prompts
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV SERVE_STATIC=/app/apps/frontend/dist
WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/prompts ./apps/backend/prompts
COPY --from=builder /app/apps/backend/drizzle ./apps/backend/drizzle
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json

COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=builder /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=builder /app/apps/frontend/package.json ./apps/frontend/package.json

COPY --from=builder /app/packages/schemas/dist ./packages/schemas/dist
COPY --from=builder /app/packages/schemas/node_modules ./packages/schemas/node_modules
COPY --from=builder /app/packages/schemas/package.json ./packages/schemas/package.json

COPY --from=builder /app/packages/permission/dist ./packages/permission/dist
COPY --from=builder /app/packages/permission/node_modules ./packages/permission/node_modules
COPY --from=builder /app/packages/permission/package.json ./packages/permission/package.json

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/turbo.json ./turbo.json

EXPOSE ${APP_PORT}
CMD ["npm", "run", "start:prod"]
