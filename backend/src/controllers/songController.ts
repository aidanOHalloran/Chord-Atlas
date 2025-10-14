import { Request, Response } from "express";
import { Song } from "../models/Song";
import { Chord } from "../models/Chord";
import { SongChord } from "../models/SongChord";
import { Op } from "sequelize";

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

// ✅ POST /api/songs — Create new song + add missing chords
export const createSong = async (req: Request, res: Response) => {
  try {
    const { title, artist, song_key, notes, chords } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: "Title and artist are required" });
    }

    // Ensure chords is an array (can be optional)
    const chordNames = Array.isArray(chords) ? chords : [];

    // 1️⃣ Find existing chords
    const existingChords = chordNames.length
      ? await Chord.findAll({ where: { name: { [Op.in]: chordNames } } })
      : [];
    const existingNames = existingChords.map((c) => c.name);

    // 2️⃣ Identify and prepare new chords
    const newChords = chordNames
      .filter((name) => !existingNames.includes(name))
      .map((name) => ({
        name,
        frets: JSON.stringify([]),
        fingers: JSON.stringify([]),
        position: 0,
        variation: 1,
      }));

    // 3️⃣ Bulk insert missing chords
    if (newChords.length > 0) {
      await Chord.bulkCreate(newChords);
    }

    // 4️⃣ Re-fetch all chords (existing + newly added)
    const allChords = chordNames.length
      ? await Chord.findAll({ where: { name: { [Op.in]: chordNames } } })
      : [];

    // 5️⃣ Create the new song
    const song = await Song.create({ title, artist, song_key, notes });

    // 6️⃣ Associate chords with the song (if any)
    if (allChords.length > 0) {
      await song.set("Chords", allChords);
    }

    // 7️⃣ Return the created song with chords included
    const result = await Song.findByPk(song.id, {
      include: [{ model: Chord, attributes: ["id", "name", "frets", "fingers"] }],
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error creating song with chords:", err);
    res.status(500).json({ error: "Failed to create song" });
  }
};