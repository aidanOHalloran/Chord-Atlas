// frontend/src/services/api.ts

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

  async getById(id: number): Promise<Song> {
    const res = await api.get<Song>(`/songs/${id}`);
    return res.data;
  },

  async create(songData: {
    title: string;
    artist: string;
    capo_fret?: number;
    song_key?: string;
    notes?: string;
    chordIds?: number[];
  }): Promise<Song> {
    const res = await api.post<Song>("/songs", songData);
    return res.data;
  },

  async update(id: number, songData: Partial<Song> & { chordIds?: number[] }): Promise<Song> {
    const res = await api.put<Song>(`/songs/${id}`, songData);
    return res.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/songs/${id}`);
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
