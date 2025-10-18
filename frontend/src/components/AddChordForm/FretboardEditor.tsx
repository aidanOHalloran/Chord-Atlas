import { useState, useEffect } from "react";

interface Props {
  frets: number[];
  fingers: (number | null)[];
  onChange: (frets: number[], fingers: (number | null)[]) => void;
}

export default function FretboardEditor({ frets, fingers, onChange }: Props) {
  const strings = 6;
  const maxFrets = 5;
  const [activeFingerSelect, setActiveFingerSelect] = useState<number | null>(null);
  const [autoAssign, setAutoAssign] = useState(true);

  // 🔹 Auto finger suggestion logic
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frets]);

  const handleFretClick = (stringIndex: number, fret: number) => {
    const newFrets = [...frets];
    newFrets[stringIndex] = newFrets[stringIndex] === fret ? 0 : fret;
    onChange(newFrets, fingers);
    setActiveFingerSelect(stringIndex);
  };

  const assignFinger = (stringIndex: number, finger: number | null) => {
    const newFingers = [...fingers];
    newFingers[stringIndex] = finger;
    onChange(frets, newFingers);
    setActiveFingerSelect(null);
  };

  const toggleMute = (stringIndex: number) => {
    const newFrets = [...frets];
    newFrets[stringIndex] = newFrets[stringIndex] === -1 ? 0 : -1;
    onChange(newFrets, fingers);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {/* 🔘 Auto-assign toggle */}
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

      {/* 🎸 Fretboard grid */}
      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: strings }).map((_, stringIndex) => {
          const fret = frets[stringIndex];
          const isMuted = fret === -1;
          const isOpen = fret === 0;
          const finger = fingers[stringIndex];

          return (
            <div key={stringIndex} className="flex flex-col items-center relative">
              <span className="text-xs text-gray-500 mb-1">
                      String {6 - stringIndex}
              </span>
              {Array.from({ length: maxFrets }).map((_, fretIndex) => {
                const fretNum = fretIndex + 1;
                const active = fret === fretNum;

                return (
                  <div key={fretIndex} className="relative">
                    <div
                      onClick={() => handleFretClick(stringIndex, fretNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer mb-1 transition
                        ${active
                          ? "bg-blue-600 border-blue-400 text-white"
                          : "bg-neutral-800 border-neutral-700 hover:border-blue-500 text-gray-300"
                        }`}
                    >
                      {active ? (finger ?? fretNum) : ""}
                    </div>

                    {/* Finger selector popup */}
                    {activeFingerSelect === stringIndex && active && (
                      <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-md shadow-md z-10 flex">
                        {[1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            onClick={() => assignFinger(stringIndex, num)}
                            className={`px-2 py-1 text-sm hover:bg-blue-600 hover:text-white ${finger === num ? "bg-blue-700 text-white" : "text-gray-300"
                              }`}
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          onClick={() => assignFinger(stringIndex, null)}
                          className="px-2 py-1 text-sm text-gray-400 hover:bg-red-600 hover:text-white"
                          title="Clear"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Open/mute toggle */}
              <div
                className="text-xs text-gray-400 mt-1 cursor-pointer select-none"
                onClick={() => toggleMute(stringIndex)}
                title="Click to mute/unmute string"
              >
                {isMuted ? "X" : isOpen ? "O" : ""}
              </div>

            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-400 mt-4 italic">
        💡 Click frets to add notes. Assign fingers manually or toggle auto mode.
      </p>
    </div>
  );
}
