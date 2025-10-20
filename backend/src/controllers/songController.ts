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
      attributes: ["id", "title", "artist", "capo_fret", "song_key", "notes"],
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
      plainSong.Chords = (plainSong.Chords || []).map((chord: any) => ({
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


// @desc    Get song by ID with chords
// @route   GET /api/songs/:id
export const getSongById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const song = await Song.findByPk(id, {
      include: [
        {
          model: Chord,
          attributes: ["id", "name", "frets", "fingers"],
          through: { attributes: [] },
        },
      ],
    });

    if (!song) return res.status(404).json({ error: "Song not found" });

    // Parse JSON-encoded frets/fingers
    const parsed = song.get({ plain: true });
    parsed.Chords = parsed.Chords.map((ch: any) => ({
      ...ch,
      frets: safeParse(ch.frets),
      fingers: safeParse(ch.fingers),
    }));

    res.json(parsed);
  } catch (err) {
    console.error("❌ Error fetching song by ID:", err);
    res.status(500).json({ error: "Failed to fetch song" });
  }
};


export const createSong = async (req: Request, res: Response) => {
  try {
    const { title, artist, capo_fret, song_key, notes, chordIds } = req.body;

    if (!title || !artist) {
      return res.status(400).json({ error: "Title and artist are required" });
    }

    // Create song
    const song = await Song.create({ title, artist, capo_fret, song_key, notes });

    // Associate existing chords by ID
    if (Array.isArray(chordIds) && chordIds.length > 0) {
      const chords = await Chord.findAll({ where: { id: chordIds } });
      await song.setChords(chords); // ✅ typed correctly now
    }

    const result = await Song.findByPk(song.id, {
      include: [{ model: Chord, attributes: ["id", "name", "frets", "fingers"] }],
    });

    res.status(201).json(result);
  } catch (err) {
    console.error("❌ Error creating song with chords:", err);
    res.status(500).json({ error: "Failed to create song" });
  }
};


// @desc    Update an existing song and its chords
// @route   PUT /api/songs/:id
export const updateSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, artist, capo_fret, song_key, notes, chordIds } = req.body;

    // Validate inputs
    const song = await Song.findByPk(id);
    if (!song) return res.status(404).json({ error: "Song not found" });

    // Update basic fields
    await song.update({ title, artist, capo_fret, song_key, notes });

    // ✅ Update chord associations (if provided)
    if (Array.isArray(chordIds)) {
      const chords = await Chord.findAll({ where: { id: chordIds } });
      await song.setChords(chords);
    }

    // Fetch updated with chords
    const updatedSong = await Song.findByPk(id, {
      include: [
        {
          model: Chord,
          attributes: ["id", "name", "frets", "fingers"],
          through: { attributes: [] },
        },
      ],
    });

    res.json(updatedSong);
  } catch (err) {
    console.error("❌ Error updating song:", err);
    res.status(500).json({ error: "Failed to update song" });
  }
};

// @desc    Delete a song by ID
// @route   DELETE /api/songs/:id
export const deleteSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const song = await Song.findByPk(id);
    if (!song) return res.status(404).json({ error: "Song not found" });

    await song.destroy();
    res.json({ message: `Song ${id} deleted` });
  } catch (err) {
    console.error("❌ Error deleting song:", err);
    res.status(500).json({ error: "Failed to delete song" });
  }
};

