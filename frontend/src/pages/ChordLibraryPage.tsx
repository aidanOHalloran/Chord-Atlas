import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import AddChordForm from "../components/Chords/AddChordForm/AddChordForm";
import ChordCard from "../components/Chords/ChordCard/ChordCard";
import type { Chord } from "../types/models";
import { Link } from "react-router-dom";
import SearchBar from "../components/GeneralUI/SearchBar/SearchBar";
import { useChordSearch } from "../hooks/useChordSearch";
import { chordMatchesSearch, sortChordsByRoot } from "../static/chordHelpers";
import { extractRoot, normalizeRoot } from "../static/noteUtils";
import { ROOT_ORDER } from "../static/noteOrder"; // optional, for sorting


export default function ChordLibraryPage() {
  const [chords, setChords] = useState<Chord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [rootFilter, setRootFilter] = useState<string>("all");


  const { searchTerm, handleChange } = useChordSearch();

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

  const uniqueRoots = Array.from(
    new Set(
      chords.map(c => normalizeRoot(extractRoot(c.name)))
    )
  ).sort((a, b) => ROOT_ORDER.indexOf(a) - ROOT_ORDER.indexOf(b));


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

  // 🔍 Filter chords instantly based on search
  let filteredChords = chords.filter(c =>
    chordMatchesSearch(c, searchTerm)
  );

  // ✅ APPLY ROOT FILTER HERE
  if (rootFilter !== "all") {
    filteredChords = filteredChords.filter(c => {
      const root = normalizeRoot(extractRoot(c.name));
      return root === rootFilter;
    });
  }

  // Now apply sorting (ascending by default)
  filteredChords = sortChordsByRoot(filteredChords, sortDirection);

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

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          onSubmit={(e) => e.preventDefault()}
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search chords by name..."
        />
      </div>

      {/* Sort + Filter Toolbar */}
      <div className="mb-8 flex flex-col items-center">

        <div className="flex items-center gap-8 bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-4 shadow-md">

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-blue-400 flex items-center gap-1">
              <svg width="18" height="18" fill="currentColor" className="opacity-80">
                <path d="M11 3h4v2h-4V3zM7 7h8v2H7V7zm-4 4h12v2H3v-2zm4 4h8v2H7v-2z" />
              </svg>
              Sort
            </span>

            <select
              className="bg-neutral-800 border border-neutral-700 text-gray-300 rounded p-2"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value as "asc" | "desc")}
            >
              <option value="asc">A → G</option>
              <option value="desc">G → A</option>
            </select>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-neutral-700 opacity-60"></div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-green-400 flex items-center gap-1">
              <svg width="18" height="18" fill="currentColor" className="opacity-80">
                <path d="M10 3l6 6H4l6-6zm-6 8h12l-6 6-6-6z" />
              </svg>
              Filter
            </span>

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


      {/* Chord Grid */}
      {loading ? (
        <p className="text-center text-gray-400">Loading chords...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredChords.length === 0 ? (
        <p className="text-center text-gray-400">No chords yet. Add one above!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChords.map((chord) => (
            <ChordCard key={chord.id} chord={chord} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
