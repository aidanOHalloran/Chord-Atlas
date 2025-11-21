import { useMemo, useState } from "react";
import { chordMatchesSearch, sortChordsByRoot } from "../../static/chordHelpers";
import { extractRoot, normalizeRoot } from "../../static/noteUtils";
import { ROOT_ORDER } from "../../static/noteOrder";
import type { Chord } from "../../types/models";

export function useChordFilters(chords: Chord[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [rootFilter, setRootFilter] = useState("all");

  const uniqueRoots = useMemo(() => {
    return Array.from(
      new Set(chords.map(chord => normalizeRoot(extractRoot(chord.name))))
    ).sort((a, b) => ROOT_ORDER.indexOf(a) - ROOT_ORDER.indexOf(b));
  }, [chords]);

  const filteredChords = useMemo(() => {
    let result = chords;

    // Search
    result = result.filter(c => chordMatchesSearch(c, searchTerm));

    // Filter
    if (rootFilter !== "all") {
      result = result.filter(chord => {
        const root = normalizeRoot(extractRoot(chord.name));
        return root === rootFilter;
      });
    }

    // Sort
    return sortChordsByRoot(result, sortDirection);
  }, [chords, searchTerm, rootFilter, sortDirection]);

  return {
    searchTerm,
    setSearchTerm,
    sortDirection,
    setSortDirection,
    rootFilter,
    setRootFilter,
    filteredChords,
    uniqueRoots,
  };
}
