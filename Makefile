# /Makefile

dev:
	docker compose -f docker-compose.dev.yml up -d

stop:
	docker compose -f docker-compose.dev.yml down

rebuild:
	docker compose -f docker-compose.dev.yml build --no-cache

restart:
	docker compose -f docker-compose.dev.yml restart frontend backend

prod:
	docker compose -f docker-compose.yml up -d --build
