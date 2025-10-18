// ./frontend/src/static/guitarTunings.ts

export const standardTuning = ["E", "A", "D", "G", "B", "E"];

export const dropDTuning = ["D", "A", "D", "G", "B", "E"];

export const openGTuning = ["D", "G", "D", "G", "B", "D"];

export const halfStepDownTuning = ["D#", "G#", "C#", "F#", "A#", "D#"];

export const wholeStepDownTuning = ["D", "G", "C", "F", "A", "D"];

export const dropCTuning = ["C", "G", "C", "F", "A", "D"];

export const allTunings = {
  "Standard (EADGBE)": standardTuning,
  "Drop D (DADGBE)": dropDTuning,
  "Open G (DGDGBD)": openGTuning,
  "Half Step Down (D#G#C#F#A#D#)": halfStepDownTuning,
  "Whole Step Down (DGCFAD)": wholeStepDownTuning,
  "Drop C (CGCFAD)": dropCTuning,
};