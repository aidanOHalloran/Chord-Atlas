interface GuitarTuningProps {
  notes: string[];
}

export default function GuitarTuning({ notes }: GuitarTuningProps) {
  return (
    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-600">
      <h4 className="text-lg font-semibold text-blue-200 mb-3 flex items-center">
        <span className="mr-2">🎵</span>
        Guitar Tuning
      </h4>
      <div className="flex flex-wrap gap-2">
        {notes.map((note, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-yellow-900 text-yellow-200 rounded-full text-sm font-medium border border-yellow-700"
          >
            {note}
          </span>
        ))}
      </div>
    </div>
  );
}
