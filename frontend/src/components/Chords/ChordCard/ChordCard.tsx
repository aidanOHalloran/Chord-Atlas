import type { Chord } from "../../../types/models";
import { allTunings, getStringTooltips } from "../../../static/guitarTunings";
import { Link } from "react-router-dom";

interface Props {
  chord: Chord;
  onDelete: (id: number) => void;
}

export default function ChordCard({ chord, onDelete }: Props) {
  const strings = 6;
  const maxFrets = 5;

  // 🎵 Shared tuning logic
  const currentTuning = allTunings["Standard (EADGBE)"].notes;
  const stringTooltips = getStringTooltips(currentTuning);

  // Reverse for right-to-left display
  const reversedNotes = [...currentTuning]
  const reversedTips = [...stringTooltips].reverse();

  const frets = chord.frets?.map((f) => Number(f)) ?? [];
  const fingers = chord.fingers ?? [];
  const reversedFrets = [...frets].reverse();
  const reversedFingers = [...fingers].reverse();

  return (
    <Link
      to={`/chords/${chord.id}`}
      className="block bg-neutral-900 p-4 rounded-xl shadow-md border border-neutral-700 hover:border-blue-500 hover:shadow-lg transition transform hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-3">
        <h3 className="text-lg font-semibold text-blue-300">{chord.name}</h3>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(chord.id);
          }}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/40 hover:text-white transition"
          title="Delete chord"
        >
          ✕
        </button>

      </div>

      {/* 🎸 Mini fretboard with fret numbers */}
      <div className="flex justify-center">
        {/* Fret number labels (1–5) */}
        <div className="flex flex-col justify-center mr-2">
          {Array.from({ length: maxFrets }).map((_, fretIndex) => (
            <div
              key={fretIndex}
              className="h-5 flex items-center justify-end pr-1 text-[10px] text-gray-500"
            >
              {fretIndex + 1}
            </div>
          ))}
        </div>

        {/* Fret grid */}
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: strings }).map((_, stringIndex) => {
            const fret = reversedFrets[stringIndex];
            const finger = reversedFingers[stringIndex];
            const isMuted = fret === -1;
            const isOpen = fret === 0;
            const note = reversedNotes[stringIndex];
            const tooltip = reversedTips[stringIndex];

            return (
              <div key={stringIndex} className="flex flex-col items-center group">
                {/* String name with tooltip */}
                <span
                  className="text-[10px] text-blue-400 mb-1 font-semibold cursor-help"
                  title={tooltip}
                >
                  {note}
                </span>

                {/* Frets 1–5 */}
                {Array.from({ length: maxFrets }).map((_, fretIndex) => {
                  const fretNum = fretIndex + 1;
                  const active = fret === fretNum;

                  return (
                    <div
                      key={fretNum}
                      className={`w-5 h-5 flex items-center justify-center rounded-full border mb-1 text-[10px] ${active
                          ? "bg-blue-600 border-blue-400 text-white"
                          : "bg-neutral-800 border-neutral-700"
                        }`}
                    >
                      {active ? finger ?? fretNum : ""}
                    </div>
                  );
                })}

                {/* Open/mute indicator */}
                <span className="text-[10px] text-white mt-1 select-none">
                  {isMuted ? "X" : isOpen ? "O" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-3 text-center">
        Variation {chord.variation ?? 1}, Position {chord.position ?? 0}
      </p>
    </Link>
  );
}
