| Step | Command                   | Description                                    |
| ---- | ------------------------- | ---------------------------------------------- |
| 1    | `make login`              | Log into Docker Hub                            |
| 2    | `make build-images`       | Build backend + frontend images                |
| 3    | `make push-images`        | Push both images to Docker Hub                 |
| 4    | `make release TAG=vX.Y.Z` | Build + push with version tag                  |
| 5    | `make prod`               | Deploy production stack with Docker Hub images |



   #############################
            NEW VERSION
   #############################

# Authenticate first (once per session)
make login

# Build both images (frontend + backend)
make build-images

# Push them to Docker Hub
make push-images

# Or do both in one go:
make release TAG=v#.#.#

# Run production stack using pushed images
make prod


   #############################
      OLD VERSION STILL WORKS
   #############################

# Backend
docker build -t amohall/chordatlas-backend:latest ./backend
docker push amohall/chordatlas-backend:latest

# Frontend
docker build -t amohall/chordatlas-frontend:latest ./frontend
docker push amohall/chordatlas-frontend:latest


Then deploy with your updated production compose:

docker compose -f docker-compose.yml up -d