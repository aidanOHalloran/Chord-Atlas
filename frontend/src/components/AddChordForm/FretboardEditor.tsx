// frontend/src/components/AddChordForm/FretboardEditor.tsx

interface Props {
  frets: number[];
  fingers: number[];
  onChange: (frets: number[], fingers: number[]) => void;
}

export default function FretboardEditor({ frets, fingers, onChange }: Props) {
  const strings = 6;
  const maxFrets = 5;

  const handleClick = (stringIndex: number, fret: number) => {
    const newFrets = [...frets];
    newFrets[stringIndex] = newFrets[stringIndex] === fret ? 0 : fret;
    onChange(newFrets, fingers);
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: strings }).map((_, stringIndex) => (
          <div key={stringIndex} className="flex flex-col items-center">
            {Array.from({ length: maxFrets }).map((_, fretIndex) => {
              const fret = fretIndex + 1;
              const active = frets[stringIndex] === fret;
              return (
                <div
                  key={fretIndex}
                  onClick={() => handleClick(stringIndex, fret)}
                  className={`w-8 h-8 flex items-center justify-center rounded-full border cursor-pointer mb-1
                    ${
                      active
                        ? "bg-blue-600 border-blue-400"
                        : "bg-neutral-800 border-neutral-700 hover:border-blue-500"
                    }`}
                >
                  {active ? fret : ""}
                </div>
              );
            })}
            <span className="text-xs text-gray-400 mt-1">String {6 - stringIndex}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
