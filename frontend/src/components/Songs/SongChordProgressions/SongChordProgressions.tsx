// src/components/Songs/SongChordProgressions/SongChordProgressions.tsx
import { motion } from "framer-motion";
import type { SongChordProgression, Chord } from "../../../types/models";
import ChordCard from "../../Chords/ChordCard/ChordCard";
import ChordProgressionOrderLabel from "./ChordProgressionOrderLabel";

interface SongChordProgressionsProps {
  progressions: SongChordProgression[];
  allChords: Chord[]; // all available chords (to map IDs → objects)
}

function getChordsFromIds(ids: number[] = [], allChords: Chord[] = []): Chord[] {
  if (!Array.isArray(allChords)) return [];
  return ids
    .map((id) => allChords.find((c) => c.id === id))
    .filter((c): c is Chord => !!c);
}

/**
 * Displays all chord progressions for a song, such as Intro, Verse, Chorus, etc.
 * Each section lists its name and associated chord sequence.
 */
export default function SongChordProgressions({
  progressions = [],
  allChords = [],
}: SongChordProgressionsProps) {
  if (!progressions.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-12"
    >
      <h3 className="text-2xl font-semibold text-blue-300 mb-4">
        Chord Progressions
      </h3>

      <div className="space-y-8">
        {progressions.map((progression) => {
          const chords = getChordsFromIds(progression.chord_ids, allChords);

          return (
            <div
              key={progression.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-inner hover:border-blue-700 transition-all"
            >
              <h4 className="text-xl font-semibold text-blue-400 mb-4">
                {progression.progression_name}

                {chords.length > 0 && (
                <ChordProgressionOrderLabel chords={chords} />
              )}
              </h4>

              

              {chords.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {chords.map((chord, index) => (
                    <ChordCard
                      key={`${progression.id}-${chord.id}-${index}`}
                      chord={chord}
                      onDelete={() => { }} // disabled for now
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No chords found for this progression.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
