# PHASE 3B: SHUFFLE & REPEAT MODES

## Claude Code Prompt

```
I'm implementing Phase 3B (Shuffle & Repeat) for the PRIMEAPE music website.

Please implement the following:
1. Shuffle mode with proper randomization
2. Repeat modes (off → all → one)
3. State persistence using localStorage
4. UI buttons for shuffle and repeat

Context:
- Phase 2 complete (basic player working)
- Phase 3A complete (volume control)
- useAudioPlayer hook manages playback state

Follow the detailed instructions below and implement all files exactly as specified.
```

---

## Overview

**Sub-Phase:** 3B  
**Feature:** Shuffle & Repeat Modes  
**Complexity:** Moderate  
**Time Estimate:** 1 hour

**What Will Be Built:**
- Shuffle toggle button (randomizes track order)
- Repeat button with 3 states (off → all → one)
- Shuffle queue management
- State persistence via localStorage
- Visual indicators for active modes

**Dependencies:**
- Phase 2 complete
- Phase 3A complete (optional - can do in parallel)

---

## Files to Create

```
src/components/Player/ShuffleButton.tsx
src/components/Player/ShuffleButton.css
src/components/Player/RepeatButton.tsx
src/components/Player/RepeatButton.css
src/utils/shuffleArray.ts
```

## Files to Modify

```
src/hooks/useAudioPlayer.ts (add shuffle/repeat logic)
src/components/Player/Player.tsx (add shuffle/repeat buttons)
```

---

## Implementation Instructions

### File: `src/utils/shuffleArray.ts`

**📁 CREATE NEW FILE:**

```typescript
/**
 * Fisher-Yates shuffle algorithm
 * Creates a new shuffled array without modifying the original
 * 
 * @param array - Array to shuffle
 * @returns New shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Get next item from shuffled queue
 * If current item is last in queue, reshuffle and start over
 * 
 * @param currentItem - Current item
 * @param originalArray - Original unshuffled array
 * @param shuffledQueue - Current shuffled queue
 * @returns Object with nextItem and newQueue
 */
export function getNextShuffledItem<T>(
  currentItem: T,
  originalArray: T[],
  shuffledQueue: T[]
): { nextItem: T; newQueue: T[] } {
  const currentIndex = shuffledQueue.findIndex(item => item === currentItem);
  
  // If at end of queue, reshuffle
  if (currentIndex === -1 || currentIndex >= shuffledQueue.length - 1) {
    const newQueue = shuffleArray(originalArray);
    return {
      nextItem: newQueue[0],
      newQueue,
    };
  }
  
  // Return next item in current queue
  return {
    nextItem: shuffledQueue[currentIndex + 1],
    newQueue: shuffledQueue,
  };
}

/**
 * Get previous item from shuffled queue
 * 
 * @param currentItem - Current item
 * @param shuffledQueue - Current shuffled queue
 * @returns Previous item or current if at start
 */
export function getPreviousShuffledItem<T>(
  currentItem: T,
  shuffledQueue: T[]
): T {
  const currentIndex = shuffledQueue.findIndex(item => item === currentItem);
  
  if (currentIndex <= 0) {
    return currentItem; // Stay at first item
  }
  
  return shuffledQueue[currentIndex - 1];
}
```

---

### File: `src/hooks/useAudioPlayer.ts`

**🔍 FIND:**
```typescript
  const [volume, setVolumeState] = useState(0.7); // Default 70%
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef(0.7);
```

**➕ ADD AFTER:**
```typescript
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const shuffledQueueRef = useRef<number[]>([]);
```

**🔍 FIND:**
```typescript
  // ========== LOAD VOLUME FROM LOCALSTORAGE ==========
  useEffect(() => {
    const savedVolume = localStorage.getItem('primeape_volume');
    const savedMuted = localStorage.getItem('primeape_muted');
    
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      if (!isNaN(vol) && vol >= 0 && vol <= 1) {
        setVolumeState(vol);
        previousVolumeRef.current = vol;
      }
    }
    
    if (savedMuted === 'true') {
      setIsMuted(true);
    }
  }, []);
```

**✏️ REPLACE WITH:**
```typescript
  // ========== LOAD PREFERENCES FROM LOCALSTORAGE ==========
  useEffect(() => {
    const savedVolume = localStorage.getItem('primeape_volume');
    const savedMuted = localStorage.getItem('primeape_muted');
    const savedShuffle = localStorage.getItem('primeape_shuffle');
    const savedRepeat = localStorage.getItem('primeape_repeat');
    
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      if (!isNaN(vol) && vol >= 0 && vol <= 1) {
        setVolumeState(vol);
        previousVolumeRef.current = vol;
      }
    }
    
    if (savedMuted === 'true') {
      setIsMuted(true);
    }

    if (savedShuffle === 'true') {
      setIsShuffled(true);
      // Initialize shuffled queue
      const allTrackIds = FOUNDATION_ALBUM.tracks.map(t => t.id);
      shuffledQueueRef.current = shuffleArray(allTrackIds);
    }

    if (savedRepeat && (savedRepeat === 'off' || savedRepeat === 'all' || savedRepeat === 'one')) {
      setRepeatMode(savedRepeat as RepeatMode);
    }
  }, []);
```

**🔍 FIND:**
```typescript
import { FOUNDATION_ALBUM, getTrackById, getNextTrackId, getPreviousTrackId } from '@/data/album';
```

**✏️ REPLACE WITH:**
```typescript
import { FOUNDATION_ALBUM, getTrackById, getNextTrackId, getPreviousTrackId } from '@/data/album';
import { shuffleArray, getNextShuffledItem, getPreviousShuffledItem } from '@/utils/shuffleArray';
```

**🔍 FIND:**
```typescript
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
```

**✏️ REPLACE WITH:**
```typescript
  // ========== NEXT TRACK ==========
  const nextTrack = useCallback(() => {
    if (currentTrackId === null) return;
    
    let nextId: number;

    if (isShuffled) {
      // Get next from shuffled queue
      const allTrackIds = FOUNDATION_ALBUM.tracks.map(t => t.id);
      const { nextItem, newQueue } = getNextShuffledItem(
        currentTrackId,
        allTrackIds,
        shuffledQueueRef.current
      );
      shuffledQueueRef.current = newQueue;
      nextId = nextItem;
    } else {
      // Normal sequential order
      nextId = getNextTrackId(currentTrackId);
    }

    loadTrack(nextId);
    
    // Auto-play next track if currently playing
    if (playbackState === 'playing') {
      setTimeout(() => play(), 100);
    }
  }, [currentTrackId, playbackState, isShuffled, loadTrack, play]);
```

**🔍 FIND:**
```typescript
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
```

**✏️ REPLACE WITH:**
```typescript
  // ========== PREVIOUS TRACK ==========
  const prevTrack = useCallback(() => {
    if (currentTrackId === null) return;

    const audio = audioRef.current;
    
    // If more than 3 seconds into song, restart current track
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevId: number;

    if (isShuffled) {
      // Get previous from shuffled queue
      prevId = getPreviousShuffledItem(currentTrackId, shuffledQueueRef.current);
    } else {
      // Normal sequential order
      prevId = getPreviousTrackId(currentTrackId);
    }

    loadTrack(prevId);
    
    // Auto-play previous track if currently playing
    if (playbackState === 'playing') {
      setTimeout(() => play(), 100);
    }
  }, [currentTrackId, playbackState, isShuffled, loadTrack, play]);
```

**🔍 FIND:**
```typescript
    // Track ended
    const handleEnded = () => {
      setPlaybackState('paused');
      // Auto-advance to next track
      nextTrack();
    };
```

**✏️ REPLACE WITH:**
```typescript
    // Track ended
    const handleEnded = () => {
      if (repeatMode === 'one') {
        // Repeat current track
        if (audio) {
          audio.currentTime = 0;
          play();
        }
      } else if (repeatMode === 'all' || repeatMode === 'off') {
        // Advance to next track (will loop with 'all', stop at end with 'off')
        setPlaybackState('paused');
        
        // Check if we're at the last track with repeat off
        if (repeatMode === 'off' && !isShuffled) {
          const isLastTrack = currentTrackId === FOUNDATION_ALBUM.tracks[FOUNDATION_ALBUM.tracks.length - 1].id;
          if (isLastTrack) {
            // Don't auto-advance, stop playback
            return;
          }
        }
        
        nextTrack();
      }
    };
```

**🔍 FIND:**
```typescript
  }, [nextTrack, playbackState]);
```

**✏️ REPLACE WITH:**
```typescript
  }, [nextTrack, playbackState, repeatMode, isShuffled, currentTrackId, play]);
```

**🔍 FIND (add new functions before the toggleMute function):**
```typescript
  // ========== TOGGLE MUTE ==========
  const toggleMute = useCallback(() => {
```

**➕ ADD BEFORE:**
```typescript
  // ========== TOGGLE SHUFFLE ==========
  const toggleShuffle = useCallback(() => {
    const newShuffleState = !isShuffled;
    setIsShuffled(newShuffleState);
    
    // Save to localStorage
    localStorage.setItem('primeape_shuffle', newShuffleState.toString());
    
    if (newShuffleState) {
      // Create shuffled queue when enabling shuffle
      const allTrackIds = FOUNDATION_ALBUM.tracks.map(t => t.id);
      shuffledQueueRef.current = shuffleArray(allTrackIds);
    } else {
      // Clear shuffle queue when disabling
      shuffledQueueRef.current = [];
    }
  }, [isShuffled]);

  // ========== TOGGLE REPEAT ==========
  const toggleRepeat = useCallback(() => {
    // Cycle through: off → all → one → off
    let newRepeatMode: RepeatMode;
    
    if (repeatMode === 'off') {
      newRepeatMode = 'all';
    } else if (repeatMode === 'all') {
      newRepeatMode = 'one';
    } else {
      newRepeatMode = 'off';
    }
    
    setRepeatMode(newRepeatMode);
    
    // Save to localStorage
    localStorage.setItem('primeape_repeat', newRepeatMode);
  }, [repeatMode]);
```

**🔍 FIND:**
```typescript
interface UseAudioPlayerReturn {
  // State
  currentTrackId: number | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  audioVersion: AudioVersion;
  volume: number;
  isMuted: boolean;
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
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // Refs
  audioRef: React.RefObject<HTMLAudioElement>;
}
```

**✏️ REPLACE WITH:**
```typescript
interface UseAudioPlayerReturn {
  // State
  currentTrackId: number | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  audioVersion: AudioVersion;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
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
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  
  // Refs
  audioRef: React.RefObject<HTMLAudioElement>;
}
```

**🔍 FIND:**
```typescript
  return {
    // State
    currentTrackId,
    playbackState,
    currentTime,
    duration,
    audioVersion,
    volume,
    isMuted,
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
    
    // Refs
    audioRef,
  };
```

**✏️ REPLACE WITH:**
```typescript
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
  };
```

---

### File: `src/components/Player/ShuffleButton.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React from 'react';
import './ShuffleButton.css';

interface ShuffleButtonProps {
  isShuffled: boolean;
  onToggle: () => void;
}

/**
 * ShuffleButton Component
 * 
 * Toggle button for shuffle mode.
 * Active state indicated by color change.
 * 
 * @param isShuffled - Whether shuffle mode is active
 * @param onToggle - Callback when button clicked
 */
const ShuffleButton: React.FC<ShuffleButtonProps> = ({
  isShuffled,
  onToggle,
}) => {
  return (
    <button
      className={`shuffle-button ${isShuffled ? 'shuffle-button--active' : ''}`}
      onClick={onToggle}
      aria-label={isShuffled ? 'Disable shuffle' : 'Enable shuffle'}
      title={isShuffled ? 'Shuffle: On' : 'Shuffle: Off'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    </button>
  );
};

export default ShuffleButton;
```

---

### File: `src/components/Player/ShuffleButton.css`

**📁 CREATE NEW FILE:**

```css
.shuffle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: var(--space-xs);
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.shuffle-button:hover {
  color: var(--color-text-primary);
  background-color: var(--color-border);
}

.shuffle-button:active {
  transform: scale(0.95);
}

.shuffle-button:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* Active state */
.shuffle-button--active {
  color: var(--color-active);
}

.shuffle-button--active:hover {
  color: var(--color-hover);
  background-color: var(--color-border);
}

/* Dot indicator for active state */
.shuffle-button--active::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: var(--color-active);
  border-radius: var(--radius-full);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .shuffle-button {
    width: 40px;
    height: 40px;
  }
}
```

---

### File: `src/components/Player/RepeatButton.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React from 'react';
import type { RepeatMode } from '@/types';
import './RepeatButton.css';

interface RepeatButtonProps {
  repeatMode: RepeatMode;
  onToggle: () => void;
}

/**
 * RepeatButton Component
 * 
 * Toggle button for repeat modes (off → all → one).
 * Shows different icons for each mode.
 * 
 * @param repeatMode - Current repeat mode ('off' | 'all' | 'one')
 * @param onToggle - Callback when button clicked (cycles modes)
 */
const RepeatButton: React.FC<RepeatButtonProps> = ({
  repeatMode,
  onToggle,
}) => {
  const getTitle = () => {
    if (repeatMode === 'off') return 'Repeat: Off';
    if (repeatMode === 'all') return 'Repeat: All';
    return 'Repeat: One';
  };

  return (
    <button
      className={`repeat-button ${repeatMode !== 'off' ? 'repeat-button--active' : ''}`}
      onClick={onToggle}
      aria-label={`Repeat mode: ${repeatMode}`}
      title={getTitle()}
    >
      {/* Repeat icon (base) */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>

      {/* "1" overlay for repeat-one mode */}
      {repeatMode === 'one' && (
        <span className="repeat-button__one">1</span>
      )}
    </button>
  );
};

export default RepeatButton;
```

---

### File: `src/components/Player/RepeatButton.css`

**📁 CREATE NEW FILE:**

```css
.repeat-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: var(--space-xs);
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.repeat-button:hover {
  color: var(--color-text-primary);
  background-color: var(--color-border);
}

.repeat-button:active {
  transform: scale(0.95);
}

.repeat-button:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* Active state (repeat all or repeat one) */
.repeat-button--active {
  color: var(--color-active);
}

.repeat-button--active:hover {
  color: var(--color-hover);
  background-color: var(--color-border);
}

/* Dot indicator for active state */
.repeat-button--active::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background-color: var(--color-active);
  border-radius: var(--radius-full);
}

/* "1" overlay for repeat-one mode */
.repeat-button__one {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  color: currentColor;
  pointer-events: none;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .repeat-button {
    width: 40px;
    height: 40px;
  }

  .repeat-button__one {
    font-size: 11px;
  }
}
```

---

### File: `src/components/Player/Player.tsx`

**🔍 FIND:**
```typescript
import VolumeControl from './VolumeControl';
import './Player.css';
```

**✏️ REPLACE WITH:**
```typescript
import VolumeControl from './VolumeControl';
import ShuffleButton from './ShuffleButton';
import RepeatButton from './RepeatButton';
import './Player.css';
```

**🔍 FIND:**
```typescript
  const {
    currentTrackId,
    playbackState,
    currentTime,
    duration,
    volume,
    isMuted,
    error,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    audioRef,
  } = useAudioPlayer();
```

**✏️ REPLACE WITH:**
```typescript
  const {
    currentTrackId,
    playbackState,
    currentTime,
    duration,
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
    audioRef,
  } = useAudioPlayer();
```

**🔍 FIND:**
```typescript
      {/* Volume Control */}
      <VolumeControl
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={setVolume}
        onMuteToggle={toggleMute}
      />

      {/* Placeholder for additional controls (Phase 3B-F) */}
      {/* Shuffle, Repeat, Vocal/Instrumental toggle will go here */}
    </div>
```

**✏️ REPLACE WITH:**
```typescript
      {/* Secondary Controls Row */}
      <div className="player__secondary-controls">
        {/* Shuffle Button */}
        <ShuffleButton
          isShuffled={isShuffled}
          onToggle={toggleShuffle}
        />

        {/* Volume Control */}
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onMuteToggle={toggleMute}
        />

        {/* Repeat Button */}
        <RepeatButton
          repeatMode={repeatMode}
          onToggle={toggleRepeat}
        />
      </div>

      {/* Placeholder for additional controls (Phase 3C-F) */}
      {/* Vocal/Instrumental toggle will go here */}
    </div>
```

**🔍 FIND (in Player.css file):**
```css
.player {
  width: 100%;
  max-width: var(--player-max-width);
  margin: 0 auto;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
```

**➕ ADD AFTER:**
```css
.player__secondary-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
}
```

---

## Validation Checklist

After implementing Phase 3B, verify:

### Functionality:
- [ ] Shuffle button toggles on/off
- [ ] When shuffle is on, tracks play in random order
- [ ] When shuffle is off, tracks play in album order
- [ ] Repeat button cycles: off → all → one → off
- [ ] Repeat off: stops after last track
- [ ] Repeat all: loops back to first track after last
- [ ] Repeat one: repeats current track indefinitely
- [ ] Shuffle + Repeat all works together correctly
- [ ] Shuffle + Repeat one works correctly
- [ ] Previous track works in shuffle mode
- [ ] States persist after page refresh

### Visual:
- [ ] Shuffle button shows active state (colored + dot)
- [ ] Repeat button shows active state for "all" and "one"
- [ ] Repeat one shows "1" overlay on icon
- [ ] Buttons positioned nicely with volume control
- [ ] Mobile: all buttons accessible and properly sized

### Edge Cases:
- [ ] Shuffle with only 1-2 tracks uploaded doesn't crash
- [ ] Disabling shuffle mid-playback doesn't break
- [ ] Changing repeat mode mid-playback applies immediately
- [ ] Shuffle queue reshuffles when reaching end
- [ ] Previous button respects shuffle order

### Technical:
- [ ] TypeScript compiles with no errors
- [ ] No console errors or warnings
- [ ] localStorage keys: `primeape_shuffle` and `primeape_repeat`
- [ ] Shuffle uses Fisher-Yates algorithm correctly

### Accessibility:
- [ ] Buttons have proper aria-labels
- [ ] Keyboard: Tab to focus, Enter/Space to activate
- [ ] Screen reader announces mode changes
- [ ] Tooltips show on hover

---

## Known Pitfalls

### Pitfall 1: Shuffle Not Truly Random
**Problem:** Same track appears twice in a row  
**Solution:** Fisher-Yates algorithm prevents this  
**Verify:** Play through full shuffled queue - no duplicates until reshuffle

### Pitfall 2: Repeat One + Next Button
**Problem:** Next button doesn't work in repeat one mode  
**Expected:** Next button should work, only auto-advance repeats  
**Implementation:** nextTrack/prevTrack always work, handleEnded checks repeat

### Pitfall 3: Shuffle Queue Lost on Refresh
**Problem:** Shuffle order changes after refresh  
**Expected:** Shuffle state persists, but order regenerates (this is OK)  
**Alternative:** Save queue to localStorage if strict persistence needed

### Pitfall 4: Previous Track in Shuffle
**Problem:** Previous goes to wrong track in shuffle  
**Solution:** Track shuffled queue position, navigate within queue  
**Verify:** Play track 5 → track 12 → previous should go back to 5

### Pitfall 5: Repeat All at Last Track
**Problem:** Doesn't loop back to first  
**Solution:** handleEnded checks repeatMode and calls nextTrack  
**Test:** Let last track finish - should auto-play track 1

---

## Testing Instructions

### Manual Test Steps:

1. **Shuffle On:**
   - Click shuffle button (should turn active color)
   - Play through 3-4 tracks
   - Verify tracks are not in sequential order
   - Check previous button goes to previous shuffled track

2. **Shuffle Off:**
   - Click shuffle button again (should turn grey)
   - Skip to next track
   - Verify tracks play in album order (1, 2, 3, etc.)

3. **Repeat Off:**
   - Ensure repeat button is grey (off state)
   - Skip to last track (track 16)
   - Let it finish
   - Verify playback stops (doesn't auto-advance)

4. **Repeat All:**
   - Click repeat button once (should show active color)
   - Skip to last track
   - Let it finish
   - Verify it auto-advances to track 1

5. **Repeat One:**
   - Click repeat button twice (should show "1" on icon)
   - Let current track finish
   - Verify same track restarts
   - Click next button
   - Verify it advances (button overrides repeat)

6. **Persistence:**
   - Enable shuffle and repeat all
   - Refresh page (F5)
   - Verify shuffle button is active
   - Verify repeat button shows "all" state

7. **Edge Case: Rapid Mode Changes:**
   - While playing, rapidly toggle shuffle 5 times
   - Verify no crashes or console errors
   - Playback continues smoothly

### Console Test:

```javascript
// Check localStorage
localStorage.getItem('primeape_shuffle') // "true" or "false"
localStorage.getItem('primeape_repeat') // "off" | "all" | "one"
```

---

## Completion Criteria

Phase 3B is complete when:
- ✅ All checklist items verified
- ✅ Shuffle randomizes correctly
- ✅ All repeat modes work as expected
- ✅ States persist across reloads
- ✅ No TypeScript or console errors
- ✅ Works on desktop and mobile

**Next:** Proceed to `phase-3c-waveform-progress.md`

---

# END OF PHASE 3B INSTRUCTIONS
