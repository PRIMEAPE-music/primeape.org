# PHASE 2B: CORE AUDIO PLAYER HOOK

## Part Overview
Create the main audio player hook (`useAudioPlayer`) that manages all audio playback logic. This is the most complex and important part of Phase 2 - the brain of the music player.

## What Gets Created
- `src/hooks/useAudioPlayer.ts` - Main audio player hook with all playback logic

## Why This is Complex
This hook manages:
- HTMLAudioElement lifecycle
- Web Audio API context (for Phase 3 equalizer)
- Playback state (playing, paused, loading, stopped)
- Track loading and switching
- Seeking functionality
- Vocal/instrumental toggling
- Error handling
- Event listeners
- Auto-advance to next track

## Prerequisites
✅ Part 2A complete - formatTime and useAudioTime hooks exist

## Step-by-Step Instructions

### Step 1: Understand the Audio Architecture

**Audio Flow Diagram:**
```
HTMLAudioElement (playback control)
    ↓
MediaElementSourceNode (bridge)
    ↓
AnalyserNode (Phase 3 - for waveform/equalizer)
    ↓
AudioContext.destination (speakers)
```

**Why Hybrid Approach?**
- `HTMLAudioElement` - Easy playback control, built-in buffering
- Web Audio API Context - Needed for frequency analysis in Phase 3
- Connect audio element to context so we can analyze later

### Step 2: Create the Hook File

**File:** `src/hooks/useAudioPlayer.ts`

This is a large file - I'll break it down by section:

```typescript
import { useState, useRef, useEffect, useCallback } from 'react';
import type { PlaybackState, AudioVersion } from '@/types';
import { FOUNDATION_ALBUM, getTrackById, getNextTrackId, getPreviousTrackId } from '@/data/album';

interface UseAudioPlayerReturn {
  // State
  currentTrackId: number | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  audioVersion: AudioVersion;
  error: string | null;
  
  // Actions
  play: () => Promise<void>;
  pause: () => void;
  togglePlayPause: () => void;
  loadTrack: (trackId: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  toggleVersion: () => void;
  
  // Refs
  audioRef: React.RefObject<HTMLAudioElement>;
}

/**
 * useAudioPlayer Hook
 * 
 * Manages all audio playback logic for the music player.
 * Handles loading tracks, playback control, seeking, and error handling.
 * 
 * @returns Audio player state and control methods
 */
export function useAudioPlayer(): UseAudioPlayerReturn {
  // ========== STATE ==========
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(1); // Start with first track
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioVersion, setAudioVersion] = useState<AudioVersion>('instrumental');
  const [error, setError] = useState<string | null>(null);

  // ========== REFS ==========
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // ========== INITIALIZE AUDIO CONTEXT (for Phase 3 equalizer) ==========
  useEffect(() => {
    // Create AudioContext on mount (will be used in Phase 3)
    // Only create once per session
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Connect audio element to context when ref is available
    if (audioRef.current && audioContextRef.current && !sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceNodeRef.current.connect(audioContextRef.current.destination);
    }

    // Cleanup
    return () => {
      // Don't close AudioContext here - keep it alive for entire session
      // Will be used for equalizer in Phase 3
    };
  }, []);

  // ========== LOAD TRACK ==========
  const loadTrack = useCallback((trackId: number) => {
    const track = getTrackById(trackId);
    if (!track) {
      setError(`Track ${trackId} not found`);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    // Determine which file to load based on audioVersion and track.hasVocals
    const fileToLoad = audioVersion === 'vocal' && track.hasVocals
      ? track.vocalFile
      : track.instrumentalFile;

    setPlaybackState('loading');
    setError(null);
    setCurrentTrackId(trackId);

    // Set audio source
    audio.src = fileToLoad;
    audio.load();

    // Note: Don't call play() here - let user click play button
    // This prevents autoplay policy violations
  }, [audioVersion]);

  // ========== PLAY ==========
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      // Resume AudioContext if suspended (browser autoplay policy)
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      await audio.play();
      setPlaybackState('playing');
      setError(null);
    } catch (err) {
      console.error('Playback error:', err);
      setError('Failed to play audio. Please try again.');
      setPlaybackState('paused');
    }
  }, []);

  // ========== PAUSE ==========
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setPlaybackState('paused');
  }, []);

  // ========== TOGGLE PLAY/PAUSE ==========
  const togglePlayPause = useCallback(() => {
    if (playbackState === 'playing') {
      pause();
    } else {
      play();
    }
  }, [playbackState, play, pause]);

  // ========== NEXT TRACK ==========
  const nextTrack = useCallback(() => {
    if (currentTrackId === null) return;
    
    const nextId = getNextTrackId(currentTrackId);
    loadTrack(nextId);
    
    // Auto-play next track if currently playing
    if (playbackState === 'playing') {
      // Small delay to ensure track loads
      setTimeout(() => play(), 100);
    }
  }, [currentTrackId, playbackState, loadTrack, play]);

  // ========== PREVIOUS TRACK ==========
  const prevTrack = useCallback(() => {
    if (currentTrackId === null) return;

    const audio = audioRef.current;
    
    // If more than 3 seconds into song, restart current track
    // Otherwise, go to previous track
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      const prevId = getPreviousTrackId(currentTrackId);
      loadTrack(prevId);
      
      // Auto-play previous track if currently playing
      if (playbackState === 'playing') {
        setTimeout(() => play(), 100);
      }
    }
  }, [currentTrackId, playbackState, loadTrack, play]);

  // ========== SEEK ==========
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(time)) return;

    // Clamp time to valid range
    const clampedTime = Math.max(0, Math.min(time, audio.duration || 0));
    audio.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  }, []);

  // ========== TOGGLE VERSION (Vocal/Instrumental) ==========
  const toggleVersion = useCallback(() => {
    const newVersion: AudioVersion = audioVersion === 'vocal' ? 'instrumental' : 'vocal';
    const audio = audioRef.current;
    const track = currentTrackId ? getTrackById(currentTrackId) : null;

    if (!audio || !track) return;

    // Save current playback state
    const wasPlaying = playbackState === 'playing';
    const savedTime = audio.currentTime;

    // Switch version
    setAudioVersion(newVersion);

    // Determine new file
    const newFile = newVersion === 'vocal' && track.hasVocals
      ? track.vocalFile
      : track.instrumentalFile;

    // Load new file
    audio.src = newFile;
    audio.load();

    // Restore playback position after metadata loads
    const restorePlayback = () => {
      audio.currentTime = savedTime;
      if (wasPlaying) {
        play();
      }
      audio.removeEventListener('loadedmetadata', restorePlayback);
    };

    audio.addEventListener('loadedmetadata', restorePlayback);
  }, [audioVersion, currentTrackId, playbackState, play]);

  // ========== AUDIO EVENT LISTENERS ==========
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Time update (fallback - main time tracking in useAudioTime)
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Duration loaded
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setPlaybackState('paused'); // Ready to play
    };

    // Playback can start
    const handleCanPlay = () => {
      if (playbackState === 'loading') {
        setPlaybackState('paused');
      }
    };

    // Track ended
    const handleEnded = () => {
      setPlaybackState('paused');
      // Auto-advance to next track
      nextTrack();
    };

    // Error handling
    const handleError = () => {
      console.error('Audio error:', audio.error);
      setError(audio.error?.message || 'Failed to load audio file');
      setPlaybackState('stopped');
    };

    // Attach listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Cleanup
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [nextTrack, playbackState]);

  // ========== LOAD FIRST TRACK ON MOUNT ==========
  useEffect(() => {
    if (currentTrackId) {
      loadTrack(currentTrackId);
    }
  }, []); // Only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // ========== RETURN API ==========
  return {
    // State
    currentTrackId,
    playbackState,
    currentTime,
    duration,
    audioVersion,
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
    
    // Refs
    audioRef,
  };
}
```

### Step 3: Understand Each Section

**Section 1: State Management**
```typescript
const [currentTrackId, setCurrentTrackId] = useState<number | null>(1);
const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
```
- Tracks which song is playing
- Tracks playback state (playing/paused/loading/stopped)
- All state triggers re-renders when changed

**Section 2: Refs for Audio Elements**
```typescript
const audioRef = useRef<HTMLAudioElement>(null);
const audioContextRef = useRef<AudioContext | null>(null);
```
- `audioRef` - Reference to the `<audio>` DOM element
- `audioContextRef` - Web Audio API context (for Phase 3)
- `sourceNodeRef` - Bridge between audio element and context

**Section 3: Audio Context Setup**
```typescript
if (!audioContextRef.current) {
  audioContextRef.current = new AudioContext();
}
```
- Creates AudioContext once on mount
- Connects audio element to context
- Keeps context alive for Phase 3 (equalizer needs it)

**Section 4: loadTrack Function**
```typescript
const loadTrack = useCallback((trackId: number) => {
  const track = getTrackById(trackId);
  audio.src = fileToLoad;
  audio.load();
}, [audioVersion]);
```
- Loads a specific track by ID
- Chooses vocal or instrumental based on `audioVersion`
- Sets loading state
- Does NOT auto-play (prevents autoplay violations)

**Section 5: play/pause/togglePlayPause**
```typescript
const play = useCallback(async () => {
  await audioContextRef.current.resume();
  await audio.play();
}, []);
```
- `play()` is async (browser might block it)
- Resumes AudioContext if suspended (autoplay policy)
- Handles errors gracefully

**Section 6: Track Navigation**
```typescript
const nextTrack = useCallback(() => {
  const nextId = getNextTrackId(currentTrackId);
  loadTrack(nextId);
  if (playbackState === 'playing') {
    setTimeout(() => play(), 100);
  }
}, [currentTrackId, playbackState, loadTrack, play]);
```
- `nextTrack()` - Goes to next track, auto-plays if currently playing
- `prevTrack()` - Restarts song if > 3 seconds, otherwise goes to previous
- Uses helper functions from album.ts

**Section 7: Seek Function**
```typescript
const seek = useCallback((time: number) => {
  const clampedTime = Math.max(0, Math.min(time, audio.duration));
  audio.currentTime = clampedTime;
}, []);
```
- Clamps time to valid range (0 to duration)
- Sets audio element's currentTime
- Works while playing or paused

**Section 8: toggleVersion Function**
```typescript
const toggleVersion = useCallback(() => {
  const wasPlaying = playbackState === 'playing';
  const savedTime = audio.currentTime;
  
  // Load new file
  audio.src = newFile;
  audio.load();
  
  // Restore position and playback state
  audio.addEventListener('loadedmetadata', restorePlayback);
}, [audioVersion, currentTrackId, playbackState, play]);
```
- Switches between vocal and instrumental
- Saves current position and playback state
- Restores position after new file loads
- Seamless transition (no audio gap)

**Section 9: Event Listeners**
```typescript
audio.addEventListener('timeupdate', handleTimeUpdate);
audio.addEventListener('loadedmetadata', handleLoadedMetadata);
audio.addEventListener('canplay', handleCanPlay);
audio.addEventListener('ended', handleEnded);
audio.addEventListener('error', handleError);
```
- `timeupdate` - Updates current time (backup for useAudioTime)
- `loadedmetadata` - Duration is available, ready to play
- `canplay` - Enough data buffered to start playback
- `ended` - Track finished, auto-advance to next
- `error` - Audio failed to load, show error message

**Section 10: Cleanup**
All event listeners are removed in cleanup function to prevent memory leaks.

## Critical Implementation Notes

### Memory Management
```typescript
return () => {
  audio.removeEventListener('timeupdate', handleTimeUpdate);
  // ... remove all listeners
};
```
**Why:** Event listeners persist after unmount. Must clean up to avoid memory leaks.

### useCallback Usage
```typescript
const play = useCallback(async () => {
  // ...
}, []);
```
**Why:** Prevents function recreation on every render. Dependencies array ensures function updates when needed.

### Previous Track Logic
```typescript
if (audio.currentTime > 3) {
  audio.currentTime = 0; // Restart
} else {
  prevTrack(); // Go to previous
}
```
**Why:** Matches Spotify/Apple Music behavior. User expectation.

### Autoplay Policy Handling
```typescript
if (audioContextRef.current?.state === 'suspended') {
  await audioContextRef.current.resume();
}
```
**Why:** Browsers suspend AudioContext until user interaction. Must resume before playing.

## Validation Checklist

After completing Part 2B, verify:

### File Created
- [ ] `src/hooks/useAudioPlayer.ts` exists

### TypeScript Validation
```bash
npx tsc --noEmit
```
Should complete with no errors.

### Code Quality Check
- [ ] All functions use useCallback
- [ ] All event listeners have cleanup
- [ ] Error handling present in play() function
- [ ] JSDoc comments present
- [ ] No `any` types (except for webkitAudioContext fallback)
- [ ] Import statements correct

### Interface Check
- [ ] UseAudioPlayerReturn interface matches returned object
- [ ] All state properties typed correctly
- [ ] All action functions typed correctly
- [ ] audioRef has correct type

### Logic Check
- [ ] prevTrack checks currentTime > 3
- [ ] nextTrack uses getNextTrackId helper
- [ ] loadTrack sets loading state
- [ ] toggleVersion saves and restores playback state
- [ ] seek clamps time to valid range

## Common Issues & Solutions

### Issue 1: "AudioContext is not defined"
**Problem:** Web Audio API not available
**Solution:** This shouldn't happen in modern browsers, but check browser compatibility

### Issue 2: "Cannot read property 'play' of null"
**Problem:** audioRef.current is null
**Solution:** Ensure audio element is rendered before calling play()

### Issue 3: "The play() request was interrupted"
**Problem:** Trying to play before previous play completed
**Solution:** Already handled with try/catch in play() function

### Issue 4: Event listeners not cleaning up
**Problem:** Memory leak
**Solution:** Verify cleanup function returns removeEventListener calls

### Issue 5: toggleVersion causes audio gap
**Problem:** Not waiting for metadata to load
**Solution:** Listen for 'loadedmetadata' event before restoring time

### Issue 6: Auto-advance not working
**Problem:** nextTrack not called in 'ended' event
**Solution:** Verify handleEnded calls nextTrack()

## Testing Strategy (Preview)

You won't be able to fully test this hook until Part 2C (when we create the UI components), but you can verify:

1. **TypeScript compiles** - No errors
2. **Imports resolve** - All imports from @/types and @/data work
3. **Structure is correct** - All functions defined, proper cleanup

## Performance Notes

**useCallback Dependencies:**
- Keep dependency arrays minimal
- Only include values actually used in function
- Don't include refs (they never change)

**Event Listener Cleanup:**
- Always remove ALL added listeners
- Use same function reference for add/remove
- Check DevTools Memory tab for leaks

## Accessibility Notes

**Audio Element:**
- Will need ARIA labels in component
- Keyboard control coming in Phase 3
- Focus management for controls

## Next Step

Proceed to **Part 2C: Player UI Components** (`phase-2c-player-components.md`)

In Part 2C, we'll create all the visual components that use this hook:
- Artwork display
- Track info
- Time display
- Progress bar
- Control buttons

The hook is complete - now we build the UI to control it! 🎵
