import { motion } from "framer-motion";
import { useState } from "react";
import SongList from "../components/Songs/SongList/SongList";
import { Link } from "react-router-dom";
import AddSongForm from "../components/Songs/AddSongForm/AddSongForm";
import { useSearchbar } from "../hooks/useSearchbar";
import SearchBar from "../components/GeneralUI/SearchBar/SearchBar";
import { Mic, Music, GripHorizontal } from "lucide-react";


export default function SongLibraryPage() {
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // vars for search bar (deconstructed from custom hook useSearchbar)
  const { filters, setFilters, handleChange } = useSearchbar();

  // hold dropdown data for filters
  const [filterData, setFilterData] = useState({
    artists: [] as string[],
    song_keys: [] as string[],
    capoFrets: [] as (number | null)[],
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-8 text-gray-200 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-blue-400">Song Library</h1>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 text-gray-200 bg-neutral-800 hover:bg-neutral-700 hover:text-blue-400 transition-all duration-200"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Collapsible Add Song Form */}
      <div className="mb-8 bg-neutral-900 rounded-xl border border-neutral-800 shadow-md overflow-hidden">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="w-full flex justify-between items-center p-4 text-left hover:bg-neutral-800 transition"
        >
          <h2 className="text-white-400 text-lg font-semibold flex items-center gap-2">
            {showForm ? "▼" : "▶"} Add New Song
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
          <AddSongForm
            onAdded={() => {
              setRefresh((r) => r + 1);
              setShowForm(false);
            }}
          />
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar
          onSubmit={(e) => e.preventDefault()}
          value={filters.searchTerm ?? ""}
          onChange={handleChange}
          placeholder="Search songs by name..."
        />
      </div>

      {/* Filter Toolbar */}
      <div className="mb-8 w-full flex justify-center">
        <div
          className="w-full max-w-3xl flex items-center justify-center gap-8
               bg-neutral-900 border border-neutral-800 rounded-xl
               px-6 py-4 shadow-md"
        >
          {/* Artist */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-blue-400 whitespace-nowrap">
              <Mic size={18} className="opacity-80" />
              Artist
            </span>
            <select
              className="bg-neutral-800 border border-neutral-700 text-gray-300 rounded p-2"
              value={filters.artist}
              onChange={(e) => setFilters((f) => ({ ...f, artist: e.target.value }))}
            >
              <option value="">All Artists</option>
              {filterData.artists.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-neutral-700 opacity-60"></div>

          {/* Key */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-purple-400 whitespace-nowrap">
              <Music size={18} className="opacity-80" />
              Key
            </span>
            <select
              className="bg-neutral-800 border border-neutral-700 text-gray-300 rounded p-2"
              value={filters.song_key}
              onChange={(e) => setFilters((f) => ({ ...f, song_key: e.target.value }))}
            >
              <option value="">All Keys</option>
              {filterData.song_keys.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-neutral-700 opacity-60"></div>

          {/* Capo */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-green-400 whitespace-nowrap">
              <GripHorizontal size={18} className="opacity-80" />
              Capo
            </span>
            <select
              className="bg-neutral-800 border border-neutral-700 text-gray-300 rounded p-2"
              value={filters.capo_fret ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  capo_fret: e.target.value === "" ? null : Number(e.target.value),
                }))
              }
            >
              <option value="">Any Capo</option>
              {filterData.capoFrets.map((f) => (
                <option key={f} value={f ?? ""}>
                  Capo Fret {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>



      {/* Song List */}
      <SongList refreshKey={refresh} filters={filters} onFilterData={setFilterData} />
    </motion.div>
  );
}
