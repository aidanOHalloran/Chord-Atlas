import {
  Model,
  DataTypes,
  BelongsToManyAddAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
} from "sequelize";
import { sequelize } from "../db";
import { Chord } from "./Chord";

export class Song extends Model {
  declare id: number;
  declare title: string;
  declare artist: string;
  declare song_key: string;
  declare notes: string;

  // ✅ Add Sequelize association mixins
  declare addChord: BelongsToManyAddAssociationMixin<Chord, number>;
  declare setChords: BelongsToManySetAssociationsMixin<Chord, number>;
  declare getChords: BelongsToManyGetAssociationsMixin<Chord>;
}

Song.init(
  {
    title: { type: DataTypes.STRING, allowNull: false },
    artist: { type: DataTypes.STRING, allowNull: false },
    song_key: { type: DataTypes.STRING },
    notes: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    modelName: "Song",
    tableName: "songs", // force correct table name
    timestamps: false,  // (optional if you don’t use created_at/updated_at)
  }
);
