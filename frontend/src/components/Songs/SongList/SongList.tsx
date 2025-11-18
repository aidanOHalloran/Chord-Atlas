import { useEffect, useState } from "react";
import { SongService } from "../../../services/api";
import SongItem from "../SongItem/SongItem";
import type { Song } from "../../../types/models";
import type { SongFilters } from "../../../types/filters";
import toast from "react-hot-toast";


interface SongListProps {
  refreshKey?: number; // ✅ triggers re-fetch when incremented
  filters: SongFilters;
  onFilterData?: (data: {
    artists: string[];
    song_keys: string[];
    capoFrets: (number | null)[];
  }) => void;
}

export default function SongList({ refreshKey, filters, onFilterData }: SongListProps) {
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


  // Apply filters to the songs list
  // Filtering logic
  const filteredSongs = songs.filter((song) => {
    const { searchTerm, artist, song_key, capo_fret } = filters;

    const matchesText =
      !searchTerm ||
      song.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesArtist = !artist || song.artist === artist;

    const matchesKey = !song_key || song.song_key === song_key;

    const matchesCapo =
      capo_fret === null ? true : song.capo_fret === capo_fret;

    return matchesText && matchesArtist && matchesKey && matchesCapo;
  });

  // Extract the unique filter options from the songs data, for the dropdowns
  const artists = Array.from(new Set(filteredSongs.map((song) => song.artist).filter(Boolean))).sort();
  const song_keys = Array.from(new Set(filteredSongs.map((song) => song.song_key).filter(Boolean))).sort();
  const capoFrets = Array.from(new Set(filteredSongs.map((song) => song.capo_fret))).sort((a, b) => (a === null ? 1 : b === null ? -1 : a - b));

  // Pass the filter options back to the parent component
  useEffect(() => {
    if (!loading && songs.length > 0 && onFilterData) {
      onFilterData({ artists, song_keys, capoFrets });
    }
  }, [songs, loading]);


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
      {filteredSongs.map((song) => (
        <SongItem key={song.id} song={song} />
      ))}
    </div>
  );
}
