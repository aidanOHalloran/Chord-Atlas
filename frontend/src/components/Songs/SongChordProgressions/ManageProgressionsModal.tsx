import { motion } from "framer-motion";
import { useProgressionsManager } from "../../../hooks/useProgressionsManager";
import SongChordProgressions from "./SongChordProgressions";
import ProgressionReorderList from "./ProgressionReorderList";
import ChordOrderSelector from "./ChordOrderSelector";

interface ManageProgressionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  songTitle: string;
  songId: number; // 👈 now just pass this
}

export default function ManageProgressionsModal({
  isOpen,
  onClose,
  songTitle,
  songId,
}: ManageProgressionsModalProps) {
  const {
    progressions,
    chords,
    loading,
    addProgression,
    reorderProgressions,
  } = useProgressionsManager(songId);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 text-gray-400">
        Loading progressions...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.2 }}
        className="
        relative flex flex-col
        bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl
        w-[90vw] max-w-5xl h-[90vh]
        overflow-hidden
      "
      >
        {/* Header (fixed) */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 bg-neutral-950/95 sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-semibold text-blue-300">Manage Progressions</h2>
            <p className="text-sm text-gray-500">{songTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-gray-300 hover:bg-neutral-700 transition"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
          <SongChordProgressions progressions={progressions} allChords={chords} />

          <div className="border-t border-neutral-800 pt-4">
            <h4 className="text-lg font-semibold text-blue-400 mb-2">
              ➕ Add New Progression
            </h4>
            <ChordOrderSelector allChords={chords} value={[]} onChange={() => { }} />
          </div>

          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-2">
              🔀 Reorder Progressions
            </h4>
            <ProgressionReorderList progressions={progressions} onReorder={reorderProgressions} />
          </div>
        </div>

        {/* Footer (fixed) */}
        <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-950/95 sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 text-gray-200 hover:bg-neutral-700 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
