FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable
COPY package.json yarn.lock* ./

RUN yarn install --immutable

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


