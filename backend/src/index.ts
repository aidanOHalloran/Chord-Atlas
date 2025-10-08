import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🧩 Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || "chordatlas",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "rootpass",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  }
);

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

app.get("/", (req, res) => {
  res.send("ChordAtlas backend running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
