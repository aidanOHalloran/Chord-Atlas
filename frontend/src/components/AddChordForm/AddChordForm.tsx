// frontend/src/components/AddChordForm/AddChordForm.tsx
import { useState } from "react";
import { ChordService } from "../../services/api";
import FretboardEditor from "./FretboardEditor";
import toast from "react-hot-toast";

export default function AddChordForm({ onAdded }: { onAdded?: () => void }) {
  const [name, setName] = useState("");
  const [frets, setFrets] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [fingers, setFingers] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a chord name");
      return;
    }
    setSaving(true);
    try {
      await ChordService.create({ name, frets, fingers });
      toast.success(`Chord “${name}” added!`);
      setName("");
      setFrets([0, 0, 0, 0, 0, 0]);
      setFingers([0, 0, 0, 0, 0, 0]);
      onAdded?.();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Failed to add chord");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-blue-400 mb-4">🎸 Add a New Chord</h2>

      <label className="block text-sm text-gray-400 mb-2">Chord Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Dm7"
        className="w-full p-2 mb-4 bg-neutral-800 border border-neutral-700 rounded focus:border-blue-500 text-gray-200"
      />

      <FretboardEditor
        frets={frets}
        fingers={fingers}
        onChange={(f, fi) => {
          setFrets(f);
          setFingers(fi);
        }}
      />

      <button
        type="submit"
        disabled={saving}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Chord"}
      </button>
    </form>
  );
}
