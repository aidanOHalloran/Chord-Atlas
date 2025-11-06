import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Chord } from "../types/models";
import ChordCard from "../components/Chords/ChordCard/ChordCard";
import { allTunings, getStringTooltips } from "../static/guitarTunings";
import FretPositions from "../components/Chords/ChordDetails/FretPositions";
import FingerPositions from "../components/Chords/ChordDetails/FingerPositions";
import GuitarTuning from "../components/Chords/ChordDetails/GuitarTuning";
import StringNotes from "../components/Chords/ChordDetails/StringNotes";

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
  
  // reverse the order of each tip
  stringTips.forEach((tip, index) => {
    stringTips[index] = tip;
    stringTips.reverse();
  });


  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-8 text-gray-200 max-w-6xl mx-auto"
    >
      {/* 🔙 Back link */}
      <Link 
        to="/chords" 
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 text-gray-200 bg-neutral-800 hover:bg-neutral-700 hover:text-blue-400 transition-all duration-200"
      >
        ← Back to Chord Library
      </Link>

      {/*  Center the title */}
      <div className="text-center">
        {/* 🎸 Chord title */}
        <h1 className="text-4xl font-bold text-blue-400 mt-4 mb-2">{chord.name}</h1>
        <p className="text-gray-400 mb-4">
          Variation {chord.variation ?? 1} · Position {chord.position ?? 0}
        </p>
      </div>

      {/* 🪕 Chord visualization */}
      <div className="flex justify-center mb-8">
        <ChordCard chord={chord} onDelete={() => { }} />
      </div>

      {/* 🧩 Chord details panel */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-6 border border-neutral-600 shadow-xl">
        <h3 className="text-2xl font-bold text-blue-300 mb-6 flex items-center">
          <span className="mr-2">🎸</span>
          Chord Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FretPositions frets={chord.frets || []} />
          <FingerPositions fingers={chord.fingers || []} />
          <GuitarTuning notes={tuning.notes} />
          <StringNotes tips={stringTips} />
        </div>
      </div>

      {/* Future notes or description */}
      {chord.notes && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-blue-300 mb-2">Notes</h3>
          <p className="text-gray-400 whitespace-pre-line">{chord.notes}</p>
        </div>
      )}
    </motion.div>
  );
}
