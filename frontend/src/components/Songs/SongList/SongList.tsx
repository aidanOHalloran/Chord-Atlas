import { useEffect, useState } from "react";
import { SongService } from "../../../services/api";
import SongItem from "../SongItem/SongItem";
import type { Song } from "../../../types/models";
import toast from "react-hot-toast";

interface SongListProps {
  refreshKey?: number; // ✅ triggers re-fetch when incremented
}

export default function SongList({ refreshKey }: SongListProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await SongService.getAll();
        // console.log("🎵 SongService response:", res);

        setSongs(res);

        // ✅ Show toast when songs successfully refresh (only on re-fetch)
        if (refreshKey && refreshKey > 0) {
          toast.success("🎶 Song library updated");
        }
      } catch (err) {
        console.error("❌ Error fetching songs:", err);
        setError("Failed to fetch songs.");
        toast.error("⚠️ Failed to load songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [refreshKey]);
  // ✅ refresh list when parent form adds a new song

    if (loading) {
      return <p className="text-gray-400 animate-pulse">Loading songs...</p>;
    }

    if (error) {
      return <p className="text-red-400">{error}</p>;
    }

    if (songs.length === 0) {
      return <p className="text-gray-400">No songs found.</p>;
    }

    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <SongItem key={song.id} song={song} />
        ))}
      </div>
    );
  }
