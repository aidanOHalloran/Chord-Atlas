import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Song extends Model {
  [x: string]: any;
}

Song.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    artist: { type: DataTypes.STRING, allowNull: false },
    song_key: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    tableName: "songs",
    timestamps: true,
  }
);
