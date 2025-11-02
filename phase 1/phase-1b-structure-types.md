# PHASE 1B: FOLDER STRUCTURE & TYPE DEFINITIONS

## Part Overview
Create the complete folder structure and centralized TypeScript type definitions. This establishes the project organization and type system that all future phases will build upon.

## What Gets Created
- Complete `src/` folder structure
- `src/types/index.ts` - All TypeScript interfaces
- `src/data/album.ts` - Album metadata and helper functions
- `src/vite-env.d.ts` - Vite TypeScript declarations
- `public/` folder structure with `.gitkeep` files
- `src/hooks/README.md` - Placeholder for future custom hooks

## Step-by-Step Instructions

### Step 1: Create Complete Folder Structure

Create these folders inside `src/`:

```bash
mkdir -p src/components/Layout
mkdir -p src/hooks
mkdir -p src/styles
mkdir -p src/types
mkdir -p src/data
mkdir -p src/utils
```

Create these folders inside `public/`:

```bash
mkdir -p public/music/vocal
mkdir -p public/music/instrumental
mkdir -p public/lyrics
mkdir -p public/artwork
```

**Folder Purpose:**
- `src/components/` - React components organized by feature
- `src/hooks/` - Custom React hooks (will be used in Phase 2+)
- `src/styles/` - Global CSS files and theme system
- `src/types/` - Centralized TypeScript type definitions
- `src/data/` - Static data like album metadata
- `src/utils/` - Pure utility functions (will be added in later phases)
- `public/music/` - MP3 audio files (not in Git)
- `public/lyrics/` - LRC lyric files
- `public/artwork/` - Album art and images

### Step 2: Create Vite Environment Types

**File:** `src/vite-env.d.ts`

This file provides TypeScript declarations for Vite:

```typescript
/// <reference types="vite/client" />
```

**Purpose:** Allows TypeScript to understand Vite-specific features and imports.

### Step 3: Create TypeScript Type Definitions

**File:** `src/types/index.ts`

This is the central type definition file for the entire project:

```typescript
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
```

**Type Design Notes:**
- All types defined upfront for consistency across phases
- Union types (`'playing' | 'paused'`) ensure only valid values
- Optional properties marked with `?`
- Comments explain each field's purpose
- Types organized by feature area

### Step 4: Create Album Metadata

**File:** `src/data/album.ts`

This file contains all track metadata and helper functions:

```typescript
import { Album, Track } from '@/types';

/**
 * FOUNDATION Album Metadata
 * 
 * NOTE: Duration values are placeholders (180 seconds = 3:00 for each track).
 * Update these with actual durations after uploading real MP3 files.
 * 
 * hasVocals is set to false for all tracks initially since only instrumentals
 * are uploaded. Set to true for each track as vocal versions are added.
 */

const tracks: Track[] = [
  {
    id: 1,
    title: 'A GOOD DAY',
    duration: 180,
    vocalFile: '/music/vocal/01-A-GOOD-DAY.mp3',
    instrumentalFile: '/music/instrumental/01-A-GOOD-DAY-instrumental.mp3',
    lyricsFile: null, // Will be '/lyrics/01-A-GOOD-DAY.lrc' when ready
    hasVocals: false, // Set to true when vocal version is uploaded
  },
  {
    id: 2,
    title: 'AWARENESS',
    duration: 180,
    vocalFile: '/music/vocal/02-AWARENESS.mp3',
    instrumentalFile: '/music/instrumental/02-AWARENESS-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 3,
    title: 'MOTIVATIONS',
    duration: 180,
    vocalFile: '/music/vocal/03-MOTIVATIONS.mp3',
    instrumentalFile: '/music/instrumental/03-MOTIVATIONS-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 4,
    title: 'HISTORY',
    duration: 180,
    vocalFile: '/music/vocal/04-HISTORY.mp3',
    instrumentalFile: '/music/instrumental/04-HISTORY-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 5,
    title: 'VICE',
    duration: 180,
    vocalFile: '/music/vocal/05-VICE.mp3',
    instrumentalFile: '/music/instrumental/05-VICE-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 6,
    title: 'LIGHT',
    duration: 180,
    vocalFile: '/music/vocal/06-LIGHT.mp3',
    instrumentalFile: '/music/instrumental/06-LIGHT-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 7,
    title: 'DEGRADATION',
    duration: 180,
    vocalFile: '/music/vocal/07-DEGRADATION.mp3',
    instrumentalFile: '/music/instrumental/07-DEGRADATION-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 8,
    title: 'RESISTANCE',
    duration: 180,
    vocalFile: '/music/vocal/08-RESISTANCE.mp3',
    instrumentalFile: '/music/instrumental/08-RESISTANCE-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 9,
    title: 'TEMPORARY',
    duration: 180,
    vocalFile: '/music/vocal/09-TEMPORARY.mp3',
    instrumentalFile: '/music/instrumental/09-TEMPORARY-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 10,
    title: 'JOY',
    duration: 180,
    vocalFile: '/music/vocal/10-JOY.mp3',
    instrumentalFile: '/music/instrumental/10-JOY-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 11,
    title: 'CREATION',
    duration: 180,
    vocalFile: '/music/vocal/11-CREATION.mp3',
    instrumentalFile: '/music/instrumental/11-CREATION-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 12,
    title: 'TECHNOLOGY',
    duration: 180,
    vocalFile: '/music/vocal/12-TECHNOLOGY.mp3',
    instrumentalFile: '/music/instrumental/12-TECHNOLOGY-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 13,
    title: 'CACHE',
    duration: 180,
    vocalFile: '/music/vocal/13-CACHE.mp3',
    instrumentalFile: '/music/instrumental/13-CACHE-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 14,
    title: 'GRANDEUR',
    duration: 180,
    vocalFile: '/music/vocal/14-GRANDEUR.mp3',
    instrumentalFile: '/music/instrumental/14-GRANDEUR-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 15,
    title: 'BATTLES',
    duration: 180,
    vocalFile: '/music/vocal/15-BATTLES.mp3',
    instrumentalFile: '/music/instrumental/15-BATTLES-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  {
    id: 16,
    title: 'ELEVATION',
    duration: 180,
    vocalFile: '/music/vocal/16-ELEVATION.mp3',
    instrumentalFile: '/music/instrumental/16-ELEVATION-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
];

export const FOUNDATION_ALBUM: Album = {
  title: 'FOUNDATION',
  artist: 'PRIMEAPE',
  releaseYear: 2025,
  artworkUrl: '/artwork/foundation-cover.jpg', // Placeholder - update when artwork ready
  tracks,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a track by its ID
 * @param id - Track ID to find
 * @returns Track object or undefined if not found
 */
export const getTrackById = (id: number): Track | undefined => {
  return tracks.find((track) => track.id === id);
};

/**
 * Get the next track ID in sequence
 * @param currentId - Current track ID
 * @returns Next track ID (loops back to first track at end)
 */
export const getNextTrackId = (currentId: number): number => {
  const currentIndex = tracks.findIndex((track) => track.id === currentId);
  if (currentIndex === -1 || currentIndex === tracks.length - 1) {
    return tracks[0].id; // Loop back to first track
  }
  return tracks[currentIndex + 1].id;
};

/**
 * Get the previous track ID in sequence
 * @param currentId - Current track ID
 * @returns Previous track ID (loops to last track at beginning)
 */
export const getPreviousTrackId = (currentId: number): number => {
  const currentIndex = tracks.findIndex((track) => track.id === currentId);
  if (currentIndex === -1 || currentIndex === 0) {
    return tracks[tracks.length - 1].id; // Loop to last track
  }
  return tracks[currentIndex - 1].id;
};
```

**Data Structure Notes:**
- All 16 tracks defined with placeholder durations (3:00 each)
- `hasVocals: false` until vocal versions uploaded
- Helper functions for track navigation (next/prev with looping)
- Easy to update as files are added

### Step 5: Create .gitkeep Files

Create empty `.gitkeep` files to preserve folder structure in Git:

**File:** `public/music/vocal/.gitkeep`
```
(empty file)
```

**File:** `public/music/instrumental/.gitkeep`
```
(empty file)
```

**File:** `public/lyrics/.gitkeep`
```
(empty file)
```

**File:** `public/artwork/.gitkeep`
```
(empty file)
```

**Why .gitkeep?** Git doesn't track empty folders. These files tell Git to keep the folders even though they're empty.

### Step 6: Create Hooks Directory Placeholder

**File:** `src/hooks/README.md`

```markdown
# Custom Hooks

This directory will contain custom React hooks for:

- `useAudioPlayer.ts` - Audio playback logic (Phase 2)
- `useLyrics.ts` - Lyrics loading and syncing (Phase 4)
- `useWaveform.ts` - Waveform generation (Phase 3)
- `useEqualizer.ts` - Frequency analysis (Phase 3)
- `usePreferences.ts` - localStorage management (Phase 9)

Hooks will be added in their respective phases.
```

**Purpose:** Documents what will go in this folder and when.

## Validation Checklist

After completing Part 1B, verify:

### Folder Structure
- [ ] `src/components/Layout/` folder exists
- [ ] `src/hooks/` folder exists
- [ ] `src/styles/` folder exists
- [ ] `src/types/` folder exists
- [ ] `src/data/` folder exists
- [ ] `public/music/vocal/` folder exists
- [ ] `public/music/instrumental/` folder exists
- [ ] `public/lyrics/` folder exists
- [ ] `public/artwork/` folder exists

### Files Created
- [ ] `src/vite-env.d.ts` exists
- [ ] `src/types/index.ts` exists with all type definitions
- [ ] `src/data/album.ts` exists with 16 tracks
- [ ] `src/hooks/README.md` exists
- [ ] All 4 `.gitkeep` files exist in public folders

### TypeScript Validation

Run this command to check if types are valid:
```bash
npx tsc --noEmit
```

Should complete with no errors. (If you see errors about missing App.tsx, that's fine - we'll create it in Part 1E)

### Data Validation

The album data should have:
- [ ] Exactly 16 tracks defined
- [ ] All track IDs are sequential (1-16)
- [ ] All track titles are in UPPERCASE
- [ ] All `hasVocals` properties are `false`
- [ ] All `lyricsFile` properties are `null`
- [ ] Helper functions are defined (getTrackById, getNextTrackId, getPreviousTrackId)

## Common Issues & Solutions

### Issue 1: TypeScript can't find @/types
**Problem:** Import like `import { Track } from '@/types'` shows error
**Solution:** This is normal - TypeScript path aliases won't work until we have Vite running. Will be resolved in Part 1E.

### Issue 2: .gitkeep files not showing in editor
**Problem:** Hidden files might not be visible
**Solution:** Enable "Show Hidden Files" in your editor. The files exist even if you can't see them.

### Issue 3: Folder structure is confusing
**Reference:** Each folder has a specific purpose:
- `components/` = UI components (React)
- `hooks/` = Reusable logic (custom hooks)
- `types/` = TypeScript definitions
- `data/` = Static data (not state)
- `styles/` = CSS files
- `public/` = Static assets served from root

## Next Step
Proceed to **Part 1C: CSS Foundation & Theme System** (`phase-1c-css-foundation.md`)
