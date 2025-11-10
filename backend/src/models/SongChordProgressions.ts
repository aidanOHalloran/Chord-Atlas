import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class SongChordProgression extends Model {}

SongChordProgression.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        song_id: { type: DataTypes.INTEGER, allowNull: false },
        progression_name: { type: DataTypes.STRING, allowNull: false },
        chord_ids: { type: DataTypes.JSON, allowNull: false },
    },
    {
        sequelize,
        tableName: "song_chord_progressions",
        timestamps: false,
    }
)