import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import AddChordForm from "../components/Chords/AddChordForm/AddChordForm";
import ChordCard from "../components/Chords/ChordCard/ChordCard";
import type { Chord } from "../types/models";
import { Link } from "react-router-dom";

export default function ChordLibraryPage() {
  const [chords, setChords] = useState<Chord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

  const fetchChords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/chords`);
      setChords(res.data);
    } catch (err) {
      console.error("❌ Error fetching chords:", err);
      setError("Failed to load chords");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChords();
  }, []);

  const handleChordAdded = async () => {
    await fetchChords();
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this chord?")) return;
    try {
      await axios.delete(`${API_BASE}/chords/${id}`);
      setChords(chords.filter((c) => c.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete chord:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-8 text-gray-200 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-blue-400">🎸 Chord Library</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 text-gray-200 bg-neutral-800 hover:bg-neutral-700 hover:text-blue-400 transition-all duration-200"
        >
          ← Back to Home
        </Link>

      </div>

      {/* Collapsible Add Form */}
      <div className="mb-8 bg-neutral-900 rounded-xl border border-neutral-800 shadow-md overflow-hidden">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="w-full flex justify-between items-center p-4 text-left hover:bg-neutral-800 transition"
        >
          <h2 className="text-white-400 text-lg font-semibold flex items-center gap-2">
            {showForm ? "▼" : "▶"} Add New Chord
          </h2>
          <span className="text-white-400 text-sm">
            {showForm ? "Click to hide" : "Click to expand"}
          </span>
        </button>

        <div
          className={`transition-all duration-500 ease-in-out ${showForm
            ? "max-h-[1200px] opacity-100 p-5 border-t border-neutral-800"
            : "max-h-0 opacity-0"
            } overflow-hidden`}
        >
          <AddChordForm onAdded={handleChordAdded} />
        </div>
      </div>

      {/* Chord Grid */}
      {loading ? (
        <p className="text-center text-gray-400">Loading chords...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : chords.length === 0 ? (
        <p className="text-center text-gray-400">No chords yet. Add one above!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chords.map((chord) => (
            <ChordCard key={chord.id} chord={chord} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
