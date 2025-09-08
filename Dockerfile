FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/
COPY packages/*/package.json packages/*/

RUN npm install -g pnpm

# TODO - use pnpm with frozen lockfile
RUN pnpm install

COPY . .

RUN pnpm --filter frontend build

RUN pnpm --filter backend build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/apps/backend/dist ./backend/dist
COPY --from=builder /app/apps/backend/package.json ./backend/
COPY --from=builder /app/apps/frontend/dist ./frontend

EXPOSE 3000

CMD ["node", "backend/dist/main.js"]
