import { Request, Response } from "express";
import { Chord } from "../models/Chord";
import { ChordTimeline } from "../models/ChordTimeline";

// Helper to safely parse JSON fields like frets/fingers
function safeParse(value: any) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}

// @desc    Get all chords
// @route   GET /api/chords
export const getAllChords = async (_: Request, res: Response) => {
  try {
    const chords = await Chord.findAll({
      attributes: ["id", "name", "frets", "fingers"],
    });

    // Convert Sequelize models → plain objects & parse JSON safely
    const parsed = chords.map((chord) => {
      const plain = chord.get({ plain: true });
      return {
        ...plain,
        frets: safeParse(plain.frets),
        fingers: safeParse(plain.fingers),
      };
    });

    res.json(parsed);
  } catch (err) {
    console.error("❌ Error fetching chords:", err);
    res.status(500).json({ error: "Failed to fetch chords" });
  }
};

// @desc    Get a single chord by ID
// @route   GET /api/chords/:id
export const getChordById = async (req: Request, res: Response) => {
  try {
    const chord = await Chord.findByPk(req.params.id);
    if (!chord) {
      return res.status(404).json({ error: "Chord not found" });
    }

    const plain = chord.get({ plain: true });
    res.json({
      ...plain,
      frets: safeParse(plain.frets),
      fingers: safeParse(plain.fingers),
    });
  } catch (err) {
    console.error("❌ Error fetching chord by ID:", err);
    res.status(500).json({ error: "Failed to fetch chord" });
  }
};

/**
 * @desc Create a new chord (for AddChord form)
 * @route POST /api/chords
 */
export const createChord = async (req: Request, res: Response) => {
  try {
    const { name, frets, fingers, position, variation } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Chord name is required" });
    }

    // Check if it already exists
    const exists = await Chord.findOne({ where: { name } });
    if (exists) {
      return res.status(409).json({ error: "Chord already exists" });
    }

    const chord = await Chord.create({
      name,
      frets,
      fingers,
      position: position ?? 0,
      variation: variation ?? 1,
    });

    res.status(201).json(chord);
  } catch (err) {
    console.error("❌ Error creating chord:", err);
    res.status(500).json({ error: "Failed to create chord" });
  }
};

// DELETE CHORD
export const deleteChord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Chord.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Chord not found" });
    }

    return res.status(200).json({ message: "Chord deleted" });
  } catch (err) {
    console.error("[DELETE CHORD ERROR]", err);
    return res.status(500).json({ message: "Failed to delete chord" });
  }
};

/*
 * @desc Get chord timeline for a song
 * @route GET /api/chords/:songId/timeline
 */
export const getChordsTimelines = async (req: Request, res: Response) => {
  try {
    const { songId } = req.params;

    if (!songId || isNaN(Number(songId))) {
      return res.status(400).json({ error: "Invalid song ID" });
    }

    const timeline = await ChordTimeline.findAll({
      where: { song_id: songId },
      order: [["start_time", "ASC"]],
      attributes: ["chord_name", "start_time", "end_time"],
    });

    if (!timeline.length) {
      return res
        .status(404)
        .json({ message: "No chord timeline found for this song" });
    }

    res.json(timeline);
  } catch (err) {
    console.error("❌ Error fetching chord timeline:", err);
    res.status(500).json({ error: "Failed to fetch chord timeline" });
  }
};
