// src/types/models.ts

export interface Chord {
  id: number;
  name: string;
  frets?: (number | string)[];
  fingers?: (number | string | null)[];
  position?: number;
  variation?: number;
  notes?: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  capo_fret: number;
  song_key: string;
  notes?: string;
  spotify_uri?: string;
  Chords?: Chord[];
}
