// Handles one string’s frets, mute/open, and popup

import FretButton from "./FretButton";
import FingerPopup from "./FingerPopup";

interface Props {
  stringIndex: number;
  frets: number[];
  fingers: (number | null)[];
  activeFingerSelect: number | null;
  setActiveFingerSelect: (idx: number | null) => void;
  onChange: (frets: number[], fingers: (number | null)[]) => void;
}

export default function StringColumn({
  stringIndex, frets, fingers, activeFingerSelect, setActiveFingerSelect, onChange
}: Props) {
  const maxFrets = 5;
  const fret = frets[stringIndex];
  const finger = fingers[stringIndex];
  const isMuted = fret === -1;
  const isOpen = fret === 0;

  const handleFretClick = (fretNum: number) => {
    const newFrets = [...frets];
    newFrets[stringIndex] = newFrets[stringIndex] === fretNum ? 0 : fretNum;
    onChange(newFrets, fingers);
    setActiveFingerSelect(stringIndex);
  };

  const assignFinger = (fingerNum: number | null) => {
    const newFingers = [...fingers];
    newFingers[stringIndex] = fingerNum;
    onChange(frets, newFingers);
    setActiveFingerSelect(null);
  };

  const toggleMute = () => {
    const newFrets = [...frets];
    newFrets[stringIndex] = newFrets[stringIndex] === -1 ? 0 : -1;
    onChange(newFrets, fingers);
  };

  return (
    <div className="flex flex-col items-center relative">
      <span className="text-xs text-gray-500 mb-1">String {6 - stringIndex}</span>
      {Array.from({ length: maxFrets }).map((_, idx) => {
        const fretNum = idx + 1;
        const active = fret === fretNum;
        return (
          <div key={idx} className="relative">
            <FretButton
              active={active}
              fretNum={fretNum}
              finger={finger}
              onClick={() => handleFretClick(fretNum)}
            />
            {activeFingerSelect === stringIndex && active && (
              <FingerPopup finger={finger} onSelect={assignFinger} />
            )}
          </div>
        );
      })}
      <div
        className="text-xs text-gray-400 mt-1 cursor-pointer select-none"
        onClick={toggleMute}
        title="Click to mute/unmute string"
      >
        {isMuted ? "X" : isOpen ? "O" : ""}
      </div>
    </div>
  );
}
