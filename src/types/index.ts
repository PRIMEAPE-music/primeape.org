// ============================================================================
// TRACK & ALBUM TYPES
// ============================================================================

export interface Track {
  id: number;
  title: string;
  duration: number; // in seconds
  vocalFile: string; // path to vocal version MP3
  instrumentalFile: string; // path to instrumental version MP3
  lyricsFile: string | null; // path to LRC file, null if no lyrics yet
  hasVocals: boolean; // true if vocal version is available
  waveformData?: number[]; // optional pre-generated waveform data
}

export interface Album {
  title: string;
  artist: string;
  releaseYear: number;
  artworkUrl: string; // path to album cover image
  tracks: Track[];
}

// ============================================================================
// PLAYER STATE TYPES
// ============================================================================

export type PlaybackState = 'playing' | 'paused' | 'loading' | 'stopped';

export type RepeatMode = 'off' | 'all' | 'one';

export type AudioVersion = 'vocal' | 'instrumental';

export interface PlayerState {
  currentTrackId: number | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  volume: number; // 0-1
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  audioVersion: AudioVersion;
}

// ============================================================================
// LYRICS TYPES
// ============================================================================

export interface LyricLine {
  time: number; // timestamp in seconds
  text: string;
}

export type LyricsDisplayState = 'hidden' | 'panel' | 'integrated';

// ============================================================================
// PREFERENCE TYPES
// ============================================================================

export interface UserPreferences {
  theme: 'light' | 'dark';
  volume: number;
  audioVersion: AudioVersion;
  showEqualizer: boolean;
  lyricsDisplayState: LyricsDisplayState;
}

// ============================================================================
// MERCH TYPES (for Phase 7)
// ============================================================================

export interface MerchProduct {
  id: string;
  name: string;
  price: number;
  category: 'clothing' | 'music' | 'art';
  images: string[]; // array of image URLs
  sizes?: string[]; // for clothing
  dimensions?: string[]; // for prints
  printfulUrl: string; // link to Printful product page
}

// ============================================================================
// ANALYTICS TYPES (for Phase 11)
// ============================================================================

export interface PlayEvent {
  trackId: number;
  timestamp: number;
  audioVersion: AudioVersion;
}

export interface DownloadEvent {
  timestamp: number;
  userAgent: string;
}
