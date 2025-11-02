# PHASE 3D: VISUAL EQUALIZER OVERLAY

## Claude Code Prompt

```
I'm implementing Phase 3D (Visual Equalizer) for the PRIMEAPE music website.

Please implement the following:
1. Real-time frequency analysis using Web Audio API
2. Canvas-based equalizer bars over artwork
3. Semi-transparent overlay
4. Toggle to show/hide equalizer

Context:
- Phase 2 complete (AudioContext already created in useAudioPlayer)
- Artwork component exists
- Need to add equalizer visualization on top of artwork

Follow the detailed instructions below. This is a complex audio visualization feature.
```

---

## Overview

**Sub-Phase:** 3D  
**Feature:** Visual Equalizer Overlay  
**Complexity:** Complex  
**Time Estimate:** 1.5 hours

**What Will Be Built:**
- Real-time audio frequency analysis
- Animated equalizer bars (20-30 bars)
- Semi-transparent overlay on album artwork
- Toggle button to show/hide
- Smooth 60fps animations

**Dependencies:**
- Phase 2 complete (AudioContext exists)
- Artwork component exists

---

## Files to Create

```
src/hooks/useEqualizer.ts
src/components/Player/Equalizer.tsx
src/components/Player/Equalizer.css
src/components/Player/EqualizerToggle.tsx
src/components/Player/EqualizerToggle.css
```

## Files to Modify

```
src/hooks/useAudioPlayer.ts (expose analyser node)
src/components/Player/Artwork.tsx (add Equalizer component)
src/components/Player/Player.tsx (add toggle button)
```

---

## Implementation Instructions

### File: `src/hooks/useEqualizer.ts`

**📁 CREATE NEW FILE:**

```typescript
import { useEffect, useRef, useState } from 'react';

interface UseEqualizerOptions {
  fftSize?: number; // Must be power of 2 (512, 1024, 2048)
  smoothingTimeConstant?: number; // 0-1
}

/**
 * useEqualizer Hook
 * 
 * Analyzes audio frequencies in real-time for visualization.
 * 
 * @param audioContext - Web Audio API AudioContext
 * @param sourceNode - MediaElementSourceNode connected to audio element
 * @param isPlaying - Whether audio is currently playing
 * @param options - Configuration options
 * @returns Frequency data array and analyser node
 */
export function useEqualizer(
  audioContext: AudioContext | null,
  sourceNode: MediaElementAudioSourceNode | null,
  isPlaying: boolean,
  options: UseEqualizerOptions = {}
) {
  const {
    fftSize = 512,
    smoothingTimeConstant = 0.8,
  } = options;

  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(0));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Create analyser node
  useEffect(() => {
    if (!audioContext || !sourceNode) return;

    // Create analyser if it doesn't exist
    if (!analyserRef.current) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      
      // Connect: source -> analyser -> destination
      // (destination already connected in useAudioPlayer)
      sourceNode.connect(analyser);
      
      analyserRef.current = analyser;
      
      // Initialize frequency data array
      const bufferLength = analyser.frequencyBinCount;
      setFrequencyData(new Uint8Array(bufferLength));
    }

    return () => {
      // Don't disconnect - we want analyser to persist
      // Will be cleaned up when audio context is closed
    };
  }, [audioContext, sourceNode, fftSize, smoothingTimeConstant]);

  // Update frequency data on animation frame
  useEffect(() => {
    if (!isPlaying || !analyserRef.current) {
      // Cancel animation frame if not playing
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const updateFrequencyData = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        setFrequencyData(dataArray);
      }

      animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    };

    animationFrameRef.current = requestAnimationFrame(updateFrequencyData);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  return {
    frequencyData,
    analyserNode: analyserRef.current,
  };
}
```

---

### File: `src/hooks/useAudioPlayer.ts`

**🔍 FIND:**
```typescript
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
```

**➕ ADD AFTER:**
```typescript
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<MediaElementAudioSourceNode | null>(null);
```

**🔍 FIND:**
```typescript
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
```

**✏️ REPLACE WITH:**
```typescript
  // ========== INITIALIZE AUDIO CONTEXT (for equalizer) ==========
  useEffect(() => {
    // Create AudioContext on mount
    if (!audioContextRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      setAudioContext(ctx);
    }

    // Connect audio element to context when ref is available
    if (audioRef.current && audioContextRef.current && !sourceNodeRef.current) {
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(audioContextRef.current.destination);
      sourceNodeRef.current = source;
      setSourceNode(source);
    }

    return () => {
      // Keep AudioContext alive for entire session
    };
  }, []);
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
  isShuffled: boolean;
  repeatMode: RepeatMode;
  error: string | null;
  
  // Actions
  ...
  
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
  ...
  
  // Refs
  audioRef: React.RefObject<HTMLAudioElement>;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
}
```

**🔍 FIND:**
```typescript
  return {
    // State
    ...
    
    // Refs
    audioRef,
  };
```

**✏️ REPLACE WITH:**
```typescript
  return {
    // State
    ...
    
    // Refs
    audioRef,
    audioContext,
    sourceNode,
  };
```

---

### File: `src/components/Player/Equalizer.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React, { useRef, useEffect } from 'react';
import { useEqualizer } from '@/hooks/useEqualizer';
import './Equalizer.css';

interface EqualizerProps {
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
  isPlaying: boolean;
  isVisible: boolean;
}

/**
 * Equalizer Component
 * 
 * Visual frequency equalizer that displays animated bars
 * responding to audio frequencies. Rendered on Canvas.
 * 
 * @param audioContext - Web Audio API context
 * @param sourceNode - Audio source node
 * @param isPlaying - Whether audio is playing
 * @param isVisible - Whether equalizer should be visible
 */
const Equalizer: React.FC<EqualizerProps> = ({
  audioContext,
  sourceNode,
  isPlaying,
  isVisible,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get frequency data
  const { frequencyData } = useEqualizer(audioContext, sourceNode, isPlaying);

  // Render equalizer bars
  useEffect(() => {
    if (!isVisible) return;
    
    const canvas = canvasRef.current;
    if (!canvas || frequencyData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!isPlaying) return; // Don't draw if not playing

    // Configuration
    const barCount = 24; // Number of bars to display
    const barWidth = rect.width / barCount;
    const barGap = barWidth * 0.15;
    const actualBarWidth = barWidth - barGap;

    // Get color from CSS variable
    const styles = getComputedStyle(canvas);
    const barColor = styles.getPropertyValue('--color-active').trim() || '#fff';

    // Draw bars
    for (let i = 0; i < barCount; i++) {
      // Sample frequency data (logarithmic distribution for better visualization)
      const dataIndex = Math.floor((i / barCount) * frequencyData.length * 0.4); // Use lower 40% of frequencies
      const amplitude = frequencyData[dataIndex] / 255; // Normalize to 0-1
      
      // Calculate bar height
      const minHeight = rect.height * 0.05;
      const maxHeight = rect.height * 0.9;
      const barHeight = minHeight + (amplitude * (maxHeight - minHeight));

      // Position bar at bottom
      const x = i * barWidth;
      const y = rect.height - barHeight;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, y, 0, rect.height);
      gradient.addColorStop(0, barColor);
      gradient.addColorStop(1, barColor + '80'); // Add transparency

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, actualBarWidth, barHeight);
    }
  }, [frequencyData, isPlaying, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="equalizer">
      <canvas ref={canvasRef} className="equalizer__canvas" />
    </div>
  );
};

export default Equalizer;
```

---

### File: `src/components/Player/Equalizer.css`

**📁 CREATE NEW FILE:**

```css
.equalizer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.3),
    transparent 40%
  );
}

.equalizer__canvas {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.7;
}

/* Animation when appearing */
@keyframes equalizer-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.7;
  }
}

.equalizer__canvas {
  animation: equalizer-fade-in var(--transition-normal);
}
```

---

### File: `src/components/Player/EqualizerToggle.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React from 'react';
import './EqualizerToggle.css';

interface EqualizerToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

/**
 * EqualizerToggle Component
 * 
 * Button to toggle equalizer visualization on/off.
 */
const EqualizerToggle: React.FC<EqualizerToggleProps> = ({
  isActive,
  onToggle,
}) => {
  return (
    <button
      className={`equalizer-toggle ${isActive ? 'equalizer-toggle--active' : ''}`}
      onClick={onToggle}
      aria-label={isActive ? 'Hide equalizer' : 'Show equalizer'}
      title={isActive ? 'Equalizer: On' : 'Equalizer: Off'}
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
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </button>
  );
};

export default EqualizerToggle;
```

---

### File: `src/components/Player/EqualizerToggle.css`

**📁 CREATE NEW FILE:**

```css
.equalizer-toggle {
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

.equalizer-toggle:hover {
  color: var(--color-text-primary);
  background-color: var(--color-border);
}

.equalizer-toggle:active {
  transform: scale(0.95);
}

.equalizer-toggle:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

.equalizer-toggle--active {
  color: var(--color-active);
}

.equalizer-toggle--active:hover {
  color: var(--color-hover);
}

.equalizer-toggle--active::after {
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
```

---

### File: `src/components/Player/Artwork.tsx`

**🔍 FIND:**
```typescript
import React from 'react';
import { FOUNDATION_ALBUM } from '@/data/album';
import './Artwork.css';
```

**✏️ REPLACE WITH:**
```typescript
import React, { useState, useEffect } from 'react';
import { FOUNDATION_ALBUM } from '@/data/album';
import Equalizer from './Equalizer';
import './Artwork.css';
```

**🔍 FIND:**
```typescript
interface ArtworkProps {
  isPlaying: boolean;
}
```

**✏️ REPLACE WITH:**
```typescript
interface ArtworkProps {
  isPlaying: boolean;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
}
```

**🔍 FIND:**
```typescript
const Artwork: React.FC<ArtworkProps> = ({ isPlaying }) => {
```

**✏️ REPLACE WITH:**
```typescript
const Artwork: React.FC<ArtworkProps> = ({ 
  isPlaying,
  audioContext,
  sourceNode
}) => {
  // Load equalizer preference from localStorage
  const [showEqualizer, setShowEqualizer] = useState(() => {
    const saved = localStorage.getItem('primeape_equalizer');
    return saved === 'true';
  });

  // Save equalizer preference
  useEffect(() => {
    localStorage.setItem('primeape_equalizer', showEqualizer.toString());
  }, [showEqualizer]);

  // Expose toggle function via ref (will be used by toggle button)
  React.useImperativeHandle(
    React.useRef(),
    () => ({
      toggleEqualizer: () => setShowEqualizer(prev => !prev),
    })
  );
```

**🔍 FIND:**
```typescript
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
```

**✏️ REPLACE WITH:**
```typescript
      <div className="artwork__container">
        <img
          src={FOUNDATION_ALBUM.artworkUrl}
          alt={`${FOUNDATION_ALBUM.title} album cover`}
          className="artwork__image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.classList.add('artwork__container--no-image');
          }}
        />
        
        {/* Equalizer Overlay */}
        <Equalizer
          audioContext={audioContext}
          sourceNode={sourceNode}
          isPlaying={isPlaying}
          isVisible={showEqualizer}
        />
      </div>
```

**Note:** Since we can't easily use refs, we'll pass toggle via Player component state instead.

**Actually, better approach - add showEqualizer as prop:**

**🔍 FIND:**
```typescript
interface ArtworkProps {
  isPlaying: boolean;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
}
```

**✏️ REPLACE WITH:**
```typescript
interface ArtworkProps {
  isPlaying: boolean;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
  showEqualizer: boolean;
}
```

**🔍 FIND:**
```typescript
const Artwork: React.FC<ArtworkProps> = ({ 
  isPlaying,
  audioContext,
  sourceNode
}) => {
  // Load equalizer preference from localStorage
  const [showEqualizer, setShowEqualizer] = useState(() => {
    const saved = localStorage.getItem('primeape_equalizer');
    return saved === 'true';
  });

  // Save equalizer preference
  useEffect(() => {
    localStorage.setItem('primeape_equalizer', showEqualizer.toString());
  }, [showEqualizer]);
```

**✏️ REPLACE WITH:**
```typescript
const Artwork: React.FC<ArtworkProps> = ({ 
  isPlaying,
  audioContext,
  sourceNode,
  showEqualizer
}) => {
```

---

### File: `src/components/Player/Player.tsx`

**🔍 FIND:**
```typescript
import Artwork from './Artwork';
```

**✏️ REPLACE WITH:**
```typescript
import Artwork from './Artwork';
import EqualizerToggle from './EqualizerToggle';
```

**🔍 FIND:**
```typescript
const Player: React.FC = () => {
```

**➕ ADD AFTER:**
```typescript
  // Equalizer state
  const [showEqualizer, setShowEqualizer] = useState(() => {
    const saved = localStorage.getItem('primeape_equalizer');
    return saved === 'true';
  });

  // Save equalizer preference
  React.useEffect(() => {
    localStorage.setItem('primeape_equalizer', showEqualizer.toString());
  }, [showEqualizer]);

  const toggleEqualizer = () => setShowEqualizer(prev => !prev);
```

**🔍 FIND:**
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
    audioRef,
    audioContext,
    sourceNode,
  } = useAudioPlayer();
```

**🔍 FIND:**
```typescript
      {/* Album Artwork */}
      <Artwork isPlaying={isPlaying} />
```

**✏️ REPLACE WITH:**
```typescript
      {/* Album Artwork with Equalizer */}
      <Artwork 
        isPlaying={isPlaying}
        audioContext={audioContext}
        sourceNode={sourceNode}
        showEqualizer={showEqualizer}
      />
```

**🔍 FIND:**
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

        {/* Equalizer Toggle */}
        <EqualizerToggle
          isActive={showEqualizer}
          onToggle={toggleEqualizer}
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
```

---

## Validation Checklist

- [ ] Equalizer bars animate with audio
- [ ] Bars respond to different frequencies
- [ ] Toggle button shows/hides equalizer
- [ ] Semi-transparent overlay doesn't obscure artwork
- [ ] Smooth 60fps animations
- [ ] Works on mobile
- [ ] State persists after refresh
- [ ] No console errors

## Testing

1. Play a track with varied frequencies (music with bass and treble)
2. Watch equalizer bars animate
3. Toggle equalizer off - should disappear
4. Toggle back on - should reappear
5. Refresh page - state should persist

## Completion Criteria

- ✅ Equalizer visualization working
- ✅ Real-time frequency analysis
- ✅ Toggle button functional
- ✅ Performance good (60fps)

**Next:** Proceed to `phase-3e-vocal-toggle-ui.md`

---

# END OF PHASE 3D INSTRUCTIONS
