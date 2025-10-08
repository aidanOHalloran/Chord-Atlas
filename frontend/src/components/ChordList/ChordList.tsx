import type { Chord } from "../../types/models";

interface ChordListProps {
  chords: Chord[];
}

export default function ChordList({ chords }: ChordListProps) {
  return (
    <ul>
      {chords.map((ch) => (
        <li key={ch.id}>{ch.name}</li>
      ))}
    </ul>
  );
}
