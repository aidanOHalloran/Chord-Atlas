🧱 Part 1 — Project Overview

Stack:

    Frontend: React + Vite + TypeScript
    Backend: Node.js + Express + TypeScript
    Database: MySQL (running in Docker)

You’ll end up with this structure:

~/docker/projects/chordatlas/
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   └── models/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── docker-compose.yml
└── README.md

=============================================================
⚙️ Part 2 — Setup MySQL in Docker
1️⃣ Create the compose file

~/docker/projects/chordatlas/docker-compose.yml

version: "3.9"
services:
  db:
    image: mysql:8.0
    container_name: chordatlas-db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: chordatlas
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:

2️⃣ Start the database
cd ~/docker/projects/chordatlas
docker compose up -d

3️⃣ Test it
docker exec -it chordatlas-db mysql -uroot -prootpass -e "SHOW DATABASES;"

You should see chordatlas.

=============================================================
🧠 Part 3 — Create Backend (Node + Express + TypeScript)
1️⃣ Initialize
cd ~/docker/projects/chordatlas
mkdir backend && cd backend
npm init -y
npm install express cors dotenv mysql2 sequelize
npm install -D typescript ts-node-dev @types/node @types/express
npx tsc --init

2️⃣ Edit tsconfig.json

Change:

{
  "target": "ES2020",
  "module": "commonjs",
  "outDir": "dist",
  "rootDir": "src",
  "esModuleInterop": true,
  "strict": true
}

3️⃣ Create basic API

src/index.ts

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ChordAtlas backend running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

4️⃣ Add package.json scripts
"scripts": {
  "dev": "ts-node-dev --respawn src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}

5️⃣ Start backend
npm run dev


Check: http://localhost:5000

=============================================================
🎨 Part 4 — Create Frontend (React + Vite + TS)
1️⃣ Create app
cd ~/docker/projects/chordatlas
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

2️⃣ Run it
npm run dev


Vite starts on port 5173.

Visit http://localhost:5173

=============================================================
🔗 Part 5 — Connect Backend ↔ DB

Later you’ll add Sequelize models + routes to handle songs, chords, etc.

Example connection (src/db.ts):

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("chordatlas", "root", "rootpass", {
  host: "localhost",
  dialect: "mysql",
});


Then test it in index.ts:

import { sequelize } from "./db";
sequelize.authenticate().then(() => console.log("DB connected!"));

=============================================================
🚀 Part 6 — End-to-End Run Flow

From your WSL terminal:

# 1. Start MySQL container
cd ~/docker/projects/chordatlas
docker compose up -d

# 2. Start backend
cd backend
npm run dev

# 3. Start frontend
cd ../frontend
npm run dev


Then open:

Frontend: http://localhost:5173

Backend API: http://localhost:5000

Database: running in Docker

🧭 Part 7 — Next Steps (Optional)

Add Sequelize models for songs/chords.

Add a /songs REST route (CRUD).

Connect frontend via Axios or Fetch.

Dockerize backend + frontend for deployment to lab-util later.