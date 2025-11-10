import { motion } from "framer-motion";
import type { SongChordProgression, Chord } from "../../../types/models";
import SongChordProgressions from "./SongChordProgressions";

interface ManageProgressionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  songTitle: string;
  progressions: SongChordProgression[];
  allChords: Chord[];
}

export default function ManageProgressionsModal({
  isOpen,
  onClose,
  songTitle,
  progressions,
  allChords,
}: ManageProgressionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-blue-300">
              Manage Progressions
            </h2>
            <p className="text-sm text-gray-500">
              {songTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:text-white transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body – for now, re-use your existing read-only view */}
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          <SongChordProgressions
            progressions={progressions}
            allChords={allChords}
          />
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-800 text-gray-200 hover:bg-neutral-700 transition"
          >
            Close
          </button>
          {/* later: Save / Add / Reorder buttons go here */}
        </div>
      </motion.div>
    </div>
  );
}