// hooks/useChordSearch.ts
import { useState } from "react";

export const useChordSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return { searchTerm, handleChange };
};
