# EXECUTE: Phase 5 Part 2 - Integrate Tracklist into Player

**Prompt for Claude Code:**
"Please implement Phase 5 Part 2 by integrating the Tracklist component into the Player layout and adding the track selection handler. Follow all implementation instructions exactly as specified below."

---

## Part 2: Integrate Tracklist into Player Component

### Change 1: Import Tracklist Component

**File:** `src/components/Player/Player.tsx`

**Find the import section** (around lines 1-20):

```typescript
import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { getTrackById, FOUNDATION_ALBUM } from '@/data/album';
import Artwork from './Artwork';
import TrackInfo from './TrackInfo';
import TimeDisplay from './TimeDisplay';
import WaveformBar from './WaveformBar';
import Controls from './Controls';
import VolumeControl from './VolumeControl';
import ShuffleButton from './ShuffleButton';
import RepeatButton from './RepeatButton';
import EqualizerToggle from './EqualizerToggle';
import VersionToggle from './VersionToggle';
import LyricsToggle from '../Lyrics/LyricsToggle';
import LyricsPanel from '../Lyrics/LyricsPanel';
import LyricsBox from '../Lyrics/LyricsBox';
import { useLyrics } from '@/hooks/useLyrics';
import KeyboardShortcutsHelp from '../KeyboardShortcutsHelp/KeyboardShortcutsHelp';
import './Player.css';
```

**Add the Tracklist import after the existing imports:**

```typescript
import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { getTrackById, FOUNDATION_ALBUM } from '@/data/album';
import Artwork from './Artwork';
import TrackInfo from './TrackInfo';
import TimeDisplay from './TimeDisplay';
import WaveformBar from './WaveformBar';
import Controls from './Controls';
import VolumeControl from './VolumeControl';
import ShuffleButton from './ShuffleButton';
import RepeatButton from './RepeatButton';
import EqualizerToggle from './EqualizerToggle';
import VersionToggle from './VersionToggle';
import LyricsToggle from '../Lyrics/LyricsToggle';
import LyricsPanel from '../Lyrics/LyricsPanel';
import LyricsBox from '../Lyrics/LyricsBox';
import Tracklist from '../Tracklist/Tracklist';
import { useLyrics } from '@/hooks/useLyrics';
import KeyboardShortcutsHelp from '../KeyboardShortcutsHelp/KeyboardShortcutsHelp';
import './Player.css';
```

---

### Change 2: Add Track Selection Handler

**File:** `src/components/Player/Player.tsx`

**Find the useAudioPlayer hook destructuring** (around line 44-68):

```typescript
  const {
    currentTrackId,
    playbackState,
    currentTime,
    duration,
    audioVersion,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    error,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleVersion,
    audioRef,
    audioContext,
    sourceNode,
  } = useAudioPlayer();
```

**This already includes `loadTrack` from useAudioPlayer - verify it's exposed.**

**Add the track selection handler after the keyboard shortcuts useEffect** (around line 110-145):

Find this section:
```typescript
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: togglePlayPause,
    onNext: nextTrack,
    onPrevious: prevTrack,
    // ... rest of keyboard shortcuts
    isEnabled: true,
  });
```

**Add after the closing parenthesis and semicolon:**

```typescript
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: togglePlayPause,
    onNext: nextTrack,
    onPrevious: prevTrack,
    onSeekForward: () => {
      const newTime = Math.min(currentTime + 10, duration);
      seek(newTime);
    },
    onSeekBackward: () => {
      const newTime = Math.max(currentTime - 10, 0);
      seek(newTime);
    },
    onVolumeUp: () => {
      const newVolume = Math.min(volume + 0.05, 1);
      setVolume(newVolume);
    },
    onVolumeDown: () => {
      const newVolume = Math.max(volume - 0.05, 0);
      setVolume(newVolume);
    },
    onMute: toggleMute,
    onShuffle: toggleShuffle,
    onRepeat: toggleRepeat,
    isEnabled: true,
  });

  // Handle track selection from tracklist
  const handleTrackSelect = (trackId: number) => {
    // If clicking the same track that's already loaded
    if (trackId === currentTrackId) {
      // Toggle play/pause
      togglePlayPause();
    } else {
      // Load and play new track
      loadTrack(trackId);
      // Auto-play after a short delay to let track load
      setTimeout(() => {
        if (playbackState !== 'playing') {
          togglePlayPause();
        }
      }, 100);
    }
  };
```

---

### Change 3: Add Tracklist to JSX Layout

**File:** `src/components/Player/Player.tsx`

**Find the player__main-area div** (around line 150-165):

```typescript
      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
        {/* Central Column: Artwork + Track Info + Time + Waveform */}
        <div className="player__center-column">
```

**Add the Tracklist BEFORE the center column:**

```typescript
      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
        {/* Tracklist (LEFT side, desktop only) */}
        <div className="player__floating-box player__floating-box--tracklist">
          <Tracklist
            tracks={FOUNDATION_ALBUM.tracks}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            onTrackSelect={handleTrackSelect}
          />
        </div>

        {/* Central Column: Artwork + Track Info + Time + Waveform */}
        <div className="player__center-column">
```

---

## Part 3: Update Player CSS for Tracklist Layout

### Change 4: Add Tracklist Floating Box Styles

**File:** `src/components/Player/Player.css`

**Find the "FLOATING BOX CONTAINERS" section** (around line 60-75):

```css
/* ============================================================================
   FLOATING BOX CONTAINERS
   ============================================================================ */

.player__floating-box {
  flex-shrink: 0;
  align-self: center;
}

/* Hide floating boxes on tablet and mobile */
@media (max-width: 1099px) {
  .player__floating-box {
    display: none !important;
  }
}

/* Show floating boxes on desktop */
@media (min-width: 1100px) {
  .player__floating-box {
    display: block;
  }

  .player__floating-box--lyrics {
    /* No order needed - just flexbox natural flow */
  }

  /* Artwork naturally centers */
  .player__main-area .artwork {
    align-self: center;
  }
}
```

**Add the tracklist-specific styles inside the desktop media query:**

```css
/* ============================================================================
   FLOATING BOX CONTAINERS
   ============================================================================ */

.player__floating-box {
  flex-shrink: 0;
  align-self: center;
}

/* Hide floating boxes on tablet and mobile */
@media (max-width: 1099px) {
  .player__floating-box {
    display: none !important;
  }
}

/* Show floating boxes on desktop */
@media (min-width: 1100px) {
  .player__floating-box {
    display: block;
  }

  /* Tracklist box - LEFT side */
  .player__floating-box--tracklist {
    width: 380px;
    height: 750px;
    order: -1; /* Ensure tracklist appears first (LEFT) */
  }

  /* Lyrics box - RIGHT side */
  .player__floating-box--lyrics {
    order: 1; /* Ensure lyrics appears last (RIGHT) */
  }

  /* Artwork naturally centers */
  .player__main-area .artwork {
    align-self: center;
  }
}
```

---

### Change 5: Verify loadTrack is Exposed from useAudioPlayer

**File:** `src/hooks/useAudioPlayer.ts`

**Find the return statement** at the bottom of the hook (around line 300-330):

```typescript
  // ========== RETURN API ==========
  return {
    // State
    currentTrackId,
    playbackState,
    currentTime,
    duration,
    audioVersion,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    error,
    
    // Actions
    play,
    pause,
    togglePlayPause,
    loadTrack,
    nextTrack,
    prevTrack,
    seek,
    toggleVersion,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    
    // Refs
    audioRef,
    audioContext,
    sourceNode,
  };
}
```

**Verify `loadTrack` is included in the returned object.** If it's not there, add it:

```typescript
    // Actions
    play,
    pause,
    togglePlayPause,
    loadTrack,  // ← Make sure this line exists
    nextTrack,
    prevTrack,
```

---

## Validation Checklist - Part 2

After implementing these changes, verify:

### Compilation
- [ ] TypeScript compiles without errors
- [ ] No missing import errors
- [ ] `loadTrack` is available from useAudioPlayer

### Visual Layout (Desktop ≥1100px)
- [ ] Tracklist appears on LEFT side
- [ ] Tracklist is 380px wide and 750px tall
- [ ] Center column (artwork, track info, etc.) stays centered
- [ ] Lyrics panel (when visible) appears on RIGHT side
- [ ] Layout: Tracklist (LEFT) | Center Column | Lyrics (RIGHT)

### Functionality
- [ ] Tracklist displays all 16 tracks
- [ ] Clicking a track loads and plays it
- [ ] Clicking the current track toggles play/pause
- [ ] Current track is highlighted in tracklist
- [ ] Play/pause icon shows for current track
- [ ] Tracklist auto-scrolls to keep current track visible

### Mobile/Tablet (<1100px)
- [ ] Tracklist is hidden (display: none)
- [ ] Player layout remains functional without tracklist

**Next Step:** Execute Phase 5 Part 3 to add mobile tracklist view (if needed) or proceed to Phase 6.
