import express from "express";
import { updateChordProgression, deleteChordProgression } from "../controllers/progressionController";

const router = express.Router();

// top-level for direct access
router.put("/:id", updateChordProgression);
router.delete("/:id", deleteChordProgression);

export default router;
