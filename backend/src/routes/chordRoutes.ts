import express from "express";
import { getAllChords } from "../controllers/chordController";

const router = express.Router();

// GET /api/chords — list all chords
router.get("/", getAllChords);


export default router;
