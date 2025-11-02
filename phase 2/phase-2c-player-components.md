# PHASE 2C: PLAYER UI COMPONENTS

## Part Overview
Create all the visual components for the music player. These components receive state and callbacks from the useAudioPlayer hook and display the UI.

## What Gets Created
- `src/components/Player/Artwork.tsx` + `.css` - Album artwork display
- `src/components/Player/TrackInfo.tsx` + `.css` - Song title and artist
- `src/components/Player/TimeDisplay.tsx` + `.css` - Current time / duration
- `src/components/Player/ProgressBar.tsx` + `.css` - Seekable progress bar
- `src/components/Player/Controls.tsx` + `.css` - Play/pause/prev/next buttons

## Prerequisites
✅ Part 2A complete - formatTime utility exists
✅ Part 2B complete - useAudioPlayer hook exists

## Step-by-Step Instructions

### Step 1: Create TimeDisplay Component

**File:** `src/components/Player/TimeDisplay.tsx`

Simple component that displays current time and duration:

```typescript
import React from 'react';
import { formatTime } from '@/utils/formatTime';
import './TimeDisplay.css';

interface TimeDisplayProps {
  currentTime: number;
  duration: number;
}

/**
 * TimeDisplay Component
 * 
 * Displays current playback time and total duration in MM:SS format.
 * 
 * @param currentTime - Current playback position in seconds
 * @param duration - Total track duration in seconds
 */
const TimeDisplay: React.FC<TimeDisplayProps> = ({ currentTime, duration }) => {
  return (
    <div className="time-display">
      <span className="time-display__current">{formatTime(currentTime)}</span>
      <span className="time-display__divider">/</span>
      <span className="time-display__duration">{formatTime(duration)}</span>
    </div>
  );
};

export default TimeDisplay;
```

**File:** `src/components/Player/TimeDisplay.css`

```css
.time-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  user-select: none;
}

.time-display__current {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.time-display__divider {
  opacity: 0.5;
}

.time-display__duration {
  color: var(--color-text-secondary);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .time-display {
    font-size: var(--font-size-xs);
  }
}
```

**Design Notes:**
- Monospace font for consistent width (numbers don't shift)
- Current time emphasized (darker color)
- Duration is secondary (lighter color)

---

### Step 2: Create ProgressBar Component

**File:** `src/components/Player/ProgressBar.tsx`

Interactive progress bar with click and drag support:

```typescript
import React, { useRef, useState } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

/**
 * ProgressBar Component
 * 
 * Interactive progress bar that shows playback position and allows seeking.
 * Click or drag to jump to a specific time in the track.
 * 
 * Phase 2: Simple filled bar
 * Phase 3: Will be replaced with waveform visualization
 * 
 * @param currentTime - Current playback position in seconds
 * @param duration - Total track duration in seconds
 * @param onSeek - Callback when user seeks to new position
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /**
   * Calculate time from mouse/touch position
   */
  const calculateTimeFromPosition = (clientX: number): number => {
    const bar = progressBarRef.current;
    if (!bar) return 0;

    const rect = bar.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    
    return percentage * duration;
  };

  /**
   * Handle mouse/touch down - start dragging
   */
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newTime = calculateTimeFromPosition(clientX);
    onSeek(newTime);
  };

  /**
   * Handle mouse/touch move - continue dragging
   */
  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newTime = calculateTimeFromPosition(clientX);
    onSeek(newTime);
  };

  /**
   * Handle mouse/touch up - stop dragging
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
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div
      ref={progressBarRef}
      className={`progress-bar ${isDragging ? 'progress-bar--dragging' : ''}`}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      role="slider"
      aria-label="Seek slider"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      tabIndex={0}
    >
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${progress}%` }}
        />
        <div
          className="progress-bar__thumb"
          style={{ left: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
```

**File:** `src/components/Player/ProgressBar.css`

```css
.progress-bar {
  width: 100%;
  padding: var(--space-sm) 0;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}

.progress-bar:focus {
  outline: none;
}

.progress-bar:focus-visible .progress-bar__track {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

.progress-bar__track {
  position: relative;
  width: 100%;
  height: 4px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  transition: height var(--transition-fast);
}

.progress-bar:hover .progress-bar__track,
.progress-bar--dragging .progress-bar__track {
  height: 6px;
}

.progress-bar__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-accent),
    var(--color-hover)
  );
  transition: width 0.1s linear;
  pointer-events: none;
}

.progress-bar__thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background-color: var(--color-active);
  border-radius: var(--radius-full);
  opacity: 0;
  transition: opacity var(--transition-fast);
  pointer-events: none;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.progress-bar:hover .progress-bar__thumb,
.progress-bar--dragging .progress-bar__thumb {
  opacity: 1;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .progress-bar__track {
    height: 6px; /* Slightly larger for easier touch targeting */
  }

  .progress-bar__thumb {
    width: 14px;
    height: 14px;
  }
}
```

**Implementation Notes:**
- Supports both mouse and touch events
- Thumb only appears on hover/drag
- Track expands slightly on hover
- ARIA attributes for accessibility
- Global event listeners for smooth dragging
- `passive: false` allows preventDefault on touchmove

---

### Step 3: Create Controls Component

**File:** `src/components/Player/Controls.tsx`

Playback control buttons with inline SVG icons:

```typescript
import React from 'react';
import type { PlaybackState } from '@/types';
import './Controls.css';

interface ControlsProps {
  playbackState: PlaybackState;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Controls Component
 * 
 * Playback control buttons (previous, play/pause, next).
 * Shows loading spinner when track is loading.
 * 
 * @param playbackState - Current playback state
 * @param onPlayPause - Play/pause toggle callback
 * @param onPrevious - Previous track callback
 * @param onNext - Next track callback
 */
const Controls: React.FC<ControlsProps> = ({
  playbackState,
  onPlayPause,
  onPrevious,
  onNext,
}) => {
  const isPlaying = playbackState === 'playing';
  const isLoading = playbackState === 'loading';

  return (
    <div className="controls">
      {/* Previous Button */}
      <button
        className="controls__button controls__button--secondary"
        onClick={onPrevious}
        disabled={isLoading}
        aria-label="Previous track"
        title="Previous track (or restart if > 3s)"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="19 20 9 12 19 4 19 20" />
          <line x1="5" y1="19" x2="5" y2="5" />
        </svg>
      </button>

      {/* Play/Pause Button */}
      <button
        className="controls__button controls__button--primary"
        onClick={onPlayPause}
        disabled={isLoading}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        {isLoading ? (
          <div className="spinner" />
        ) : isPlaying ? (
          // Pause Icon
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Play Icon
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="8 5 19 12 8 19 8 5" />
          </svg>
        )}
      </button>

      {/* Next Button */}
      <button
        className="controls__button controls__button--secondary"
        onClick={onNext}
        disabled={isLoading}
        aria-label="Next track"
        title="Next track"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 4 15 12 5 20 5 4" />
          <line x1="19" y1="5" x2="19" y2="19" />
        </svg>
      </button>
    </div>
  );
};

export default Controls;
```

**File:** `src/components/Player/Controls.css`

```css
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-md) 0;
}

.controls__button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  border-radius: var(--radius-full);
}

.controls__button:hover:not(:disabled) {
  color: var(--color-hover);
  transform: scale(1.05);
}

.controls__button:active:not(:disabled) {
  transform: scale(0.95);
}

.controls__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.controls__button:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 4px;
}

/* Primary button (play/pause) */
.controls__button--primary {
  width: 64px;
  height: 64px;
  background-color: var(--color-accent);
  color: var(--color-bg);
}

.controls__button--primary:hover:not(:disabled) {
  background-color: var(--color-hover);
  color: var(--color-bg);
  transform: scale(1.1);
}

/* Secondary buttons (prev/next) */
.controls__button--secondary {
  width: 48px;
  height: 48px;
  padding: var(--space-xs);
}

/* Loading spinner inside button */
.controls__button--primary .spinner {
  width: 32px;
  height: 32px;
  border-color: var(--color-bg);
  border-top-color: transparent;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .controls {
    gap: var(--space-sm);
  }

  .controls__button--primary {
    width: 56px;
    height: 56px;
  }

  .controls__button--secondary {
    width: 40px;
    height: 40px;
  }
}
```

**Design Notes:**
- Inline SVG icons (no external library needed)
- Icons use `currentColor` (theme-aware)
- Loading spinner reuses global `.spinner` class
- Hover effects (scale up)
- Active effects (scale down - tactile feedback)
- Disabled state (reduced opacity)
- Larger primary button (play/pause)

---

### Step 4: Create TrackInfo Component

**File:** `src/components/Player/TrackInfo.tsx`

Displays track title, artist, and track number:

```typescript
import React from 'react';
import type { Track } from '@/types';
import './TrackInfo.css';

interface TrackInfoProps {
  track: Track | null;
  error: string | null;
}

/**
 * TrackInfo Component
 * 
 * Displays current track information (title, artist, track number).
 * Shows error message if track fails to load.
 * 
 * @param track - Current track object
 * @param error - Error message if any
 */
const TrackInfo: React.FC<TrackInfoProps> = ({ track, error }) => {
  if (error) {
    return (
      <div className="track-info track-info--error">
        <p className="track-info__error-message">{error}</p>
        <p className="track-info__error-hint">Please try selecting another track</p>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="track-info">
        <p className="track-info__title">No track selected</p>
      </div>
    );
  }

  return (
    <div className="track-info">
      <p className="track-info__track-number">
        Track {track.id} of 16
      </p>
      <h2 className="track-info__title">{track.title}</h2>
      <p className="track-info__artist">PRIMEAPE</p>
    </div>
  );
};

export default TrackInfo;
```

**File:** `src/components/Player/TrackInfo.css`

```css
.track-info {
  text-align: center;
  padding: var(--space-md) 0;
}

.track-info__track-number {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-xs);
}

.track-info__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
  letter-spacing: 0.02em;
}

.track-info__artist {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Error state */
.track-info--error {
  padding: var(--space-lg);
}

.track-info__error-message {
  font-size: var(--font-size-base);
  color: #e74c3c; /* Red color for errors */
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-xs);
}

.track-info__error-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .track-info__title {
    font-size: var(--font-size-xl);
  }

  .track-info__artist {
    font-size: var(--font-size-base);
  }
}
```

**Design Notes:**
- Three states: normal, error, no track
- Track number is small and subtle
- Title is large and bold (main focus)
- Artist is medium weight
- Error state uses red color (hardcoded - only place we do this)

---

### Step 5: Create Artwork Component

**File:** `src/components/Player/Artwork.tsx`

Album artwork display with subtle animation:

```typescript
import React from 'react';
import { FOUNDATION_ALBUM } from '@/data/album';
import './Artwork.css';

interface ArtworkProps {
  isPlaying: boolean;
}

/**
 * Artwork Component
 * 
 * Displays album artwork with subtle animation when playing.
 * 
 * Phase 2: Simple artwork display
 * Phase 3: Will add visual equalizer overlay
 * 
 * @param isPlaying - Whether audio is currently playing
 */
const Artwork: React.FC<ArtworkProps> = ({ isPlaying }) => {
  return (
    <div className={`artwork ${isPlaying ? 'artwork--playing' : ''}`}>
      <div className="artwork__container">
        <img
          src={FOUNDATION_ALBUM.artworkUrl}
          alt={`${FOUNDATION_ALBUM.title} album cover`}
          className="artwork__image"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.classList.add('artwork__container--no-image');
          }}
        />
        {/* Equalizer will be added here in Phase 3 */}
      </div>
    </div>
  );
};

export default Artwork;
```

**File:** `src/components/Player/Artwork.css`

```css
.artwork {
  width: 100%;
  max-width: var(--artwork-size-desktop);
  margin: 0 auto;
  padding: var(--space-md);
}

.artwork__container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--color-border);
  box-shadow: var(--shadow-lg);
  transition: transform var(--transition-normal),
              box-shadow var(--transition-normal);
}

.artwork--playing .artwork__container {
  animation: subtle-pulse 4s ease-in-out infinite;
}

@keyframes subtle-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: var(--shadow-lg);
  }
  50% {
    transform: scale(1.02);
    box-shadow: var(--shadow-xl);
  }
}

.artwork__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Fallback for missing image */
.artwork__container--no-image {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--color-border),
    var(--color-accent)
  );
}

.artwork__container--no-image::after {
  content: 'PRIMEAPE\AFOUNDATION';
  white-space: pre;
  text-align: center;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  opacity: 0.5;
  letter-spacing: 0.1em;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .artwork {
    max-width: var(--artwork-size-mobile);
    padding: var(--space-sm);
  }
}
```

**Design Notes:**
- `aspect-ratio: 1` keeps it square
- Subtle pulse animation when playing (2% scale, 4s duration)
- Fallback gradient + text if image doesn't load
- `\A` in CSS content creates line break
- Rounded corners with shadow
- Responsive sizing via CSS variables

---

## Validation Checklist

After completing Part 2C, verify:

### Files Created
- [ ] `src/components/Player/TimeDisplay.tsx` + `.css`
- [ ] `src/components/Player/ProgressBar.tsx` + `.css`
- [ ] `src/components/Player/Controls.tsx` + `.css`
- [ ] `src/components/Player/TrackInfo.tsx` + `.css`
- [ ] `src/components/Player/Artwork.tsx` + `.css`

Total: 10 files (5 components + 5 stylesheets)

### TypeScript Validation
```bash
npx tsc --noEmit
```
Should complete with no errors.

### Code Quality Check
- [ ] All components use React.FC with props interfaces
- [ ] All props explicitly typed
- [ ] JSDoc comments present
- [ ] CSS uses BEM naming convention
- [ ] CSS uses variables (no hardcoded values except error red)
- [ ] All imports use @ path alias
- [ ] No `any` types

### Component Props Check
- [ ] TimeDisplay receives currentTime and duration
- [ ] ProgressBar receives currentTime, duration, onSeek
- [ ] Controls receives playbackState and callback functions
- [ ] TrackInfo receives track and error
- [ ] Artwork receives isPlaying

### CSS Check
- [ ] All components have mobile responsive styles
- [ ] BEM naming consistent
- [ ] CSS variables used throughout
- [ ] Transitions defined where appropriate
- [ ] ARIA attributes present (progress bar, controls)

### Accessibility Check
- [ ] ProgressBar has role="slider" and ARIA attributes
- [ ] All buttons have aria-label
- [ ] Focus states defined (:focus-visible)
- [ ] Images have alt text
- [ ] Buttons have title tooltips

## Common Issues & Solutions

### Issue 1: SVG icons not displaying
**Problem:** SVG syntax error or viewBox incorrect
**Solution:** Copy SVG code exactly as provided

### Issue 2: Progress bar not seeking
**Problem:** onSeek callback not connected
**Solution:** Verify onSeek prop is passed from Player component (Part 2D)

### Issue 3: Thumb not appearing on hover
**Problem:** CSS selector specificity
**Solution:** Check `.progress-bar:hover .progress-bar__thumb` selector

### Issue 4: Artwork not animating
**Problem:** isPlaying prop not passed correctly
**Solution:** Verify prop passed from Player component

### Issue 5: Error state not showing
**Problem:** Conditional rendering logic
**Solution:** Check if error prop is null before rendering error UI

### Issue 6: Touch events not working on mobile
**Problem:** Missing touch event handlers
**Solution:** Verify both onMouseDown and onTouchStart on progress bar

## Design System Compliance

All components follow Phase 1 design system:
- ✅ CSS variables for all colors and spacing
- ✅ BEM naming convention
- ✅ Responsive breakpoints at 640px and 768px
- ✅ Smooth transitions
- ✅ Consistent spacing scale
- ✅ Typography scale
- ✅ Shadow scale
- ✅ Border radius scale

## Performance Notes

**ProgressBar:**
- Global event listeners only added when dragging
- Properly cleaned up to prevent memory leaks
- Smooth 60fps animation via CSS transitions

**Artwork:**
- CSS animations are GPU-accelerated
- Image loading is lazy by default
- Fallback doesn't require additional network request

## Accessibility Notes

**Keyboard Navigation:**
- All buttons are keyboard accessible
- ProgressBar is focusable with tabIndex={0}
- Focus outlines visible

**Screen Readers:**
- ARIA labels on all interactive elements
- Semantic HTML (button, img)
- Role="slider" on progress bar

## Next Step

Proceed to **Part 2D: Integration & Validation** (`phase-2d-integration.md`)

In Part 2D, we'll:
- Create the main Player component that ties all sub-components together
- Create the PlayerSection wrapper
- Integrate into App.tsx
- Complete comprehensive testing and validation

We're almost done with Phase 2! 🎵
