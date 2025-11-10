// src/components/Songs/SongChordProgressions/ProgressionReorderList.tsx
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { SongChordProgression } from "../../../types/models";

interface Props {
  progressions: SongChordProgression[];
  onReorder: (updated: SongChordProgression[]) => void;
}

export default function ProgressionReorderList({ progressions, onReorder }: Props) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reordered = Array.from(progressions);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onReorder(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="progressions" type="PROGRESSION">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {progressions.map((p, index) => (
              <Draggable
                key={p.id}
                draggableId={p.id.toString()}
                index={index}
              >
                {(prov, snapshot) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                    className={`flex items-center justify-between p-3 rounded-lg border transition ${
                      snapshot.isDragging
                        ? "bg-blue-900/40 border-blue-500"
                        : "bg-neutral-900 border-neutral-800"
                    }`}
                  >
                    <span className="font-medium text-gray-200">
                      {p.progression_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      #{index + 1}
                    </span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
