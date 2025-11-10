import { Request, Response } from "express";
import { SongChordProgression } from "../models/SongChordProgressions";

/**
 * @desc Get all chord progressions for a song
 * @route GET /api/songs/:id/progressions
 */
export const getSongChordProgressions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const progressions = await SongChordProgression.findAll({
      where: { song_id: id },
      order: [["order_index", "ASC"]],
    });
    res.json(progressions);
  } catch (err) {
    console.error("❌ Error fetching chord progressions:", err);
    res.status(500).json({ error: "Failed to fetch chord progressions" });
  }
};

/**
 * @desc Create a new chord progression for a song
 * @route POST /api/songs/:id/progressions
 */
export const createSongChordProgression = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { progression_name, chord_ids, order_index } = req.body;

    if (!progression_name || !Array.isArray(chord_ids)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const newProgression = await SongChordProgression.create({
      song_id: id,
      progression_name,
      chord_ids,
      order_index: order_index ?? 0,
    });

    res.status(201).json(newProgression);
  } catch (err) {
    console.error("❌ Error creating chord progression:", err);
    res.status(500).json({ error: "Failed to create chord progression" });
  }
};

/**
 * @desc Update a chord progression by ID
 * @route PUT /api/progressions/:id
 */
export const updateChordProgression = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { order_index, chord_ids, progression_name } = req.body;

    const updateData: any = {};
    if (order_index !== undefined) updateData.order_index = order_index;
    if (Array.isArray(chord_ids)) updateData.chord_ids = chord_ids;
    if (progression_name) updateData.progression_name = progression_name;

    const [updatedCount] = await SongChordProgression.update(updateData, {
      where: { id },
    });

    if (updatedCount === 0) {
      return res.status(404).json({ error: "Progression not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error updating chord progression:", err);
    res.status(500).json({ error: "Failed to update chord progression" });
  }
};

/**
 * @desc Delete a chord progression by ID
 * @route DELETE /api/progressions/:id
 */
export const deleteChordProgression = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await SongChordProgression.destroy({ where: { id } });

    if (deletedCount === 0) {
      return res.status(404).json({ error: "Progression not found" });
    }

    res.json({ success: true, message: `Progression ${id} deleted` });
  } catch (err) {
    console.error("❌ Error deleting chord progression:", err);
    res.status(500).json({ error: "Failed to delete chord progression" });
  }
};
