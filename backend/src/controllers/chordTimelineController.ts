import { Request, Response } from "express";
import { ChordTimeline } from "../models/ChordTimeline";

export const getTimelineBySongId = async (req: Request, res: Response) => {
  try {
    const { songId } = req.params;
    const timeline = await ChordTimeline.findAll({
      where: { song_id: songId },
      order: [["start_time", "ASC"]],
    });
    res.json(timeline);
  } catch (err) {
    console.error("❌ Error fetching chord timeline:", err);
    res.status(500).json({ error: "Failed to load chord timeline" });
  }
};
