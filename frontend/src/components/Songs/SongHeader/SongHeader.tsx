import type { Song } from "../../../types/models";

interface SongHeaderProps {
  song: Song;
  showCapo?: boolean;
  showKey?: boolean;
  className?: string;
}

export default function SongHeader({
  song,
  showCapo = true,
  showKey = true,
  className = "",
}: SongHeaderProps) {
  return (
    <div className={`text-gray-200 ${className}`}>
      <h1 className="text-5xl font-bold text-blue-400 mb-2">{song.title}</h1>
      <h2 className="text-3xl text-gray-300">{song.artist}</h2>

      {showCapo && song.capo_fret !== undefined && (
        <p className="text-xl text-gray-500 mt-1">
          Capo Fret: {song.capo_fret || "None"}
        </p>
      )}

      {showKey && song.song_key && (
        <p className="text-lg text-gray-500 mt-1">Key: {song.song_key}</p>
      )}
    </div>
  );
}
