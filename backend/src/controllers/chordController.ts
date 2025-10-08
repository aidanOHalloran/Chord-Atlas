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