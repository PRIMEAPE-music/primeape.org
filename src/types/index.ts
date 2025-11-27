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
  description: string;
  price: number;
  category: 'clothing' | 'music' | 'art';
  images: string[]; // array of image URLs (first image is primary)
  sizes?: string[]; // for clothing items
  dimensions?: string[]; // for art prints
  printfulUrl: string; // direct link to Printful product page
}

export type MerchCategory = 'clothing' | 'music' | 'art';

export interface SelectedProductOptions {
  size?: string;
  dimension?: string;
}

// ============================================================================
// ANALYTICS TYPES (Phase 11)
// ============================================================================

// Re-export all analytics types from dedicated file
export * from './analytics';

// Legacy types (kept for backwards compatibility)
export interface PlayEvent {
  trackId: number;
  timestamp: number;
  audioVersion: AudioVersion;
}

export interface DownloadEvent {
  timestamp: number;
  userAgent: string;
}

// ============================================================================
// CONTACT FORM TYPES (for Phase 6)
// ============================================================================

export type ContactFormTab = 'general' | 'booking';

export type FormSubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  formType: ContactFormTab; // Hidden field for Netlify
}

export interface ShowEvent {
  id: string;
  date: string; // ISO format date string
  venue: string;
  city: string;
  state?: string;
  ticketUrl?: string;
}
