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
    SongService.getAll().then((res) => {
      console.log("🎵 SongService response:", res);
      setSongs(res);
    });
  }, []);


  if (songs.length === 0) return <p className="text-gray-400">No songs found.</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {songs.map((song) => (
        <SongItem key={song.id} song={song} />
      ))}
    </div>
  );

}