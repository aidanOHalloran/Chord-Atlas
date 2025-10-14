import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Song extends Model {
  declare id: number;
  declare title: string;
  declare artist: string;
  declare song_key: string;
  declare notes?: string;
}

Song.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    artist: { type: DataTypes.STRING(255), allowNull: false },
    song_key: { type: DataTypes.STRING(10), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  { sequelize, tableName: "songs", timestamps: true, createdAt: "created_at", updatedAt: "updated_at" }
);
