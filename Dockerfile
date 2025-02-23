FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
RUN npm ci
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000
CMD ["npm", "start"]