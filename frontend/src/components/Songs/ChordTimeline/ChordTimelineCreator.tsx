import { useState } from "react";

interface Props {
  songId: number;
  onCreated?: (data: any[]) => void;
}

export default function ChordTimelineCreator({ songId, onCreated }: Props) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center text-gray-400 mt-8">
      <p className="mb-4">
        No chord timeline has been created for this song yet.
      </p>

      <button
        disabled={creating}
        onClick={() => {
          setCreating(true);
          // Placeholder for future modal or timeline editor
          alert(`Launch chord timeline editor for song #${songId}`);
          setCreating(false);
          if (onCreated) onCreated([]); // stub callback
        }}
        className="px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium shadow-sm transition disabled:opacity-50"
      >
        ➕ Create Chord Timeline
      </button>
    </div>
  );
}
