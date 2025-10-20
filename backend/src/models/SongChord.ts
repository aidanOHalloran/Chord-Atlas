import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Song } from "./Song";
import { Chord } from "./Chord";

export class SongChord extends Model {}

SongChord.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    song_id: { type: DataTypes.INTEGER, allowNull: false },
    chord_id: { type: DataTypes.INTEGER, allowNull: false },
    position: { type: DataTypes.INTEGER },
  },
  {
    sequelize,
    tableName: "song_chords",
    timestamps: false,
  }
);

