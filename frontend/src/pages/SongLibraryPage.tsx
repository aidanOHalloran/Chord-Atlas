import { motion } from "framer-motion";
import { useState } from "react";
import SongList from "../components/Songs/SongList/SongList";
import { Link } from "react-router-dom";
import AddSongForm from "../components/Songs/AddSongForm/AddSongForm";

export default function SongLibraryPage() {
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);

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

      {/* Song List */}
      <SongList key={refresh} />
    </motion.div>
  );
}
