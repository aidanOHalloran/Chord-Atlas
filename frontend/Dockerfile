# frontend/Dockerfile

# ---- Builder Stage ----
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# 1. Install build tools for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# 2. Copy package files and install dependencies (keep optional deps!)
COPY package*.json ./
RUN npm ci

# 3. Rebuild Rollup explicitly to fix native module resolution
RUN npm rebuild rollup --force || true

# 4. Copy app source and build
COPY . .
RUN npm run build

# ---- Nginx Runner Stage ----
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# 5. Copy production build
COPY --from=builder /app/dist ./

# 6. Optional: custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 7. Expose port and start server
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
