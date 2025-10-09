import SongList from "../components/SongList/SongList";
import { Link } from "react-router-dom";

export default function SongLibraryPage() {
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

      <SongList />
    </div>
  );
}
