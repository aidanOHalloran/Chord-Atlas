# Backend
docker build -t amohall/chordatlas-backend:latest ./backend
docker push amohall/chordatlas-backend:latest

# Frontend
docker build -t amohall/chordatlas-frontend:latest ./frontend
docker push amohall/chordatlas-frontend:latest


Then deploy with your updated production compose:

docker compose -f docker-compose.yml up -d