import { Sequelize } from "sequelize";
import { DB_CONFIG } from "./config/db.config";

export const sequelize = new Sequelize(
  DB_CONFIG.DATABASE,
  DB_CONFIG.USER,
  DB_CONFIG.PASSWORD,
  {
    host: DB_CONFIG.HOST,
    port: DB_CONFIG.PORT,
    dialect: DB_CONFIG.DIALECT,
    logging: DB_CONFIG.LOGGING,
  }
);