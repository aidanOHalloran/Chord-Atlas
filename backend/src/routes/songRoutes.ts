import express from "express";
import { getAllSongs, createSong } from "../controllers/songController";

const router = express.Router();

// GET /api/songs — list all songs
router.get("/", getAllSongs);

// POST /api/songs — create a new song
router.post("/", createSong);

export default router;
