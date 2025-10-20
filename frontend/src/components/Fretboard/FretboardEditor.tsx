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
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);

  // 🎵 Standard tuning
  const tuning = allTunings["Standard (EADGBE)"].notes;
  const tooltips = getStringTooltips(tuning);

  const notes = tuning;
  const tips = tooltips;

  // 🧮 Auto finger suggestion (still applies automatically)
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
  }, [frets, autoAssign]);

  /**
   * 🔄 Click logic:
   * - Click empty fret → add note (finger 1)
   * - Click same fret again → clear (even if Auto Assign is ON)
   * - Manual mode only: cycle fingers 1→2→3→4→clear
   */
  const handleFretClick = (stringIndex: number, fret: number) => {
  const i = stringIndex; // no inversion
  const newFrets = [...frets];
  const newFingers = [...fingers];

  const currentFret = newFrets[i] ?? 0;
  const currentFinger = newFingers[i];

  let didPulseClear = false;

  if (currentFret === fret) {
    // Clicking the SAME fret again
    if (autoAssign) {
      // Auto mode: toggle OFF
      newFrets[i] = 0;
      newFingers[i] = null;
      didPulseClear = true;
    } else {
      // Manual mode: cycle 1→2→3→4→clear
      if (currentFinger == null || currentFinger === 0) {
        newFingers[i] = 1;
      } else if (currentFinger < 4) {
        newFingers[i] = currentFinger + 1;
      } else {
        newFrets[i] = 0;
        newFingers[i] = null;
        didPulseClear = true;
      }
    }
  } else if (currentFret === 0) {
    // Empty string → place note
    newFrets[i] = fret;
    newFingers[i] = 1; // start at 1 (autoAssign effect may refine later)
  } else {
    // Moving to a different fret on this string
    newFrets[i] = fret;
    newFingers[i] = 1;
  }

  onChange(newFrets, newFingers);

  setPulseIndex(i);
  setTimeout(() => setPulseIndex(null), didPulseClear ? 400 : 200);
};


  const toggleMute = (stringIndex: number) => {
    const actualIndex = stringIndex;
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

        {/* Strings */}
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: strings }).map((_, stringIndex) => {
            const fret = frets[stringIndex];
            const finger = fingers[stringIndex];
            const isMuted = fret === -1;
            const isOpen = fret === 0;
            const note = notes[stringIndex];
            const tooltip = tips[stringIndex];

            return (
              <div key={stringIndex} className="flex flex-col items-center group">
                {/* String label */}
                <span
                  className="text-[11px] text-blue-400 mb-1 font-semibold cursor-help"
                  title={tooltip}
                >
                  {note}
                </span>

                {/* Nut */}
                <div className="w-6 h-[2px] bg-neutral-600 mb-1 rounded" />

                {/* Frets */}
                {Array.from({ length: maxFrets }).map((_, fretIndex) => {
                  const fretNum = fretIndex + 1;
                  const active = fret === fretNum;
                  const isPulsing = pulseIndex === stringIndex;

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
        💡 Click frets to toggle on/off. In manual mode, repeated clicks cycle fingers (1–4).
      </p>
    </div>
  );
}
