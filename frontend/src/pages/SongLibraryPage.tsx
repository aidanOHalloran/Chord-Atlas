import { useState } from "react";
import SongList from "../components/SongList/SongList";
import { Link } from "react-router-dom";
import AddSongForm from "../components/AddSongForm/AddSongForm";


export default function SongLibraryPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-blue-400">🎶 Your Song Library</h2>
        <Link
          to="/"
          className="text-sm text-gray-400 hover:text-blue-400 transition"
        >
          ← Back to Home
        </Link>
      </div>

        {/* Form to add new songs */}
      <AddSongForm onAdded={() => setRefresh((r) => r + 1)} />
        {/* Key change forces remount and data refresh */}
      <SongList key={refresh} />
    </div>
  );
}
