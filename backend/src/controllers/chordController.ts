import { Request, Response } from "express";
import { Chord } from "../models/Chord";

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
    const parsed = chords.map(chord => {
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