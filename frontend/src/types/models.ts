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

export interface SongChordProgression {
  id: number;
  song_id: number;
  progression_name: string;      // "Verse", "Chorus", "Bridge", etc.
  chord_ids: number[];           // stored JSON array from backend
  chords?: Chord[];              // optionally populated by backend
  order_index?: number;           // new field to determine order of progressions
  created_at?: string;
}
