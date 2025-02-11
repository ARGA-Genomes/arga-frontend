FROM node:23-alpine as builder
LABEL org.opencontainers.image.source="https://github.com/ARGA-Genomes/arga-frontend"
LABEL org.opencontainers.image.description="A container image running the frontend server"
LABEL org.opencontainers.image.licenses="AGPL-3.0"

WORKDIR /usr/src/arga-frontend
COPY . .
RUN npm install -g pnpm && pnpm install && pnpm build && pnpm --legacy --filter arga-frontend --prod deploy pruned


FROM node:23-alpine
WORKDIR /usr/src/arga-frontend

EXPOSE 3000
CMD ["pnpm", "start"]
RUN npm install -g pnpm

COPY --from=builder /usr/src/arga-frontend/.next ./.next
COPY --from=builder /usr/src/arga-frontend/pruned/node_modules ./node_modules
COPY --from=builder /usr/src/arga-frontend/pruned/public ./public
COPY --from=builder /usr/src/arga-frontend/pruned/package.json ./
COPY --from=builder /usr/src/arga-frontend/pruned/next.config.js ./
