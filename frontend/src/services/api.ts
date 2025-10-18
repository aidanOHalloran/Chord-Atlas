import axios from "axios";
import type { Song, Chord } from "../types/models";

const api = axios.create({
  baseURL: "/api", // let Vite proxy handle the backend URL
});

// 🎵 Song API -----------------------------------------------------
export const SongService = {
  async getAll(): Promise<Song[]> {
    const res = await api.get<Song[]>("/songs");
    return res.data;
  },

  async create(songData: {
    title: string;
    artist: string;
    song_key?: string;
    notes?: string;
    chordIds?: number[]; // 👈 matches backend relationship
  }): Promise<Song> {
    const res = await api.post<Song>("/songs", songData);
    return res.data;
  },
};

// 🎸 Chord API -----------------------------------------------------
export const ChordService = {
  async getAll(): Promise<Chord[]> {
    const res = await api.get<Chord[]>("/chords");
    return res.data;
  },

  async create(chordData: {
    name: string;
    frets: number[];
    fingers: (number | null)[];
    position?: number;
    variation?: number;
  }): Promise<Chord> {
    const res = await api.post<Chord>("/chords", chordData);
    return res.data;
  },
};

export default api;
