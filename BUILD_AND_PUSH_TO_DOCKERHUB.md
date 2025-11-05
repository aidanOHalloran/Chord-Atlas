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