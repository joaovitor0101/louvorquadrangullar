export interface Musician {
  id: string;
  name: string;
  role: string; // e.g., "Violão", "Voz", "Bateria"
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: string;
  content: string; // The lyrics and chords
}

export interface Service {
  id: string;
  date: string;
  title: string;
  team: Musician[];
  songs: Song[];
  note: string;
}

export enum ViewMode {
  ADMIN = 'ADMIN',
  LIVE = 'LIVE'
}

export type UserRole = 'ADMIN' | 'MUSICIAN' | null;

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}