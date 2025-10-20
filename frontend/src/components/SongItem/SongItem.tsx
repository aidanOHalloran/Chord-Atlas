import { Link } from "react-router-dom";
import type { Song } from "../../types/models";

interface SongItemProps {
  song: Song;
}

export default function SongItem({ song }: SongItemProps) {
  return (
    <Link
      to={`/songs/${song.id}`}
      className="block bg-neutral-900 p-4 rounded-xl shadow-md border border-neutral-700 hover:border-blue-500 hover:shadow-lg transition transform hover:-translate-y-1"
    >
      <div className="mb-3">
        <h3 className="text-xl font-semibold text-white">{song.title}</h3>
        <p className="text-gray-300">{song.artist}</p>
      </div>

      <p className="text-sm text-gray-400 mb-3">
        Key: <span className="font-medium text-gray-200">{song.song_key}</span>
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {song.Chords?.slice(0, 4).map((chord) => (
          <span
            key={chord.id}
            className="px-2 py-1 text-xs rounded bg-blue-950 text-blue-300 border border-blue-800"
          >
            {chord.name}
          </span>
        ))}
      </div>
    </Link>
  );
}
