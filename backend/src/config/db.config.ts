import dotenv from "dotenv";
dotenv.config();

export const DB_CONFIG = {
  HOST: process.env.DB_HOST || "localhost",
  PORT: Number(process.env.DB_PORT) || 3306,
  USER: process.env.DB_USER || "root",
  PASSWORD: process.env.DB_PASS || "rootpass",
  DATABASE: process.env.DB_NAME || "chordatlas",
  DIALECT: "mysql" as const,
  LOGGING: false,
};
