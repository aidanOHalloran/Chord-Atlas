import { useState } from "react";
import { SongService } from "../../services/api";
import toast from "react-hot-toast";


interface AddSongFormProps {
    onAdded: () => void; // callback to refresh list
}

export default function AddSongForm({ onAdded }: AddSongFormProps) {
    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("");
    const [songKey, setSongKey] = useState("");
    const [notes, setNotes] = useState("");
    const [chords, setChords] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            const chordList = chords
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean);

            await SongService.create({
                title,
                artist,
                song_key: songKey,
                notes,
                chords: chordList,
            });

            // ✅ success toast
            toast.success(`Added "${title}" by ${artist}`);

            setSuccess(true);
            onAdded(); // refresh parent list
            setTitle("");
            setArtist("");
            setSongKey("");
            setNotes("");
            setChords("");
        } catch (err: any) {
            console.error("❌ Failed to add song:", err);
            setError("Failed to add song. Please check your input.");
            toast.error("Failed to add song. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl mb-8 shadow-md"
        >
            <h3 className="text-blue-400 text-xl font-semibold mb-3">
                ➕ Add a New Song
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 rounded bg-neutral-800 text-gray-200"
                    required
                />
                <input
                    type="text"
                    placeholder="Artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="p-2 rounded bg-neutral-800 text-gray-200"
                    required
                />
                <input
                    type="text"
                    placeholder="Key (e.g., Am)"
                    value={songKey}
                    onChange={(e) => setSongKey(e.target.value)}
                    className="p-2 rounded bg-neutral-800 text-gray-200"
                />
                <input
                    type="text"
                    placeholder="Chords (comma-separated, e.g. G, C, D, Em)"
                    value={chords}
                    onChange={(e) => setChords(e.target.value)}
                    className="p-2 rounded bg-neutral-800 text-gray-200 col-span-2"
                />
                <textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="p-2 rounded bg-neutral-800 text-gray-200 col-span-2"
                    rows={2}
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`mt-4 px-4 py-2 rounded text-white text-sm font-medium ${loading ? "bg-gray-600" : "bg-blue-700 hover:bg-blue-600"
                    }`}
            >
                {loading ? "Adding..." : "Add Song"}
            </button>

            {error && <p className="text-red-400 mt-2">{error}</p>}
        </form>
    );
}
