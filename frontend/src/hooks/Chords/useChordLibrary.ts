import { useEffect, useState } from "react";
import axios from "axios";
import type { Chord } from "../../types/models";

export function useChordLibrary() {
  const [chords, setChords] = useState<Chord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

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

  const deleteChord = async (id: number) => {
    await axios.delete(`${API_BASE}/chords/${id}`);
    setChords(prev => prev.filter(c => c.id !== id));
  };

  const handleChordAdded = async () => {
    await fetchChords();
  };

  useEffect(() => {
    fetchChords();
  }, []);

  return {
    chords,
    loading,
    error,
    fetchChords,
    deleteChord,
    handleChordAdded,
  };
}
