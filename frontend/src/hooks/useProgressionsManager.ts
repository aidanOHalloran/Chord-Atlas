import { useEffect, useState, useCallback } from "react";
import { SongService } from "../services/api";
import type { SongChordProgression, Chord } from "../types/models";

/**
 * Centralized hook for managing chord progressions per song.
 * Handles loading, reordering, updating, and adding progressions.
 */
export function useProgressionsManager(songId: number) {
  const [progressions, setProgressions] = useState<SongChordProgression[]>([]);
  const [chords, setChords] = useState<Chord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Load all progressions and chords for a song */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [songList, progressionList] = await Promise.all([
        SongService.getAll(),
        SongService.getChordProgressions(songId),
      ]);
      const song = songList.find((s) => s.id === songId);
      setChords(song?.Chords ?? []);
      setProgressions(progressionList);
    } catch (err) {
      console.error(err);
      setError("Failed to load progressions.");
    } finally {
      setLoading(false);
    }
  }, [songId]);

  useEffect(() => {
    load();
  }, [load]);

  /** Reorder the list of progressions and persist order_index values */
  const reorderProgressions = useCallback(async (updated: SongChordProgression[]) => {
    setProgressions(updated);
    for (let i = 0; i < updated.length; i++) {
      const p = updated[i];
      await fetch(`/api/progressions/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_index: i }),
      });
    }
  }, []);

  /** Update chord order inside a single progression */
  const updateChordOrder = useCallback(async (progId: number, chordIds: number[]) => {
    await fetch(`/api/progressions/${progId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chord_ids: chordIds }),
    });
  }, []);

  /** Add a new progression */
  const addProgression = useCallback(
    async (name: string, chordIds: number[]) => {
      await SongService.addChordProgression(songId, {
        progression_name: name,
        chord_ids: chordIds,
        order_index: progressions.length,
      });
    },
    [songId, progressions.length]
  );

  return {
    loading,
    error,
    progressions,
    chords,
    reorderProgressions,
    updateChordOrder,
    addProgression,
    reload: load,
  };
}
