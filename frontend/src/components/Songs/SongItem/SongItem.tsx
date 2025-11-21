import { Link } from "react-router-dom";
import type { Song } from "../../../types/models";
import { Trash2 } from "lucide-react";


interface SongItemProps {
  song: Song;
  onRequestDelete?: (id: number) => void;
}

export default function SongItem({ song, onRequestDelete }: SongItemProps) {
  return (
    <Link
      to={`/songs/${song.id}`} // Link to the song details page
      className="block bg-neutral-900 p-4 rounded-xl shadow-md border border-neutral-700 hover:border-blue-500 hover:shadow-lg transition transform hover:-translate-y-1"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-white">{song.title}</h3>
          <p className="text-gray-300">{song.artist}</p>
        </div>

        {onRequestDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();   // prevent link navigation
              e.stopPropagation();  // block bubbling
              onRequestDelete(song.id);
            }}
            className="text-red-400 hover:text-red-300 transition background-transparent p-1 rounded-full"
          >
            <Trash2 size={20} color="#0d0003ff" />
          </button>
        )}
      </div>


      <p className="text-sm text-gray-400 mb-3">
        Capo Fret: <span className="font-medium text-gray-200">{song.capo_fret == null ? 0 : song.capo_fret}</span>
      </p>

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
