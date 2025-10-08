import { useEffect, useState } from "react";
import { SongService } from "../../services/api";
import SongItem from "../SongItem/SongItem";
import type { Song } from "../../types/models";

export interface Chord {
  id: number;
  name: string;
}

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    SongService.getAll().then(setSongs);
  }, []);

  if (songs.length === 0) return <p>No songs found.</p>;

  return (
    <ul>
      {songs.map((song) => (
        <SongItem key={song.id} song={song} />
      ))}
    </ul>
  );
}