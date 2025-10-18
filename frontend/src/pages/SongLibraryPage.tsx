import { useState } from "react";
import SongList from "../components/SongList/SongList";
import { Link } from "react-router-dom";
import AddSongForm from "../components/AddSongForm/AddSongForm";

export default function SongLibraryPage() {
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-blue-400">🎶 Your Song Library</h2>
        <Link to="/" className="text-sm text-gray-400 hover:text-blue-400 transition">
          ← Back to Home
        </Link>
      </div>

      {/* Collapsible Add Song Form */}
      <div className="mb-8 bg-neutral-900 rounded-xl border border-neutral-800 shadow-md overflow-hidden">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="w-full flex justify-between items-center p-4 text-left hover:bg-neutral-800 transition"
        >
          <h3 className="text-blue-400 text-lg font-semibold flex items-center gap-2">
            {showForm ? "▼" : "▶"} Add a New Song
          </h3>
          <span className="text-gray-400 text-sm">
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
            onAdded={
              () => {
                setRefresh((r) => r + 1)
                setShowForm(false) // hide form after adding
              }}
          />
        </div>
      </div>

      {/* Song list refreshes when new song added */}
      <SongList key={refresh} />
    </div>
  );
}
