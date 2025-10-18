// ./frontend/src/static/guitarTunings.ts

/**
 * Common guitar tunings with both string labels and metadata
 * Each tuning is represented from **low → high** (left → right on guitar diagrams)
 */

export const standardTuning = ["E", "A", "D", "G", "B", "E"];
export const dropDTuning = ["D", "A", "D", "G", "B", "E"];
export const openGTuning = ["D", "G", "D", "G", "B", "D"];
export const halfStepDownTuning = ["D#", "G#", "C#", "F#", "A#", "D#"];
export const wholeStepDownTuning = ["D", "G", "C", "F", "A", "D"];
export const dropCTuning = ["C", "G", "C", "F", "A", "D"];

/**
 * Rich tuning data with helper info for tooltips and drop-downs
 */
export const allTunings = {
  "Standard (EADGBE)": {
    name: "Standard",
    notes: standardTuning,
    description: "Most common tuning for guitar (E A D G B E)",
  },
  "Drop D (DADGBE)": {
    name: "Drop D",
    notes: dropDTuning,
    description: "Lowers the 6th string to D for power chords and heavier sound",
  },
  "Open G (DGDGBD)": {
    name: "Open G",
    notes: openGTuning,
    description: "Used in blues and slide guitar; open strum gives G major",
  },
  "Half Step Down (D#G#C#F#A#D#)": {
    name: "Half Step Down",
    notes: halfStepDownTuning,
    description: "Common in rock/metal for slightly lower pitch and easier bends",
  },
  "Whole Step Down (DGCFAD)": {
    name: "Whole Step Down",
    notes: wholeStepDownTuning,
    description: "Lower pitch and thicker tone, used by some metal players",
  },
  "Drop C (CGCFAD)": {
    name: "Drop C",
    notes: dropCTuning,
    description: "Aggressive low tuning common in modern heavy genres",
  },
};

/**
 * Helper to get note + string index info for tooltips
 * @param tuning Array of 6 string notes, low → high
 * @returns Array of tooltip strings like ["6th string – Low E", ...]
 */
export const getStringTooltips = (tuning: string[]): string[] => {
  const stringLabels = ["6th", "5th", "4th", "3rd", "2nd", "1st"];
  return tuning.map((note, i) => `${stringLabels[i]} string – ${note}`);
};
