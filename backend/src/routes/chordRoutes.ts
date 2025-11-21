import express from "express";
import { getAllChords, createChord, getChordById, getChordsTimelines, deleteChord } from "../controllers/chordController";
import { getTimelineBySongId } from "../controllers/chordTimelineController";

const router = express.Router();

// ✅ GET /api/chords — fetch all chords
router.get("/", getAllChords);

// ✅ GET /api/chords/:id — fetch one chord by ID (this fixes your 404)
router.get("/:id", getChordById);

// ✅ POST /api/chords — create a new chord
router.post("/", createChord);

// DELETE /api/chords/:id — delete a chord by ID
router.delete("/:id", deleteChord);

router.get("/:songId/timeline", getTimelineBySongId);

// Add route last to avoid conflict with :id
router.get("/:songId/timeline", getChordsTimelines);
export default router;
