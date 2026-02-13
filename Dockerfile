FROM node:22-alpine AS base

RUN corepack enable

FROM base AS builder

WORKDIR /app

COPY package.json yarn.lock* ./

# Create .npmrc with token substitution
RUN --mount=type=secret,id=GITHUB_TOKEN \
    echo "@navikt:registry=https://npm.pkg.github.com" > .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/GITHUB_TOKEN)" >> .npmrc && \
    yarn install --immutable && \
    rm -f .npmrc

COPY . .

RUN yarn run build

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:25-slim AS runtime

WORKDIR /app

COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]


