// ./src/static/noteUtils.ts

/**
 * Extracts the root note from a chord name.
 * Examples:
 *   "C#m7" → "C#"
 *   "Fmaj7" → "F"
 *   "Bbadd9" → "Bb"
 *   "A/C#" → "A"
 */
export const extractRoot = (name: string): string => {
  const match = name.match(/^[A-G][b#]?/i);
  return match ? match[0].toUpperCase() : "";
};

/**
 * Normalizes enharmonic equivalents to the same canonical spelling.
 * We use sharp keys as canonical (Db → C#, Eb → D#, etc.)
 */
export const normalizeRoot = (root: string): string => {
  const map: Record<string, string> = {
    "A": "A",
    "A#": "A#",
    "Bb": "A#",

    "B": "B",
    "Cb": "B",
    "B#": "C",

    "C": "C",
    "C#": "C#",
    "Db": "C#",

    "D": "D",
    "D#": "D#",
    "Eb": "D#",

    "E": "E",
    "Fb": "E",
    "E#": "F",

    "F": "F",
    "F#": "F#",
    "Gb": "F#",

    "G": "G",
    "G#": "G#",
    "Ab": "G#",
  };

  return map[root] ?? root;
};
