import { Song } from "./Song";
import { Chord } from "./Chord";
import { SongChord } from "./SongChord";
import { ChordTimeline } from "./ChordTimeline";

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

  // One song → many chord timeline entries
  Song.hasMany(ChordTimeline, { foreignKey: "song_id", as: "timeline" });
  ChordTimeline.belongsTo(Song, { foreignKey: "song_id", as: "song" });
}
