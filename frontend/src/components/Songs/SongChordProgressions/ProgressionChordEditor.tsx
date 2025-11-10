// src/components/Songs/SongChordProgressions/ProgressionChordEditor.tsx
import { useState } from "react";
import type { SongChordProgression, Chord } from "../../../types/models";
import ChordOrderSelector from "./ChordOrderSelector";

interface Props {
  progressions: SongChordProgression[];
  allChords: Chord[];
  onSaveChordOrder: (progressionId: number, updatedIds: number[]) => Promise<void>;
}

export default function ProgressionChordEditor({
  progressions,
  allChords,
  onSaveChordOrder,
}: Props) {
  const [activeId, setActiveId] = useState<number | null>(progressions[0]?.id ?? null);
  const [localProgressions, setLocalProgressions] = useState(progressions);
  const [isSaving, setIsSaving] = useState(false);

  const activeProgression = localProgressions.find((p) => p.id === activeId);

  return (
    <div className="mt-8 border-t border-neutral-800 pt-4">
      <h4 className="text-lg font-semibold text-blue-400 mb-2">
        Edit Chord Order in a Section
      </h4>

      <div className="flex flex-wrap gap-2 mb-4">
        {localProgressions.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`px-3 py-1 rounded-lg text-sm border ${
              p.id === activeId
                ? "bg-blue-700 border-blue-500 text-white"
                : "bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700"
            }`}
          >
            {p.progression_name}
          </button>
        ))}
      </div>

      {activeProgression && (
        <>
          <ChordOrderSelector
            allChords={allChords}
            value={activeProgression.chord_ids}
            onChange={(updatedIds) => {
              setLocalProgressions((prev) =>
                prev.map((p) =>
                  p.id === activeProgression.id ? { ...p, chord_ids: updatedIds } : p
                )
              );
            }}
          />

          <button
            onClick={async () => {
              if (!activeProgression) return;
              setIsSaving(true);
              await onSaveChordOrder(activeProgression.id, activeProgression.chord_ids);
              setIsSaving(false);
            }}
            className="mt-3 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "💾 Save Chord Order"}
          </button>
        </>
      )}
    </div>
  );
}
