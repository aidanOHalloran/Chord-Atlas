import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Chord extends Model {
  [x: string]: any;
}

Chord.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    frets: { type: DataTypes.JSON },
    fingers: { type: DataTypes.JSON },
  },
  {
    sequelize,
    tableName: "chords",
    timestamps: true,
  }
);
