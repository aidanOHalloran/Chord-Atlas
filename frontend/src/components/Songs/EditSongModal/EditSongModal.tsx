import { useEffect, useState } from "react";
import { SongService, ChordService } from "../../../services/api";
import type { Song, Chord } from "../../../types/models";
import toast from "react-hot-toast";

interface EditSongModalProps {
  song: Song;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditSongModal({ song, onClose, onUpdated }: EditSongModalProps) {
  const [title, setTitle] = useState(song.title);
  const [artist, setArtist] = useState(song.artist);
  const [songKey, setSongKey] = useState(song.song_key || "");
  const [notes, setNotes] = useState(song.notes || "");
  const [spotifyUri, /*setSpotifyUri */] = useState(song.spotify_uri || "");
  const [chords, setChords] = useState<Chord[]>([]);
  const [selectedChordIds, setSelectedChordIds] = useState<number[]>(
    song.Chords?.map((c) => c.id) || []
  );
  const [loading, setLoading] = useState(false);
  const [fetchingChords, setFetchingChords] = useState(true);

  useEffect(() => {
    const loadChords = async () => {
      try {
        setFetchingChords(true);
        const data = await ChordService.getAll();
        setChords(data);
      } catch {
        toast.error("⚠️ Could not load chords.");
      } finally {
        setFetchingChords(false);
      }
    };
    loadChords();
  }, []);

  const toggleChord = (id: number) => {
    setSelectedChordIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await SongService.update(song.id, {
        title,
        artist,
        song_key: songKey,
        notes,
        spotify_uri: spotifyUri,
        chordIds: selectedChordIds,
      });
      toast.success(`Updated "${title}"`);
      onUpdated();
      onClose();
    } catch {
      toast.error("❌ Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-[90%] max-w-lg shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-200 text-xl"
        >
          ✕
        </button>

        <h2 className="text-blue-400 text-xl font-semibold mb-4">
          ✏️ Edit Song
        </h2>

        <form onSubmit={handleSave} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 text-gray-200"
            required
          />

          <input
            type="text"
            placeholder="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 text-gray-200"
            required
          />

          <input
            type="text"
            placeholder="Key (e.g., Am)"
            value={songKey}
            onChange={(e) => setSongKey(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 text-gray-200"
          />



          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Chords used:
            </label>

            {fetchingChords ? (
              <p className="text-gray-500 text-sm">Loading chords...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {chords.map((chord) => (
                  <button
                    key={chord.id}
                    type="button"
                    onClick={() => toggleChord(chord.id)}
                    className={`px-2 py-1 rounded border text-sm ${selectedChordIds.includes(chord.id)
                      ? "bg-blue-700 border-blue-600 text-white"
                      : "bg-neutral-800 border-neutral-700 text-gray-300 hover:border-blue-500"
                      }`}
                  >
                    {chord.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 text-gray-200"
            rows={3}
          />

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Spotify URI or Link
            </label>
            <input
              type="text"
              value={song.spotify_uri || ""}
              onChange={(e) => (song.spotify_uri = e.target.value)}
              placeholder="spotify:track:3AJwUDP919kvQ9QPxg or https://open.spotify.com/track/..."
              className="w-full px-3 py-2 bg-neutral-800 text-gray-200 rounded-lg border border-neutral-700 mb-4"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full px-4 py-2 rounded text-white text-sm font-medium ${loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-600"
              }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
