import express from "express";
import { getAllChords, createChord } from "../controllers/chordController";

const router = express.Router();

// GET /api/chords — list all chords
router.get("/", getAllChords);
router.post("/", createChord);


export default router;
