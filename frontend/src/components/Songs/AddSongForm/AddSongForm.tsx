import { useState, useEffect } from "react";
import { SongService, ChordService } from "../../../services/api";
import AddChordForm from "../../Chords/AddChordForm/AddChordForm";
import type { Chord } from "../../../types/models";
import toast from "react-hot-toast";

export default function AddSongForm({ onAdded }: { onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [capoFret, setCapoFret] = useState(0);
  const [songKey, setSongKey] = useState("");
  const [notes, setNotes] = useState("");

  const [chords, setChords] = useState<Chord[]>([]);
  const [selectedChordIds, setSelectedChordIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchingChords, setFetchingChords] = useState(true);

  const [showChordModal, setShowChordModal] = useState(false); // 👈 modal toggle

  useEffect(() => {
    fetchChords();
  }, []);

  const fetchChords = async () => {
    try {
      setFetchingChords(true);
      const data = await ChordService.getAll();
      setChords(data);
    } catch (err) {
      toast.error("Could not load chords from database.");
    } finally {
      setFetchingChords(false);
    }
  };

  const toggleChord = (id: number) => {
    setSelectedChordIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await SongService.create({
        title,
        artist,
        capo_fret: capoFret,
        song_key: songKey,
        notes,
        chordIds: selectedChordIds,
      });
      toast.success(`Added "${title}" by ${artist}`);
      onAdded();
      setTitle("");
      setArtist("");
      setCapoFret(0);
      setSongKey("");
      setNotes("");
      setSelectedChordIds([]);
    } catch {
      setError("Failed to add song.");
      toast.error("Could not save song. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- Add Song Form --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl mb-8 shadow-md"
      >
        <h3 className="text-blue-400 text-xl font-semibold mb-3">
          ➕ Add a New Song
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title */}
          <div className="flex flex-col">
            <label htmlFor="title" className="text-sm text-gray-400 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter song title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 rounded-md bg-neutral-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Artist */}
          <div className="flex flex-col">
            <label htmlFor="artist" className="text-sm text-gray-400 mb-1">
              Artist
            </label>
            <input
              id="artist"
              type="text"
              placeholder="Enter artist name"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="p-2 rounded-md bg-neutral-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Capo Fret */}
          <div className="flex flex-col">
            <label htmlFor="capoFret" className="text-sm text-gray-400 mb-1">
              Capo Fret
            </label>
            <input
              id="capoFret"
              type="number"
              placeholder="0"
              min="0"
              max="12"
              value={capoFret}
              onChange={(e) => setCapoFret(Number(e.target.value))}
              className="p-2 rounded-md bg-neutral-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Song Key */}
          <div className="flex flex-col sm:col-span-1">
            <label htmlFor="songKey" className="text-sm text-gray-400 mb-1">
              Key
            </label>
            <input
              id="songKey"
              type="text"
              placeholder="e.g. Am"
              value={songKey}
              onChange={(e) => setSongKey(e.target.value)}
              className="p-2 rounded-md bg-neutral-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>


        <div className="mt-4">
          <label className="block text-sm text-gray-400 mb-2">
            Select Chords Used in the Song
          </label>

          {fetchingChords ? (
            <p className="text-gray-500 text-sm">Loading chords...</p>
          ) : chords.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No chords found.{" "}
              <button
                type="button"
                onClick={() => setShowChordModal(true)}
                className="text-blue-400 underline hover:text-blue-300"
              >
                Add one here
              </button>
              .
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 mb-3">
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

          <button
            type="button"
            onClick={() => setShowChordModal(true)}
            className="text-white text-sm underline hover:text-white border-blue-400"
          >
            + Add New Chord
          </button>
        </div>

        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 mt-4 rounded bg-neutral-800 text-gray-200"
          rows={2}
        />

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded text-white text-sm font-medium ${loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-600"
            }`}
        >
          {loading ? "Adding..." : "Add Song"}
        </button>

        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>

      {/* --- Popup Modal for Adding Chords --- */}
      {showChordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-[90%] max-w-lg shadow-2xl relative">
            <button
              onClick={() => setShowChordModal(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-200 text-xl"
            >
              ✕
            </button>
            <AddChordForm
              onAdded={async () => {
                await fetchChords(); // refresh chord list when modal closes
                setShowChordModal(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
