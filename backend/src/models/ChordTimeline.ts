import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class ChordTimeline extends Model {
  declare id: number;
  declare song_id: number;
  declare chord_name: string;
  declare start_time: number;
  declare end_time: number;
}

ChordTimeline.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    song_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chord_name: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ChordTimeline",
    tableName: "chord_timeline",
    timestamps: false,
  }
);
