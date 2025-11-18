// ./src/static/chordHelpers.ts

import { extractRoot } from "./noteUtils";
import { compareChordRoots } from "./noteOrder";
import type { Chord } from "../types/models";

/**
 * Search chords by:
 *  - full name
 *  - root note
 */
export const chordMatchesSearch = (chord: Chord, term: string): boolean => {
  const lower = term.toLowerCase();
  const root = extractRoot(chord.name).toLowerCase();

  return (
    chord.name.toLowerCase().includes(lower) ||
    root.includes(lower)
  );
};

/**
 * Sort chords by root note.
 */
export const sortChordsByRoot = (
  chords: Chord[],
  direction: "asc" | "desc" = "asc"
): Chord[] => {
  return [...chords].sort(compareChordRoots(direction));
};
