import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AddChordForm from "../components/Chords/AddChordForm/AddChordForm";
import ChordCard from "../components/Chords/ChordCard/ChordCard";
import SearchBar from "../components/GeneralUI/SearchBar/SearchBar";

import { useChordLibrary } from "../hooks/Chords/useChordLibrary";
import { useChordFilters } from "../hooks/Chords/useChordFilters";
import { useState } from "react";
import ConfirmDeleteModal from "../components/GeneralUI/Modals/ConfirmDeleteModal/ConfirmDeleteModal";

export default function ChordLibraryPage() {
  const {
    chords,
    loading,
    error,
    deleteChord,
    handleChordAdded,
  } = useChordLibrary();

  const {
    searchTerm,
    setSearchTerm,
    sortDirection,
    setSortDirection,
    rootFilter,
    setRootFilter,
    filteredChords,
    uniqueRoots,
  } = useChordFilters(chords);

  const [showForm, setShowForm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-8 text-gray-200 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-blue-400">🎸 Chord Library</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 text-gray-200 bg-neutral-800 hover:bg-neutral-700 hover:text-blue-400 transition"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Collapsible Form */}
      <div className="mb-8 bg-neutral-900 rounded-xl border border-neutral-800 shadow-md overflow-hidden">
        <button
          onClick={() => setShowForm((prev: any) => !prev)}
          className="w-full flex justify-between items-center p-4 text-left hover:bg-neutral-800 transition"
        >
          <h2 className="text-white-400 text-lg font-semibold flex items-center gap-2">
            {showForm ? "▼" : "▶"} Add New Chord
          </h2>
        </button>

        {showForm && (
          <div className="p-5 border-t border-neutral-800">
            <AddChordForm onAdded={handleChordAdded} />
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          onSubmit={(e) => e.preventDefault()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search chords by name..."
        />
      </div>

      {/* Sort + Filter */}
      <div className="mb-8 flex justify-center">
        <div className="flex items-center gap-8 bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-4 shadow-md">

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-blue-400">Sort</span>
            <select
              className="bg-neutral-800 border border-neutral-700 text-gray-300 rounded p-2"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value as any)}
            >
              <option value="asc">A → G</option>
              <option value="desc">G → A</option>
            </select>
          </div>

          <div className="w-px h-8 bg-neutral-700 opacity-60"></div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-green-400">Filter</span>
            <select
              className="bg-neutral-800 border border-neutral-700 text-gray-300 rounded p-2"
              value={rootFilter}
              onChange={(e) => setRootFilter(e.target.value)}
            >
              <option value="all">All Roots</option>
              {uniqueRoots.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Chords Grid */}
      {loading ? (
        <p className="text-center text-gray-400">Loading chords...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredChords.length === 0 ? (
        <p className="text-center text-gray-400">No chords found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChords.map((chord) => (
            <ChordCard
              key={chord.id}
              chord={chord}
              onDelete={() => setPendingDeleteId(chord.id)}
            />
          ))}
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={pendingDeleteId !== null}
        title="Delete Chord"
        message="Are you sure you want to delete this chord? This action cannot be undone."
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={async () => {
          if (pendingDeleteId !== null) {
            await deleteChord(pendingDeleteId);
          }
          setPendingDeleteId(null);
        }}
      />


    </motion.div>

  );
}
