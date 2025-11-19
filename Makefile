# Force bash just in case
SHELL := /bin/bash

# ────────────────────────────────
# Chord Atlas Development Makefile
# ────────────────────────────────
# Usage:
#   make dev        → start the full dev stack in background
#   make stop       → stop all running dev containers
#   make restart    → restart frontend + backend containers
#   make rebuild    → rebuild all images without cache
#   make logs       → follow combined logs of all containers
#   make backend    → restart only backend service
#   make frontend   → restart only frontend service
#   make clean      → remove containers, volumes, and networks
#   make dbshell    → open MySQL shell inside db container
#   make ps         → list running containers for dev stack
#   make prod       → start production stack
#   make login      → authenticate with Docker Hub
#   make build-images → build backend + frontend images for production
#   make push-images  → push built images to Docker Hub
#   make release      → build + push both images in one step
# ────────────────────────────────

DEV_FILE := docker-compose.dev.yml
PROD_FILE := docker-compose.yml

REGISTRY := amohall/chordatlas
TAG ?= latest

.PHONY: dev stop restart rebuild logs backend frontend clean dbshell ps prod \
        login build-images push-images release

# --- Development ---

dev:
	@echo "Starting Chord Atlas development environment..."
	docker compose -f $(DEV_FILE) up -d
	@echo "Development stack is up and running."

stop:
	@echo "Stopping all development containers..."
	docker compose -f $(DEV_FILE) down
	@echo "All containers stopped."

restart:
	@echo "Restarting frontend and backend services..."
	docker compose -f $(DEV_FILE) restart frontend backend
	@echo "Restart complete."

rebuild:
	@echo "Rebuilding all development images - no cache..."
	docker compose -f $(DEV_FILE) build --no-cache
	@echo "Rebuild complete."

backend:
	@echo "Restarting backend service..."
	docker compose -f $(DEV_FILE) restart backend
	@echo "Backend restarted."

frontend:
	@echo "Restarting frontend service..."
	docker compose -f $(DEV_FILE) restart frontend
	@echo "Frontend restarted."

logs:
	@echo "Showing logs for all containers. Press Ctrl+C to exit."
	docker compose -f $(DEV_FILE) logs -f

ps:
	@echo "Listing active development containers..."
	docker compose -f $(DEV_FILE) ps

clean:
	@echo "Cleaning environment: containers, volumes, and networks..."
	docker compose -f $(DEV_FILE) down -v --remove-orphans
	@echo "Cleanup complete."

dbshell:
	@echo "Opening MySQL shell inside database container..."
	docker exec -it chordatlas-db mysql -uroot -prootpass chordatlas

# --- Production ---

prod:
	@echo "Starting production stack..."
	docker compose -f $(PROD_FILE) up -d --build
	@echo "Production stack is running."

# --- Docker Image Management ---

login:
	@echo "Logging in to Docker Hub..."
	docker login

build-images:
	@echo "📦 Building backend and frontend images..."
	docker build -t $(REGISTRY)-backend:$(TAG) ./backend
	docker build -t $(REGISTRY)-frontend:$(TAG) ./frontend

	@echo "🔖 Tagging images as latest..."
	docker tag $(REGISTRY)-backend:$(TAG) $(REGISTRY)-backend:latest
	docker tag $(REGISTRY)-frontend:$(TAG) $(REGISTRY)-frontend:latest

	@echo "✅ Build complete: $(REGISTRY)-backend:$(TAG), $(REGISTRY)-frontend:$(TAG)"
	@echo "   Also tagged as: latest"

push-images:
	@echo "🚀 Pushing versioned images..."
	docker push $(REGISTRY)-backend:$(TAG)
	docker push $(REGISTRY)-frontend:$(TAG)

	@echo "🚀 Pushing latest tags..."
	docker push $(REGISTRY)-backend:latest
	docker push $(REGISTRY)-frontend:latest

	@echo "✅ Push complete: pushed $(TAG) and latest"

release: build-images push-images
	@echo "🎉 Release complete!"
	@echo "   → $(REGISTRY)-backend:$(TAG), $(REGISTRY)-backend:latest"
	@echo "   → $(REGISTRY)-frontend:$(TAG), $(REGISTRY)-frontend:latest"