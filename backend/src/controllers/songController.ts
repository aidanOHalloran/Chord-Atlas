import { Request, Response } from "express";
import { Song } from "../models/Song";
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

// @desc    Get all songs with associated chords
// @route   GET /api/songs
export const getAllSongs = async (_: Request, res: Response) => {
  try {
    const songs = await Song.findAll({
      attributes: ["id", "title", "artist", "song_key", "notes"],
      include: [
        {
          model: Chord,
          attributes: ["id", "name", "frets", "fingers"],
          through: { attributes: [] },
        },
      ],
    });

    // Convert Sequelize models → plain objects & parse JSON
    const parsed = songs.map(song => {
      const plainSong = song.get({ plain: true });
      plainSong.Chords = plainSong.Chords.map((chord: any) => ({
  ...chord,
  frets: safeParse(chord.frets),
  fingers: safeParse(chord.fingers),
}));
      return plainSong;
    });

    res.json(parsed);
  } catch (err) {
    console.error("❌ Error fetching songs:", err);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
};

// @desc    Create a new song
// @route   POST /api/songs
export const createSong = async (req: Request, res: Response) => {
  try {
    const { title, artist, song_key, notes } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: "Title and artist are required" });
    }

    const song = await Song.create({ title, artist, song_key, notes });
    res.status(201).json(song);
  } catch (err) {
    console.error("❌ Error creating song:", err);
    res.status(500).json({ error: "Failed to create song" });
  }
};
