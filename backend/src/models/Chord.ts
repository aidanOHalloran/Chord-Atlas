import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Chord extends Model {
  declare id: number;
  declare name: string;
  declare frets?: object;
  declare fingers?: object;
  declare position?: number;
  declare variation?: number;
}

Chord.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    frets: { type: DataTypes.JSON, allowNull: true },
    fingers: { type: DataTypes.JSON, allowNull: true },
    position: { type: DataTypes.INTEGER, defaultValue: 0 },
    variation: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  { sequelize, tableName: "chords", timestamps: false }
);
