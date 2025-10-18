import express from "express";
import { getAllChords, createChord, getChordById } from "../controllers/chordController";

const router = express.Router();

// ✅ GET /api/chords — fetch all chords
router.get("/", getAllChords);

// ✅ GET /api/chords/:id — fetch one chord by ID (this fixes your 404)
router.get("/:id", getChordById);

// ✅ POST /api/chords — create a new chord
router.post("/", createChord);

export default router;
