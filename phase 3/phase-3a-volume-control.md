# PHASE 3A: VOLUME CONTROL

## Claude Code Prompt

```
I'm implementing Phase 3A (Volume Control) for the PRIMEAPE music website.

Please implement the following:
1. Volume slider component with mute toggle
2. Integration with useAudioPlayer hook
3. Volume persistence using localStorage
4. Visual feedback for volume levels

Context:
- Phase 2 complete (basic player working)
- Audio element already exists in Player component
- Need to add volume control UI and logic

Follow the detailed instructions below and implement all files exactly as specified.
```

---

## Overview

**Sub-Phase:** 3A  
**Feature:** Volume Control  
**Complexity:** Simple  
**Time Estimate:** 45 minutes

**What Will Be Built:**
- Volume slider (0-100%)
- Mute/unmute toggle button
- Volume level persistence via localStorage
- Visual feedback (volume icon changes based on level)

**Dependencies:**
- Phase 2 complete (useAudioPlayer hook exists)

---

## Files to Create

```
src/components/Player/VolumeControl.tsx
src/components/Player/VolumeControl.css
```

## Files to Modify

```
src/hooks/useAudioPlayer.ts (add volume methods)
src/components/Player/Player.tsx (add VolumeControl component)
```

---

## Implementation Instructions

### File: `src/hooks/useAudioPlayer.ts`

**🔍 FIND:**
```typescript
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

**🔍 FIND:**
```typescript
  const [audioVersion, setAudioVersion] = useState<AudioVersion>('instrumental');
  const [error, setError] = useState<string | null>(null);
```

**➕ ADD AFTER:**
```typescript
  const [volume, setVolumeState] = useState(0.7); // Default 70%
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef(0.7);
```

**🔍 FIND:**
```typescript
  // ========== INITIALIZE AUDIO CONTEXT (for Phase 3 equalizer) ==========
  useEffect(() => {
```

**➕ ADD BEFORE:**
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

  // ========== APPLY VOLUME TO AUDIO ELEMENT ==========
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);
```

**🔍 FIND:**
```typescript
  const toggleVersion = useCallback(() => {
```

**➕ ADD BEFORE:**
```typescript
  // ========== SET VOLUME ==========
  const setVolume = useCallback((newVolume: number) => {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    setVolumeState(clampedVolume);
    previousVolumeRef.current = clampedVolume;
    
    // Save to localStorage
    localStorage.setItem('primeape_volume', clampedVolume.toString());
    
    // Unmute if volume is changed while muted
    if (isMuted && clampedVolume > 0) {
      setIsMuted(false);
      localStorage.setItem('primeape_muted', 'false');
    }
  }, [isMuted]);

  // ========== TOGGLE MUTE ==========
  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Save to localStorage
    localStorage.setItem('primeape_muted', newMutedState.toString());
    
    // If unmuting and volume is 0, restore previous volume
    if (!newMutedState && volume === 0) {
      const restoreVolume = previousVolumeRef.current > 0 ? previousVolumeRef.current : 0.7;
      setVolumeState(restoreVolume);
      localStorage.setItem('primeape_volume', restoreVolume.toString());
    }
  }, [isMuted, volume]);
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

---

### File: `src/components/Player/VolumeControl.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React, { useState, useRef } from 'react';
import './VolumeControl.css';

interface VolumeControlProps {
  volume: number; // 0-1
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

/**
 * VolumeControl Component
 * 
 * Volume slider with mute toggle button.
 * Icon changes based on volume level (muted, low, medium, high).
 * 
 * @param volume - Current volume level (0-1)
 * @param isMuted - Whether audio is muted
 * @param onVolumeChange - Callback when volume changes
 * @param onMuteToggle - Callback when mute button clicked
 */
const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  /**
   * Determine which volume icon to show
   */
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return 'muted';
    } else if (volume < 0.33) {
      return 'low';
    } else if (volume < 0.66) {
      return 'medium';
    } else {
      return 'high';
    }
  };

  const volumeIcon = getVolumeIcon();

  /**
   * Calculate volume from mouse/touch position
   */
  const calculateVolumeFromPosition = (clientX: number): number => {
    const slider = sliderRef.current;
    if (!slider) return volume;

    const rect = slider.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    
    return percentage;
  };

  /**
   * Handle slider click/drag start
   */
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newVolume = calculateVolumeFromPosition(clientX);
    onVolumeChange(newVolume);
  };

  /**
   * Handle slider drag
   */
  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newVolume = calculateVolumeFromPosition(clientX);
    onVolumeChange(newVolume);
  };

  /**
   * Handle drag end
   */
  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Attach global listeners for drag
  React.useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      handlePointerMove(e);
    };

    const handleUp = () => {
      handlePointerUp();
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchend', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchend', handleUp);
    };
  }, [isDragging]);

  const displayVolume = isMuted ? 0 : volume;
  const percentage = displayVolume * 100;

  return (
    <div className="volume-control">
      {/* Mute Toggle Button */}
      <button
        className="volume-control__button"
        onClick={onMuteToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {volumeIcon === 'muted' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
        {volumeIcon === 'low' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
        {volumeIcon === 'medium' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
        {volumeIcon === 'high' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* Volume Slider */}
      <div
        ref={sliderRef}
        className={`volume-control__slider ${isDragging ? 'volume-control__slider--dragging' : ''}`}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        role="slider"
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
        tabIndex={0}
      >
        <div className="volume-control__track">
          <div
            className="volume-control__fill"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="volume-control__thumb"
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Volume Percentage (optional) */}
      <span className="volume-control__percentage">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

export default VolumeControl;
```

---

### File: `src/components/Player/VolumeControl.css`

**📁 CREATE NEW FILE:**

```css
.volume-control {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) 0;
  max-width: 200px;
  user-select: none;
}

.volume-control__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: var(--space-xs);
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.volume-control__button:hover {
  color: var(--color-text-primary);
  background-color: var(--color-border);
}

.volume-control__button:active {
  transform: scale(0.95);
}

.volume-control__button:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

.volume-control__slider {
  flex: 1;
  min-width: 80px;
  padding: var(--space-xs) 0;
  cursor: pointer;
  touch-action: none;
}

.volume-control__slider:focus {
  outline: none;
}

.volume-control__slider:focus-visible .volume-control__track {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

.volume-control__track {
  position: relative;
  width: 100%;
  height: 4px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  transition: height var(--transition-fast);
}

.volume-control__slider:hover .volume-control__track,
.volume-control__slider--dragging .volume-control__track {
  height: 6px;
}

.volume-control__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--color-accent);
  transition: width 0.1s linear;
  pointer-events: none;
}

.volume-control__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background-color: var(--color-active);
  border-radius: var(--radius-full);
  opacity: 0;
  transition: opacity var(--transition-fast);
  pointer-events: none;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.volume-control__slider:hover .volume-control__thumb,
.volume-control__slider--dragging .volume-control__thumb {
  opacity: 1;
}

.volume-control__percentage {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-family: var(--font-family-mono);
  min-width: 3ch;
  text-align: right;
  flex-shrink: 0;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .volume-control {
    max-width: 160px;
  }

  .volume-control__slider {
    min-width: 60px;
  }

  .volume-control__track {
    height: 6px; /* Larger for touch */
  }

  .volume-control__thumb {
    width: 12px;
    height: 12px;
  }
}
```

---

### File: `src/components/Player/Player.tsx`

**🔍 FIND:**
```typescript
import Controls from './Controls';
import './Player.css';
```

**✏️ REPLACE WITH:**
```typescript
import Controls from './Controls';
import VolumeControl from './VolumeControl';
import './Player.css';
```

**🔍 FIND:**
```typescript
  const {
    currentTrackId,
    playbackState,
    currentTime,
    duration,
    error,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
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

**🔍 FIND:**
```typescript
      {/* Playback Controls */}
      <Controls
        playbackState={playbackState}
        onPlayPause={togglePlayPause}
        onPrevious={prevTrack}
        onNext={nextTrack}
      />

      {/* Placeholder for additional controls (Phase 3) */}
      {/* Volume, Shuffle, Repeat, Vocal/Instrumental toggle will go here */}
    </div>
```

**✏️ REPLACE WITH:**
```typescript
      {/* Playback Controls */}
      <Controls
        playbackState={playbackState}
        onPlayPause={togglePlayPause}
        onPrevious={prevTrack}
        onNext={nextTrack}
      />

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

---

## Validation Checklist

After implementing Phase 3A, verify:

### Functionality:
- [ ] Volume slider appears below playback controls
- [ ] Dragging slider changes volume smoothly
- [ ] Clicking slider jumps to that volume level
- [ ] Mute button toggles audio on/off
- [ ] Volume icon changes based on level (muted, low, medium, high)
- [ ] Volume percentage displays correctly (0-100%)
- [ ] Volume persists after page refresh
- [ ] Mute state persists after page refresh

### Visual:
- [ ] Volume control fits with existing player design
- [ ] Slider has smooth transitions
- [ ] Thumb appears on hover
- [ ] Icons are clear and recognizable
- [ ] Mobile: slider is large enough to interact with

### Edge Cases:
- [ ] Changing volume while muted unmutes automatically
- [ ] Unmuting with 0% volume restores previous volume
- [ ] Volume slider works during playback
- [ ] Volume slider works while paused
- [ ] Rapid volume changes don't cause issues

### Technical:
- [ ] TypeScript compiles with no errors
- [ ] No console errors or warnings
- [ ] localStorage keys: `primeape_volume` and `primeape_muted`
- [ ] Volume values clamped between 0 and 1

### Accessibility:
- [ ] Mute button has proper aria-label
- [ ] Slider has role="slider" and aria attributes
- [ ] Keyboard: Tab to focus, arrow keys to adjust (browser default)
- [ ] Screen reader announces volume changes

---

## Known Pitfalls

### Pitfall 1: Volume Not Persisting
**Problem:** Volume resets to default on refresh  
**Solution:** Check localStorage in DevTools → Application tab  
**Verify:** Keys `primeape_volume` and `primeape_muted` exist

### Pitfall 2: Mute Button Shows Wrong Icon
**Problem:** Icon doesn't update when volume changes  
**Solution:** `getVolumeIcon()` checks both `isMuted` and `volume === 0`  
**Test:** Set volume to 0 via slider - should show muted icon

### Pitfall 3: Touch Not Working on Mobile
**Problem:** Slider doesn't respond to touch  
**Solution:** Both touch and mouse events are handled  
**Verify:** Test on actual device or Chrome DevTools device mode

### Pitfall 4: Audio Element Volume Out of Sync
**Problem:** Slider shows 70% but audio is louder/quieter  
**Solution:** useEffect applies volume to audio element whenever changed  
**Check:** Log `audioRef.current.volume` in console

---

## Testing Instructions

### Manual Test Steps:

1. **Basic Volume Control:**
   - Start playing a track
   - Drag volume slider to 50%
   - Verify audio volume reduces
   - Drag to 100%
   - Verify audio is louder

2. **Mute Toggle:**
   - Click mute button
   - Verify audio stops
   - Verify icon changes to muted
   - Click again
   - Verify audio resumes
   - Verify icon restores

3. **Persistence:**
   - Set volume to 40%
   - Refresh page (F5)
   - Verify slider shows 40%
   - Verify audio plays at 40%

4. **Edge Case: Unmute at Zero:**
   - Drag slider to 0%
   - Mute audio (button should show muted icon)
   - Unmute
   - Verify volume restores to previous level (not 0%)

5. **Mobile Test:**
   - Open DevTools device toolbar
   - Test on iPhone SE viewport
   - Verify touch drag works
   - Verify buttons are tappable

### Console Test:

Open DevTools Console:
```javascript
// Check localStorage
localStorage.getItem('primeape_volume') // Should be "0.7" or similar
localStorage.getItem('primeape_muted') // Should be "true" or "false"

// Check audio element
document.querySelector('audio').volume // Should match slider
```

---

## Completion Criteria

Phase 3A is complete when:
- ✅ All checklist items verified
- ✅ No TypeScript errors
- ✅ No console errors
- ✅ Volume persists across page reloads
- ✅ Works on desktop and mobile

**Next:** Proceed to `phase-3b-shuffle-repeat.md`

---

# END OF PHASE 3A INSTRUCTIONS
