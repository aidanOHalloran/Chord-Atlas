import { useEffect, useState } from "react";
import axios from "axios";
import AddChordForm from "../components/AddChordForm/AddChordForm";
import ChordCard from "../components/Chords/ChordCard/ChordCard";

interface Chord {
  id: number;
  name: string;
  frets: number[];
  fingers: (number | null)[];
  position?: number;
  variation?: number;
}

export default function ChordLibraryPage() {
  const [chords, setChords] = useState<Chord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

  // 🪄 Fetch all chords
  const fetchChords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/chords`);
      setChords(res.data);
    } catch (err) {
      console.error("❌ Error fetching chords:", err);
      setError("Failed to load chords");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Load once
  useEffect(() => {
    fetchChords();
  }, []);

  const handleChordAdded = () => {
    fetchChords();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this chord?")) return;
    try {
      await axios.delete(`${API_BASE}/chords/${id}`);
      setChords(chords.filter(c => c.id !== id));
    } catch (err) {
      console.error("❌ Failed to delete chord:", err);
    }
  };

  return (
    <div className="p-8 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center">🎸 Chord Library</h1>

      {/* ➕ Add new chord */}
      <div className="max-w-2xl mx-auto mb-10 bg-neutral-900 p-6 rounded-xl shadow-lg border border-neutral-700">
        <h2 className="text-xl font-semibold mb-4">Add New Chord</h2>
        <AddChordForm onAdded={handleChordAdded} />
      </div>

      {/* 🎶 Chord grid */}
      {loading ? (
        <p className="text-center text-gray-400">Loading chords...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : chords.length === 0 ? (
        <p className="text-center text-gray-400">No chords yet. Add one above!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {chords.map(chord => (
            <ChordCard key={chord.id} chord={chord} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
