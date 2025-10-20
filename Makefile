# ────────────────────────────────
# Chord Atlas Development Makefile
# ────────────────────────────────
# Usage:
#   make dev        → start the full dev stack in background
#   make stop       → stop all running dev containers
#   make restart    → restart frontend + backend containers
#   make rebuild    → rebuild all images (no cache)
#   make logs       → follow combined logs of all containers
#   make backend    → restart only backend service
#   make frontend   → restart only frontend service
#   make clean      → remove containers, volumes, and networks
#   make dbshell    → open MySQL shell inside db container
#   make ps         → list running containers for dev stack
#   make prod       → start production stack
# ────────────────────────────────

DEV_FILE = docker-compose.dev.yml
PROD_FILE = docker-compose.yml

.PHONY: dev stop restart rebuild logs backend frontend clean dbshell ps prod

# --- Development ---

dev:
	@echo Starting Chord Atlas development environment...
	docker compose -f $(DEV_FILE) up -d
	@echo Development stack is up and running.

stop:
	@echo Stopping all development containers...
	docker compose -f $(DEV_FILE) down
	@echo All containers stopped.

restart:
	@echo Restarting frontend and backend services...
	docker compose -f $(DEV_FILE) restart frontend backend
	@echo Restart complete.

rebuild:
	@echo Rebuilding all development images (no cache)...
	docker compose -f $(DEV_FILE) build --no-cache
	@echo Rebuild complete.

backend:
	@echo Restarting backend service...
	docker compose -f $(DEV_FILE) restart backend
	@echo Backend restarted.

frontend:
	@echo Restarting frontend service...
	docker compose -f $(DEV_FILE) restart frontend
	@echo Frontend restarted.

logs:
	@echo Showing logs for all containers. Press Ctrl+C to exit.
	docker compose -f $(DEV_FILE) logs -f

ps:
	@echo Listing active development containers...
	docker compose -f $(DEV_FILE) ps

clean:
	@echo Cleaning environment (containers, volumes, networks)...
	docker compose -f $(DEV_FILE) down -v --remove-orphans
	@echo Cleanup complete.

dbshell:
	@echo Opening MySQL shell inside database container...
	docker exec -it chordatlas-db mysql -uroot -prootpass chordatlas

# --- Production ---

prod:
	@echo Starting production stack...
	docker compose -f $(PROD_FILE) up -d --build
	@echo Production stack is running.
