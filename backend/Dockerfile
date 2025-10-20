# backend/Dockerfile

# ---- Base Builder Stage ----
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# 1. Copy only dependency files first (better cache)
COPY package*.json tsconfig.json ./
RUN npm ci --omit=optional

# 2. Copy and build source
COPY src ./src
RUN npm run build

# ---- Runtime Stage ----
FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# 3. Copy only needed runtime files
COPY package*.json ./
RUN npm ci --omit=dev --omit=optional

# 4. Copy build output
COPY --from=builder /app/dist ./dist

# 5. Configure environment + expose port
ENV PORT=5000
EXPOSE 5000

# 6. Default CMD
CMD ["node", "dist/index.js"]
