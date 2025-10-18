import { useEffect, useState } from "react";
import { allTunings, getStringTooltips } from "../../static/guitarTunings";
import { motion } from "framer-motion";

interface Props {
  frets: number[];
  fingers: (number | null)[];
  onChange: (frets: number[], fingers: (number | null)[]) => void;
}

export default function FretboardEditor({ frets, fingers, onChange }: Props) {
  const strings = 6;
  const maxFrets = 5;
  const [autoAssign, setAutoAssign] = useState(true);
  const [pulseIndex, setPulseIndex] = useState<number | null>(null); // 🔹 Track recent change

  // 🎵 Standard tuning
  const currentTuning = allTunings["Standard (EADGBE)"].notes;
  const stringTooltips = getStringTooltips(currentTuning);

  // Reverse for correct display (high E → right)
  const reversedNotes = [...currentTuning].reverse();
  const reversedTips = [...stringTooltips].reverse();
  const reversedFrets = [...frets].reverse();
  const reversedFingers = [...fingers].reverse();

  // 🧮 Auto finger suggestion
  useEffect(() => {
    if (!autoAssign) return;
    const activeFrets = frets.filter((f) => f > 0);
    if (activeFrets.length === 0) return;

    const minFret = Math.min(...activeFrets);
    const newFingers = [...fingers];

    frets.forEach((fret, idx) => {
      if (fret > 0) {
        const finger = fret - minFret + 1;
        newFingers[idx] = finger >= 1 && finger <= 4 ? finger : 4;
      } else {
        newFingers[idx] = null;
      }
    });

    onChange(frets, newFingers);
  }, [frets]);

  /**
   * 🔄 Click logic:
   * - Click empty fret → add note (finger 1)
   * - Click again → cycle fingers 1→2→3→4
   * - After 4 → clear note
   */
  const handleFretClick = (stringIndex: number, fret: number) => {
    const actualIndex = strings - 1 - stringIndex;

    // clone fresh copies
    const newFrets = [...frets];
    const newFingers = [...fingers];

    let cycled = false;

    // pull current values directly from clones
    const currentFret = newFrets[actualIndex] ?? 0;
    const currentFinger = newFingers[actualIndex];

    // 🎸 CASE 1: empty → add note, finger 1
    if (currentFret === 0) {
      newFrets[actualIndex] = fret;
      newFingers[actualIndex] = 1;
    }

    // 🎸 CASE 2: same fret clicked again → cycle fingers
    else if (currentFret === fret) {
      if (currentFinger == null || currentFinger === 0) {
        newFingers[actualIndex] = 1;
      } else if (currentFinger < 4) {
        newFingers[actualIndex] = currentFinger + 1;
      } else {
        // after 4 → clear
        newFrets[actualIndex] = 0;
        newFingers[actualIndex] = null;
        cycled = true;
      }
    }

    // 🎸 CASE 3: moved to new fret → set new note, finger 1
    else {
      newFrets[actualIndex] = fret;
      newFingers[actualIndex] = 1;
    }

    // apply immediately
    onChange([...newFrets], [...newFingers]);

    // simple pulse feedback
    setPulseIndex(actualIndex);
    setTimeout(() => setPulseIndex(null), cycled ? 400 : 200);
  };

  const toggleMute = (stringIndex: number) => {
    const actualIndex = strings - 1 - stringIndex;
    const newFrets = [...frets];
    newFrets[actualIndex] = newFrets[actualIndex] === -1 ? 0 : -1;
    onChange(newFrets, fingers);
  };

  return (
    <div className="flex flex-col items-center mt-6">
      {/* 🎛️ Controls */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm text-gray-300 font-medium">
          Auto Assign Fingers:
        </label>
        <input
          type="checkbox"
          checked={autoAssign}
          onChange={() => setAutoAssign(!autoAssign)}
          className="w-4 h-4 accent-blue-600"
        />
      </div>

      {/* 🎸 Fretboard */}
      <div className="flex">
        {/* Fret numbers */}
        <div className="flex flex-col justify-center mr-2">
          {Array.from({ length: maxFrets }).map((_, i) => (
            <div
              key={i}
              className="h-8 flex items-center justify-end pr-1 text-[11px] text-gray-500"
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Strings + frets */}
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
                {/* String label */}
                <span
                  className="text-[11px] text-blue-400 mb-1 font-semibold cursor-help"
                  title={tooltip}
                >
                  {note}
                </span>

                {/* Nut (top bar) */}
                <div className="w-6 h-[2px] bg-neutral-600 mb-1 rounded" />

                {/* Frets */}
                {Array.from({ length: maxFrets }).map((_, fretIndex) => {
                  const fretNum = fretIndex + 1;
                  const active = fret === fretNum;
                  const isPulsing = pulseIndex === strings - 1 - stringIndex;

                  return (
                    <motion.div
                      key={fretNum}
                      onClick={() => handleFretClick(stringIndex, fretNum)}
                      initial={false}
                      animate={
                        isPulsing
                          ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
                          : { scale: 1, opacity: 1 }
                      }
                      transition={{
                        duration: isPulsing ? 0.4 : 0.15,
                        ease: "easeOut",
                      }}
                      className={`w-6 h-6 flex items-center justify-center rounded-full border mb-1 text-[11px] cursor-pointer transition
                        ${active
                          ? "bg-blue-600 border-blue-400 text-white"
                          : "bg-neutral-800 border-neutral-700 hover:border-blue-500"
                        }`}
                    >
                      {active ? finger ?? fretNum : ""}
                    </motion.div>
                  );
                })}

                {/* Open / mute indicator */}
                <span
                  onClick={() => toggleMute(stringIndex)}
                  className="text-[11px] text-gray-400 mt-1 select-none cursor-pointer"
                  title="Click to mute/unmute string"
                >
                  {isMuted ? "X" : isOpen ? "O" : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-gray-400 mt-4 italic text-center">
        💡 Click frets to toggle or cycle fingers (1–4). Hover string labels for tuning info.
      </p>
    </div>
  );
}
