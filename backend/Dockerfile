# ---- Builder ----
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Install deps for build
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

# Build TypeScript
COPY src ./src
RUN npm run build

# ---- Runner ----
FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only prod deps for runtime
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled JS
COPY --from=builder /app/dist ./dist

# App port (matches your Express server)
EXPOSE 5000

# Environment variables will come from docker-compose later:
#   DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT, PORT
CMD ["node", "dist/index.js"]
