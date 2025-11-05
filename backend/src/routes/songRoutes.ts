import express from "express";
import { getAllSongs, createSong, getSongById, updateSong, deleteSong } from "../controllers/songController";

const router = express.Router();

// GET /api/songs — list all songs
router.get("/", getAllSongs);

// GET /api/songs/:id — get song by ID
router.get("/:id", getSongById);

// POST /api/songs — create a new song
router.post("/", createSong);

// PUT /api/songs/:id — update song by ID
router.put("/:id", updateSong);

// DELETE /api/songs/:id — delete song by ID
router.delete("/:id", deleteSong); // (optional if not yet added)

export default router;
