FROM node:22-alpine AS base

RUN corepack enable

FROM base AS builder

WORKDIR /app

COPY package.json yarn.lock* .yarnrc.yml ./

RUN --mount=type=secret,id=GITHUB_TOKEN \
    NPM_AUTH_TOKEN=$(cat /run/secrets/GITHUB_TOKEN) yarn install --immutable

COPY . .
RUN yarn run build

FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]


