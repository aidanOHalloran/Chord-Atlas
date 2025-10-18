import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Chord } from "../types/models";
import ChordCard from "../components/Chords/ChordCard/ChordCard";
import { allTunings, getStringTooltips } from "../static/guitarTunings";

export default function ChordDetailPage() {
  const { id } = useParams();
  const [chord, setChord] = useState<Chord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

  useEffect(() => {
    if (!id) return;
    const fetchChord = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/chords/${id}`);
        setChord(res.data);
      } catch (err) {
        console.error("❌ Error fetching chord:", err);
        setError("Chord not found or server error");
      } finally {
        setLoading(false);
      }
    };
    fetchChord();
  }, [id]);

  if (loading) return <p className="text-gray-400 text-center mt-10">Loading chord...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!chord) return <p className="text-gray-400 text-center mt-10">Chord not found.</p>;

  // 🎵 Display tuning info (Standard for now)
  const tuning = allTunings["Standard (EADGBE)"];
  const stringTips = getStringTooltips(tuning.notes);


  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-gray-200">
      {/* 🔙 Back link */}
      <Link to="/chords" className="text-sm text-gray-400 hover:text-blue-400">
        ← Back to Library
      </Link>

      {/* 🎸 Chord title */}
      <h1 className="text-4xl font-bold text-blue-400 mt-4 mb-2">{chord.name}</h1>
      <p className="text-gray-400 mb-4">
        Variation {chord.variation ?? 1} · Position {chord.position ?? 0}
      </p>

      {/* 🪕 Chord visualization */}
      <div className="flex justify-center mb-8">
        <ChordCard chord={chord} onDelete={() => {}} />
      </div>

      {/* 🧩 Raw data panel */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-700 shadow-lg">
        <h3 className="text-xl font-semibold text-blue-300 mb-3">Chord Data</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p><strong>Frets:</strong> {JSON.stringify(chord.frets)}</p>
          <p><strong>Fingers:</strong> {JSON.stringify(chord.fingers)}</p>
          <p><strong>Tuning:</strong> {tuning.notes.join(" - ")}</p>
          <p><strong>Tooltips:</strong> {stringTips.join(" | ")}</p>
        </div>
      </div>

      {/* Future notes or description */}
      {chord.notes && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-blue-300 mb-2">Notes</h3>
          <p className="text-gray-400 whitespace-pre-line">{chord.notes}</p>
        </div>
      )}
    </div>
  );
}
