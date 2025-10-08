// src/types/models.ts

export interface Chord {
  id: number;
  name: string;
  frets?: (number | string)[];
  fingers?: (number | string)[];
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  song_key: string;
  notes?: string;
  Chords?: Chord[];
}
