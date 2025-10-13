import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./db";
import songRoutes from "./routes/songRoutes";
import chordRoutes from "./routes/chordRoutes";
import {defineAssociations} from "./models/associations";

dotenv.config();
defineAssociations();
const app = express();

// CORS setup — allow both Docker internal and host access
app.use(cors({
  origin: [
    "http://localhost:5173",       // when you run locally
    "http://127.0.0.1:5173",       // local access
    "http://frontend:5173"         // internal Docker network name
  ],
  credentials: true
}));

app.use(express.json());

// Base routes
app.use("/api/songs", songRoutes);
app.use("/api/chords", chordRoutes);

// Health check route
app.get("/", (_, res) => res.send("ChordAtlas backend running!"));

// Connect DB and start server
const PORT = Number(process.env.PORT) || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("🔄 Models synced with DB");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
  }
})();
