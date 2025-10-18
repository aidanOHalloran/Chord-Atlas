import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SongService } from "../services/api";
import type { Song } from "../types/models";
import ChordList from "../components/Chords/ChordList/ChordList";

export default function SongDetailPage() {
  const { id } = useParams();
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    if (id) {
      SongService.getAll().then((songs) => {
        const found = songs.find((s) => s.id === Number(id));
        setSong(found || null);
      });
    }
  }, [id]);

  if (!song) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/songs" className="text-sm text-gray-400 hover:text-blue-400">
        ← Back to Library
      </Link>

      <h1 className="text-4xl font-bold text-blue-400 mt-4">{song.title}</h1>
      <p className="text-lg text-gray-300 mb-2">{song.artist}</p>
      <p className="text-gray-500 mb-6">Key: {song.song_key}</p>

      <h3 className="text-xl font-semibold text-blue-300 mb-3">Chords</h3>
      <ChordList chords={song.Chords || []} />

      {song.notes && (
        <>
          <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-2">Notes</h3>
          <p className="text-gray-400">{song.notes}</p>
        </>
      )}
    </div>
  );
}
