FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

# Create .npmrc with token substitution
RUN --mount=type=secret,id=GITHUB_TOKEN \
    --mount=type=cache,id=pnpm,target=/pnpm/store \
    echo "@navikt:registry=https://npm.pkg.github.com" > .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=$(cat /run/secrets/GITHUB_TOKEN)" >> .npmrc && \
    pnpm install --frozen-lockfile && \
    rm -f .npmrc

COPY . .
RUN pnpm run build

FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]


