import { Song } from "./Song";
import { Chord } from "./Chord";
import { SongChord } from "./SongChord";

export function defineAssociations() {
  // ✅ Many-to-many: Songs ↔ Chords
  Song.belongsToMany(Chord, {
    through: SongChord,
    foreignKey: "song_id",
    otherKey: "chord_id",
  });

  Chord.belongsToMany(Song, {
    through: SongChord,
    foreignKey: "chord_id",
    otherKey: "song_id",
  });

  console.log("🎸 Associations defined: Song ↔ Chord");
}
