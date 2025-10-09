import { Link } from "react-router-dom";
import type { Song } from "../../types/models";

interface SongItemProps {
  song: Song;
}

export default function SongItem({ song }: SongItemProps) {
  return (
    <div className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl p-5 transition-transform transform hover:-translate-y-1 shadow-md">
      <div className="mb-3">
        <h3 className="text-xl font-semibold text-blue-300">{song.title}</h3>
        <p className="text-gray-400">{song.artist}</p>
      </div>

      <p className="text-sm text-gray-500 mb-3">
        Key: <span className="font-medium text-gray-300">{song.song_key}</span>
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {song.Chords?.slice(0, 4).map((ch) => (
          <span
            key={ch.id}
            className="px-2 py-1 text-xs rounded bg-blue-950 text-blue-300 border border-blue-800"
          >
            {ch.name}
          </span>
        ))}
      </div>

      <Link
        to={`/songs/${song.id}`}
        className="inline-block text-blue-400 hover:text-blue-300 text-sm font-medium"
      >
        View Details →
      </Link>
    </div>
  );
}
