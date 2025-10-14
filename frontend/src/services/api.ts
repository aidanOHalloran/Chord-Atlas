import axios from "axios";
import type { Song, Chord } from "../types/models";

const api = axios.create({
  baseURL: "/api", // let Vite handle the proxy
});

// Example: typed API calls
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
    chords?: string[];
  }) {
    const res = await fetch("/api/songs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(songData),
    });

    if (!res.ok) throw new Error("Failed to create song");
    return res.json();
  },  
};

export const ChordService = {
  async getAll(): Promise<Chord[]> {
    const res = await api.get<Chord[]>("/chords");
    return res.data;
  },
};

export default api;
