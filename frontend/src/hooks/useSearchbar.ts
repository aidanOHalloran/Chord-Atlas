import { useState, type ChangeEvent, type FormEvent } from "react";
import type { SongFilters } from "../types/filters";

export const useSearchbar = () => {
  const [filters, setFilters] = useState<SongFilters>({
    searchTerm: "",
    artist: "",
    song_key: "",
    capo_fret: null,
  });

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: value }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  return { filters, setFilters, handleChange };
};
