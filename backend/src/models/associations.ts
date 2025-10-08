import { Song } from "./Song";
import { Chord } from "./Chord";
import { SongChord } from "./SongChord";

export function defineAssociations() {
  Song.belongsToMany(Chord, { through: SongChord, foreignKey: "song_id" });
  Chord.belongsToMany(Song, { through: SongChord, foreignKey: "chord_id" });
}
