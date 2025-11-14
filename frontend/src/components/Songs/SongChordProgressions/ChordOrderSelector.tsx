// src/components/Songs/SongChordProgressions/ChordOrderSelector.tsx
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { Chord } from "../../../types/models";

interface ChordOrderSelectorProps {
  allChords: Chord[];
  value: number[];                   // current chord ID order
  onChange: (ids: number[]) => void; // callback to update parent
}

export default function ChordOrderSelector({
  allChords,
  value,
  onChange,
}: ChordOrderSelectorProps) {
  const selectedIds = value ?? [];

  const selectedChords = selectedIds
    .map((id) => allChords.find((c) => c.id === id))
    .filter((c): c is Chord => !!c);

  const availableChords = allChords;

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(selectedIds);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onChange(reordered);
  };

  const addChord = (id: number) => {
      onChange([...selectedIds, id]); // allow multiples of the same chord
  };

  const removeChord = (id: number) => {
    onChange(selectedIds.filter((x) => x !== id));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        Build the progression by{" "}
        <span className="text-blue-400 font-medium">adding chords</span> and{" "}
        <span className="text-blue-400 font-medium">dragging</span> to reorder
        them.
      </p>

      {/* Selected chords (ordered) */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="selected-chords" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="min-h-[48px] flex flex-wrap gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-2"
            >
              {selectedChords.map((chord, index) => (
                <Draggable
                  key={chord.id}
                  draggableId={`selected-${chord.id}-${index}`}
                  index={index}
                >
                  {(prov, snapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border cursor-grab ${
                        snapshot.isDragging
                          ? "bg-blue-700 border-blue-400 text-white"
                          : "bg-neutral-800 border-neutral-600 text-gray-100"
                      }`}
                    >
                      <span>{chord.name}</span>
                      <span className="text-[10px] text-gray-400">
                        #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeChord(chord.id)}
                        className="text-xs text-gray-400 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {selectedChords.length === 0 && (
                <span className="text-xs text-gray-500">
                  No chords selected yet.
                </span>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Available chords */}
      <div>
        <p className="text-sm text-gray-400 mb-1">Available chords:</p>
        <div className="flex flex-wrap gap-2">
          {availableChords.map((chord) => (
            <button
              key={chord.id}
              type="button"
              onClick={() => addChord(chord.id)}
              className="px-3 py-1 rounded-lg text-sm border bg-neutral-800 border-neutral-700 text-gray-300 hover:bg-neutral-700 transition"
            >
              {chord.name}
            </button>
          ))}
        </div>
      </div>

      {selectedChords.length > 0 && (
        <div className="mt-1 text-xs text-gray-400 font-mono">
          Order:{" "}
          <span className="text-blue-400">
            {selectedChords.map((c) => c.name).join(" → ")}
          </span>
        </div>
      )}
    </div>
  );
}
