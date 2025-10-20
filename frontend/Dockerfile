# frontend/Dockerfile

# ---- Builder Stage ----
FROM node:20-bullseye-slim AS builder
WORKDIR /app

# 1. Install dependencies
COPY package*.json ./
RUN npm ci --omit=optional

# 2. Copy source and build
COPY . .
RUN npm run build

# ---- Nginx Runner Stage ----
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# 3. Copy production build from builder
COPY --from=builder /app/dist ./

# 4. Copy custom nginx config if you have one (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 5. Expose and start
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
