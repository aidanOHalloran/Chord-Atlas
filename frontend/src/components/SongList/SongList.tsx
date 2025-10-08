import { useEffect, useState } from "react";
import api from "../../services/api";

interface Chord {
  id: number;
  name: string;
}

interface Song {
  id: number;
  title: string;
  artist: string;
  song_key: string;
  Chords?: Chord[];
}

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/songs")
      .then((res) => setSongs(res.data))
      .catch((err) => console.error("API error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading songs...</p>;
  if (songs.length === 0) return <p>No songs found.</p>;

  return (
    <ul>
      {songs.map((song) => (
        <li key={song.id}>
          <strong>{song.title}</strong> – {song.artist} ({song.song_key})
          <ul>
            {song.Chords?.map((ch) => (
              <li key={ch.id}>{ch.name}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}