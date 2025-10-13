# ---- Builder Stage ----
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# Copy dependency manifests and install
COPY package*.json ./
RUN npm ci

# Copy the rest of the app and build
COPY . .
RUN npm run build

# ---- Runner Stage ----
FROM node:20-bullseye-slim AS runner
WORKDIR /app

# Install a minimal static server
RUN npm install -g serve

# Copy build output from builder
COPY --from=builder /app/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173", "--single"]
