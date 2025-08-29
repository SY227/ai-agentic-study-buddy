FROM node:20-alpine AS base
WORKDIR /app

FROM base AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN VITE_SERVER_URL="." npm run build

FROM base AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build

FROM base AS server-prod-deps
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
WORKDIR /app/server
ENV NODE_ENV=production
COPY --from=server-prod-deps /app/server/node_modules ./node_modules
COPY --from=server-build /app/server/dist ./dist
COPY --from=client-build /app/client/dist ./dist/public
EXPOSE 8080
CMD ["node", "dist/server.js"]
