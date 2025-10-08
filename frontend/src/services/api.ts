import axios from "axios";
import type { Song, Chord } from "../types/models";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Example: typed API calls
export const SongService = {
  async getAll(): Promise<Song[]> {
    const res = await api.get<Song[]>("/songs");
    return res.data;
  },
};

export const ChordService = {
  async getAll(): Promise<Chord[]> {
    const res = await api.get<Chord[]>("/chords");
    return res.data;
  },
};

export default api;
