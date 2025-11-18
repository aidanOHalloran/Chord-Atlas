// ./src/static/noteOrder.ts

import { extractRoot, normalizeRoot } from "./noteUtils";

/**
 * Canonical ordering for musical notes.
 * Enharmonics have been normalized to sharps.
 */
export const ROOT_ORDER = [
  "A",
  "A#",
  "B",
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
];

/**
 * Compare two chord names by root (ascending or descending).
 */
export const compareChordRoots =
  (direction: "asc" | "desc" = "asc") =>
  (a: { name: string }, b: { name: string }) => {
    const rootA = normalizeRoot(extractRoot(a.name));
    const rootB = normalizeRoot(extractRoot(b.name));

    const indexA = ROOT_ORDER.indexOf(rootA);
    const indexB = ROOT_ORDER.indexOf(rootB);

    if (direction === "asc") return indexA - indexB;
    return indexB - indexA;
  };
