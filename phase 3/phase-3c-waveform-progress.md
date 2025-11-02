# PHASE 3C: WAVEFORM PROGRESS BAR

## Claude Code Prompt

```
I'm implementing Phase 3C (Waveform Progress Bar) for the PRIMEAPE music website.

Please implement the following:
1. Generate waveform data from audio files
2. Replace simple progress bar with waveform visualization
3. Interactive seeking on waveform
4. Smooth rendering with Canvas or SVG

Context:
- Phase 2 complete (basic player with simple progress bar)
- ProgressBar component exists and will be replaced
- Need to maintain same seeking functionality

Follow the detailed instructions below. This is a complex visualization feature.
```

---

## Overview

**Sub-Phase:** 3C  
**Feature:** Waveform Progress Bar  
**Complexity:** Complex  
**Time Estimate:** 1.5 hours

**What Will Be Built:**
- Waveform data generation from audio files
- Canvas-based waveform visualization
- Interactive seeking (click/drag on waveform)
- Current position highlighting
- Smooth, performant rendering

**Dependencies:**
- Phase 2 complete (ProgressBar component exists)

**Note:** This replaces the simple progress bar from Phase 2 with a visual waveform.

---

## Files to Create

```
src/hooks/useWaveform.ts
src/utils/generateWaveform.ts
src/components/Player/WaveformBar.tsx
src/components/Player/WaveformBar.css
```

## Files to Modify

```
src/components/Player/Player.tsx (replace ProgressBar with WaveformBar)
```

---

## Implementation Strategy

**Two approaches for waveform data:**

1. **Real-time generation (recommended for Phase 3C):**
   - Generate waveform when track loads
   - Uses Web Audio API to decode audio
   - Takes 1-2 seconds per track
   - No pre-processing needed

2. **Pre-generated (optional optimization):**
   - Generate waveforms server-side or in build step
   - Store as JSON files
   - Instant loading
   - Requires build script

**We'll implement approach #1 (real-time) for Phase 3C.**

---

## Implementation Instructions

### File: `src/utils/generateWaveform.ts`

**📁 CREATE NEW FILE:**

```typescript
/**
 * Generate waveform data from audio file
 * 
 * @param audioUrl - URL to audio file
 * @param samples - Number of waveform bars (default 100)
 * @returns Promise<number[]> - Array of normalized amplitudes (0-1)
 */
export async function generateWaveform(
  audioUrl: string,
  samples: number = 100
): Promise<number[]> {
  try {
    // Fetch audio file
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Create audio context
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Get raw audio data (use first channel)
    const rawData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / samples);
    const waveformData: number[] = [];

    // Downsample to desired number of samples
    for (let i = 0; i < samples; i++) {
      const start = i * blockSize;
      let sum = 0;

      // Get average amplitude for this block
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[start + j]);
      }

      const amplitude = sum / blockSize;
      waveformData.push(amplitude);
    }

    // Normalize to 0-1 range
    const max = Math.max(...waveformData);
    const normalized = waveformData.map(val => val / max);

    // Close audio context to free resources
    audioContext.close();

    return normalized;
  } catch (error) {
    console.error('Error generating waveform:', error);
    // Return flat line on error
    return new Array(samples).fill(0.5);
  }
}

/**
 * Sample waveform data for testing (when audio files not available)
 * Generates a realistic-looking waveform pattern
 */
export function generateSampleWaveform(samples: number = 100): number[] {
  const waveform: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    // Create varied amplitudes that look like music
    const base = Math.sin(i / 10) * 0.3 + 0.5;
    const variation = Math.random() * 0.4;
    const value = Math.max(0.1, Math.min(1, base + variation));
    waveform.push(value);
  }
  
  return waveform;
}
```

---

### File: `src/hooks/useWaveform.ts`

**📁 CREATE NEW FILE:**

```typescript
import { useState, useEffect } from 'react';
import { generateWaveform } from '@/utils/generateWaveform';

/**
 * useWaveform Hook
 * 
 * Generates and manages waveform data for an audio track.
 * 
 * @param audioUrl - URL to audio file
 * @param samples - Number of waveform bars
 * @returns Object with waveform data and loading state
 */
export function useWaveform(audioUrl: string | null, samples: number = 100) {
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioUrl) {
      setWaveformData([]);
      return;
    }

    let cancelled = false;

    const loadWaveform = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await generateWaveform(audioUrl, samples);
        
        if (!cancelled) {
          setWaveformData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load waveform');
          setIsLoading(false);
          // Use flat waveform as fallback
          setWaveformData(new Array(samples).fill(0.5));
        }
      }
    };

    loadWaveform();

    return () => {
      cancelled = true;
    };
  }, [audioUrl, samples]);

  return {
    waveformData,
    isLoading,
    error,
  };
}
```

---

### File: `src/components/Player/WaveformBar.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React, { useRef, useState, useEffect } from 'react';
import { useWaveform } from '@/hooks/useWaveform';
import './WaveformBar.css';

interface WaveformBarProps {
  audioUrl: string | null;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

/**
 * WaveformBar Component
 * 
 * Visual waveform progress bar that shows audio amplitude.
 * Click or drag to seek to specific position.
 * 
 * @param audioUrl - Current track audio file URL
 * @param currentTime - Current playback position
 * @param duration - Total track duration
 * @param onSeek - Callback when user seeks
 */
const WaveformBar: React.FC<WaveformBarProps> = ({
  audioUrl,
  currentTime,
  duration,
  onSeek,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);

  // Generate waveform (100 bars)
  const { waveformData, isLoading } = useWaveform(audioUrl, 100);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) : 0;

  /**
   * Draw waveform on canvas
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (accounting for device pixel ratio)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate bar dimensions
    const barCount = waveformData.length;
    const barWidth = rect.width / barCount;
    const barGap = barWidth * 0.2;
    const actualBarWidth = barWidth - barGap;
    const centerY = rect.height / 2;
    const maxBarHeight = rect.height * 0.8;

    // Get colors from CSS variables
    const styles = getComputedStyle(canvas);
    const playedColor = styles.getPropertyValue('--color-active').trim() || '#000';
    const unplayedColor = styles.getPropertyValue('--color-border').trim() || '#ccc';

    // Draw waveform bars
    for (let i = 0; i < barCount; i++) {
      const x = i * barWidth;
      const amplitude = waveformData[i];
      const barHeight = amplitude * maxBarHeight;
      
      // Determine color (played vs unplayed)
      const barProgress = i / barCount;
      const isPlayed = barProgress <= progress;
      ctx.fillStyle = isPlayed ? playedColor : unplayedColor;

      // Draw centered bar
      ctx.fillRect(
        x,
        centerY - barHeight / 2,
        actualBarWidth,
        barHeight
      );
    }

    // Draw hover indicator
    if (hoveredPosition !== null && !isDragging) {
      const hoverX = hoveredPosition * rect.width;
      ctx.strokeStyle = playedColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hoverX, 0);
      ctx.lineTo(hoverX, rect.height);
      ctx.stroke();
    }
  }, [waveformData, progress, hoveredPosition, isDragging]);

  /**
   * Calculate time from mouse/touch position
   */
  const calculateTimeFromPosition = (clientX: number): number => {
    const container = containerRef.current;
    if (!container) return 0;

    const rect = container.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    
    return percentage * duration;
  };

  /**
   * Handle click/drag to seek
   */
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newTime = calculateTimeFromPosition(clientX);
    onSeek(newTime);
  };

  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

    if (isDragging) {
      const newTime = calculateTimeFromPosition(clientX);
      onSeek(newTime);
    } else {
      // Update hover position
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
        setHoveredPosition(percentage);
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setHoveredPosition(null);
  };

  // Attach global listeners for drag
  useEffect(() => {
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

  return (
    <div
      ref={containerRef}
      className={`waveform-bar ${isDragging ? 'waveform-bar--dragging' : ''} ${isLoading ? 'waveform-bar--loading' : ''}`}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      onMouseMove={(e) => !isDragging && handlePointerMove(e.nativeEvent)}
      onMouseLeave={handleMouseLeave}
      role="slider"
      aria-label="Seek slider"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      tabIndex={0}
    >
      <canvas ref={canvasRef} className="waveform-bar__canvas" />
      {isLoading && (
        <div className="waveform-bar__loading-indicator">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
};

export default WaveformBar;
```

---

### File: `src/components/Player/WaveformBar.css`

**📁 CREATE NEW FILE:**

```css
.waveform-bar {
  position: relative;
  width: 100%;
  height: 60px;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.waveform-bar:focus {
  outline: none;
}

.waveform-bar:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

.waveform-bar__canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.waveform-bar--dragging {
  cursor: grabbing;
}

.waveform-bar--loading {
  background-color: var(--color-border);
  opacity: 0.5;
}

.waveform-bar__loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .waveform-bar {
    height: 50px;
  }
}
```

---

### File: `src/components/Player/Player.tsx`

**🔍 FIND:**
```typescript
import ProgressBar from './ProgressBar';
```

**✏️ REPLACE WITH:**
```typescript
import WaveformBar from './WaveformBar';
```

**🔍 FIND:**
```typescript
      {/* Progress Bar */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={seek}
      />
```

**✏️ REPLACE WITH:**
```typescript
      {/* Waveform Progress Bar */}
      <WaveformBar
        audioUrl={currentTrack ? (audioVersion === 'vocal' && currentTrack.hasVocals ? currentTrack.vocalFile : currentTrack.instrumentalFile) : null}
        currentTime={currentTime}
        duration={duration}
        onSeek={seek}
      />
```

**🔍 FIND (also import audioVersion from hook):**
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
```

**✏️ REPLACE WITH:**
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
```

---

## Validation Checklist

- [ ] Waveform displays when track loads
- [ ] Waveform shows realistic audio amplitude pattern
- [ ] Click anywhere on waveform to seek
- [ ] Drag on waveform to scrub through track
- [ ] Played portion shows in active color
- [ ] Unplayed portion shows in border color
- [ ] Hover shows seek preview line
- [ ] Loading indicator shows while generating
- [ ] Works on mobile (touch)
- [ ] No performance issues (smooth 60fps)

## Known Pitfalls

1. **Waveform Generation Slow:** Takes 1-2 seconds per track - show loading state
2. **CORS Errors:** Audio files must be same-origin or have CORS headers
3. **Memory Leaks:** AudioContext.close() called after generation
4. **Canvas Scaling:** Must account for devicePixelRatio for sharp rendering

## Testing

1. Upload at least one audio file
2. Play track - waveform should generate
3. Click waveform to seek
4. Verify colors match theme
5. Test on mobile device

## Completion Criteria

- ✅ Waveform visualization working
- ✅ Interactive seeking functional
- ✅ Performance acceptable
- ✅ No console errors

**Next:** Proceed to `phase-3d-visual-equalizer.md`

---

# END OF PHASE 3C INSTRUCTIONS
