FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.0.0

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["pnpm", "start"]
