# PHASE 4B: LYRICS DISPLAY COMPONENTS

## Claude Code Prompt

```
I'm implementing Phase 4B (Lyrics Display) for the PRIMEAPE music website.

Please implement:
1. 3-state lyrics toggle button
2. Lyrics panel component (side/bottom)
3. Integrated lyrics box component
4. Lyric line component with highlighting

Context:
- Phase 4A complete (LRC parser ready)
- Phase 1-3 complete (player functional)
- Need to add lyrics UI with 3 display states

Follow the detailed instructions below.
```

---

## Overview

**Sub-Phase:** 4B  
**Feature:** Lyrics Display Components  
**Complexity:** Moderate  
**Time Estimate:** 1.5 hours

**What Will Be Built:**
- Lyrics toggle button (3 states)
- Lyrics side panel (desktop) / bottom panel (mobile)
- Integrated lyrics box (compact)
- Lyric line component
- State management for display mode

**Dependencies:**
- Phase 4A complete (parser exists)
- Phase 2 complete (player structure)

---

## Files to Create

```
src/hooks/useLyrics.ts
src/components/Lyrics/LyricsToggle.tsx
src/components/Lyrics/LyricsToggle.css
src/components/Lyrics/LyricsPanel.tsx
src/components/Lyrics/LyricsPanel.css
src/components/Lyrics/LyricsBox.tsx
src/components/Lyrics/LyricsBox.css
src/components/Lyrics/LyricLine.tsx
src/components/Lyrics/LyricLine.css
```

## Files to Modify

```
src/components/Player/Player.tsx (add lyrics components)
src/components/Player/Player.css (layout adjustments)
```

---

## Implementation Instructions

### File: `src/hooks/useLyrics.ts`

**📁 CREATE NEW FILE:**

```typescript
import { useState, useEffect } from 'react';
import { loadLRC, ParsedLRC } from '@/utils/lrcParser';
import type { LyricsDisplayState } from '@/types';

interface UseLyricsReturn {
  lyrics: ParsedLRC | null;
  isLoading: boolean;
  error: string | null;
  displayState: LyricsDisplayState;
  toggleDisplayState: () => void;
}

/**
 * useLyrics Hook
 * 
 * Manages lyrics loading and display state
 * 
 * @param lyricsUrl - URL to LRC file
 * @returns Lyrics data and display state management
 */
export function useLyrics(lyricsUrl: string | null): UseLyricsReturn {
  const [lyrics, setLyrics] = useState<ParsedLRC | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load display state from localStorage
  const [displayState, setDisplayState] = useState<LyricsDisplayState>(() => {
    const saved = localStorage.getItem('primeape_lyrics_display');
    return (saved as LyricsDisplayState) || 'hidden';
  });

  // Load lyrics when URL changes
  useEffect(() => {
    if (!lyricsUrl) {
      setLyrics(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchLyrics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const parsed = await loadLRC(lyricsUrl);
        
        if (!cancelled) {
          setLyrics(parsed);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load lyrics:', err);
          setError('Failed to load lyrics');
          setIsLoading(false);
        }
      }
    };

    fetchLyrics();

    return () => {
      cancelled = true;
    };
  }, [lyricsUrl]);

  // Toggle display state: hidden → panel → integrated → hidden
  const toggleDisplayState = () => {
    setDisplayState(prev => {
      let next: LyricsDisplayState;
      
      if (prev === 'hidden') {
        next = 'panel';
      } else if (prev === 'panel') {
        next = 'integrated';
      } else {
        next = 'hidden';
      }

      // Save to localStorage
      localStorage.setItem('primeape_lyrics_display', next);
      
      return next;
    });
  };

  return {
    lyrics,
    isLoading,
    error,
    displayState,
    toggleDisplayState,
  };
}
```

---

### File: `src/components/Lyrics/LyricsToggle.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React from 'react';
import type { LyricsDisplayState } from '@/types';
import './LyricsToggle.css';

interface LyricsToggleProps {
  displayState: LyricsDisplayState;
  hasLyrics: boolean;
  onToggle: () => void;
}

/**
 * LyricsToggle Component
 * 
 * Button to toggle between lyrics display states
 * Shows current state with visual indicator
 */
const LyricsToggle: React.FC<LyricsToggleProps> = ({
  displayState,
  hasLyrics,
  onToggle,
}) => {
  const getTitle = () => {
    if (!hasLyrics) return 'No lyrics available';
    if (displayState === 'hidden') return 'Show lyrics panel';
    if (displayState === 'panel') return 'Show integrated lyrics';
    return 'Hide lyrics';
  };

  return (
    <button
      className={`lyrics-toggle ${displayState !== 'hidden' ? 'lyrics-toggle--active' : ''}`}
      onClick={onToggle}
      disabled={!hasLyrics}
      aria-label={getTitle()}
      title={getTitle()}
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
      
      {/* State indicator dots */}
      <span className="lyrics-toggle__indicator">
        {displayState === 'panel' && <span className="lyrics-toggle__dot" />}
        {displayState === 'integrated' && (
          <>
            <span className="lyrics-toggle__dot" />
            <span className="lyrics-toggle__dot" />
          </>
        )}
      </span>
    </button>
  );
};

export default LyricsToggle;
```

---

### File: `src/components/Lyrics/LyricsToggle.css`

**📁 CREATE NEW FILE:**

```css
.lyrics-toggle {
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

.lyrics-toggle:hover:not(:disabled) {
  color: var(--color-text-primary);
  background-color: var(--color-border);
}

.lyrics-toggle:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.lyrics-toggle:active:not(:disabled) {
  transform: scale(0.95);
}

.lyrics-toggle:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

.lyrics-toggle--active {
  color: var(--color-active);
}

.lyrics-toggle__indicator {
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2px;
}

.lyrics-toggle__dot {
  width: 3px;
  height: 3px;
  background-color: var(--color-active);
  border-radius: var(--radius-full);
}
```

---

### File: `src/components/Lyrics/LyricLine.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React from 'react';
import type { LyricLine as LyricLineType } from '@/types';
import './LyricLine.css';

interface LyricLineProps {
  line: LyricLineType;
  isCurrent: boolean;
  isUpcoming: boolean;
  onClick?: () => void;
}

/**
 * LyricLine Component
 * 
 * Single line of lyrics with highlighting
 */
const LyricLine: React.FC<LyricLineProps> = ({
  line,
  isCurrent,
  isUpcoming,
  onClick,
}) => {
  return (
    <div
      className={`lyric-line ${isCurrent ? 'lyric-line--current' : ''} ${isUpcoming ? 'lyric-line--upcoming' : ''}`}
      onClick={onClick}
    >
      {line.text || '\u00A0'} {/* Non-breaking space for empty lines */}
    </div>
  );
};

export default React.memo(LyricLine);
```

---

### File: `src/components/Lyrics/LyricLine.css`

**📁 CREATE NEW FILE:**

```css
.lyric-line {
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  transition: all var(--transition-normal);
  cursor: pointer;
  border-radius: var(--radius-sm);
}

.lyric-line:hover {
  background-color: var(--color-border);
  color: var(--color-text-primary);
}

.lyric-line--current {
  color: var(--color-active);
  font-weight: var(--font-weight-medium);
  background-color: var(--color-border);
  transform: scale(1.02);
}

.lyric-line--upcoming {
  color: var(--color-text-primary);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .lyric-line {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-sm);
  }
}
```

---

### File: `src/components/Lyrics/LyricsPanel.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React, { useRef, useEffect } from 'react';
import type { LyricLine as LyricLineType } from '@/types';
import { getCurrentLineIndex } from '@/utils/lrcParser';
import LyricLine from './LyricLine';
import './LyricsPanel.css';

interface LyricsPanelProps {
  lines: LyricLineType[];
  currentTime: number;
  isVisible: boolean;
  onClose: () => void;
  onLineClick?: (time: number) => void;
}

/**
 * LyricsPanel Component
 * 
 * Side panel (desktop) or bottom panel (mobile) with full lyrics
 * Auto-scrolls to current line
 */
const LyricsPanel: React.FC<LyricsPanelProps> = ({
  lines,
  currentTime,
  isVisible,
  onClose,
  onLineClick,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<HTMLDivElement>(null);

  const currentLineIndex = getCurrentLineIndex(lines, currentTime);

  // Auto-scroll to current line
  useEffect(() => {
    if (!isVisible || currentLineIndex === -1) return;

    const panel = panelRef.current;
    const currentLine = panel?.querySelector('.lyric-line--current');

    if (panel && currentLine) {
      // Scroll current line into view (centered)
      currentLine.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLineIndex, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay backdrop (mobile) */}
      <div className="lyrics-panel__backdrop" onClick={onClose} />

      {/* Panel */}
      <div ref={panelRef} className="lyrics-panel">
        {/* Header */}
        <div className="lyrics-panel__header">
          <h3 className="lyrics-panel__title">Lyrics</h3>
          <button
            className="lyrics-panel__close"
            onClick={onClose}
            aria-label="Close lyrics panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Lyrics content */}
        <div className="lyrics-panel__content">
          {lines.length === 0 ? (
            <p className="lyrics-panel__empty">No lyrics available</p>
          ) : (
            lines.map((line, index) => (
              <LyricLine
                key={index}
                line={line}
                isCurrent={index === currentLineIndex}
                isUpcoming={index === currentLineIndex + 1}
                onClick={() => onLineClick?.(line.time)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LyricsPanel;
```

---

### File: `src/components/Lyrics/LyricsPanel.css`

**📁 CREATE NEW FILE:**

```css
/* Backdrop (mobile only) */
.lyrics-panel__backdrop {
  display: none;
}

@media (max-width: 768px) {
  .lyrics-panel__backdrop {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: var(--z-modal);
    animation: fade-in var(--transition-normal);
  }
}

/* Panel */
.lyrics-panel {
  position: fixed;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  z-index: calc(var(--z-modal) + 1);
  display: flex;
  flex-direction: column;
  animation: slide-in var(--transition-normal);
}

/* Desktop: side panel */
@media (min-width: 769px) {
  .lyrics-panel {
    top: 0;
    right: 0;
    width: 400px;
    height: 100vh;
    border-left: 1px solid var(--color-border);
    box-shadow: var(--shadow-xl);
  }

  @keyframes slide-in {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
}

/* Mobile: bottom panel */
@media (max-width: 768px) {
  .lyrics-panel {
    left: 0;
    right: 0;
    bottom: 0;
    height: 60vh;
    max-height: 500px;
    border-top: 1px solid var(--color-border);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  @keyframes slide-in {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}

/* Header */
.lyrics-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.lyrics-panel__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.lyrics-panel__close {
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
}

.lyrics-panel__close:hover {
  color: var(--color-text-primary);
  background-color: var(--color-border);
}

/* Content */
.lyrics-panel__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
}

.lyrics-panel__empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--space-xl);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

---

### File: `src/components/Lyrics/LyricsBox.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React, { useRef, useEffect } from 'react';
import type { LyricLine as LyricLineType } from '@/types';
import { getCurrentLineIndex } from '@/utils/lrcParser';
import './LyricsBox.css';

interface LyricsBoxProps {
  lines: LyricLineType[];
  currentTime: number;
  isVisible: boolean;
}

/**
 * LyricsBox Component
 * 
 * Compact lyrics display between artwork and controls
 * Shows 3-4 lines with current line centered
 */
const LyricsBox: React.FC<LyricsBoxProps> = ({
  lines,
  currentTime,
  isVisible,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);

  const currentLineIndex = getCurrentLineIndex(lines, currentTime);

  // Auto-scroll to keep current line centered
  useEffect(() => {
    if (!isVisible || currentLineIndex === -1) return;

    const box = boxRef.current;
    const currentLine = box?.querySelector('.lyrics-box__line--current');

    if (box && currentLine) {
      currentLine.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLineIndex, isVisible]);

  if (!isVisible || lines.length === 0) return null;

  // Show 2 lines before and after current (5 total)
  const visibleLines = [];
  for (let i = Math.max(0, currentLineIndex - 2); i <= Math.min(lines.length - 1, currentLineIndex + 2); i++) {
    visibleLines.push({ ...lines[i], index: i });
  }

  return (
    <div ref={boxRef} className="lyrics-box">
      {visibleLines.map((line, idx) => (
        <div
          key={line.index}
          className={`lyrics-box__line ${line.index === currentLineIndex ? 'lyrics-box__line--current' : ''}`}
        >
          {line.text || '\u00A0'}
        </div>
      ))}
    </div>
  );
};

export default LyricsBox;
```

---

### File: `src/components/Lyrics/LyricsBox.css`

**📁 CREATE NEW FILE:**

```css
.lyrics-box {
  width: 100%;
  max-width: var(--player-max-width);
  margin: 0 auto;
  padding: var(--space-md);
  background-color: var(--color-border);
  border-radius: var(--radius-md);
  max-height: 120px;
  overflow-y: auto;
  text-align: center;
  animation: slide-down var(--transition-normal);
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lyrics-box__line {
  padding: var(--space-xs) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  transition: all var(--transition-normal);
}

.lyrics-box__line--current {
  color: var(--color-active);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  transform: scale(1.05);
}

/* Hide scrollbar but keep functionality */
.lyrics-box::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .lyrics-box {
    padding: var(--space-sm);
    max-height: 100px;
  }

  .lyrics-box__line {
    font-size: var(--font-size-xs);
  }

  .lyrics-box__line--current {
    font-size: var(--font-size-sm);
  }
}
```

---

### File: `src/components/Player/Player.tsx`

**🔍 FIND:**
```typescript
import VersionToggle from './VersionToggle';
```

**✏️ REPLACE WITH:**
```typescript
import VersionToggle from './VersionToggle';
import LyricsToggle from '../Lyrics/LyricsToggle';
import LyricsPanel from '../Lyrics/LyricsPanel';
import LyricsBox from '../Lyrics/LyricsBox';
import { useLyrics } from '@/hooks/useLyrics';
```

**🔍 FIND:**
```typescript
  const {
    currentTrackId,
    playbackState,
    currentTime,
    duration,
```

**➕ ADD AFTER:**
```typescript
  // Lyrics
  const currentTrack = currentTrackId ? getTrackById(currentTrackId) : null;
  const {
    lyrics,
    displayState: lyricsDisplayState,
    toggleDisplayState: toggleLyrics,
  } = useLyrics(currentTrack?.lyricsFile || null);
```

**🔍 FIND:**
```typescript
      {/* Album Artwork with Equalizer */}
      <Artwork 
        isPlaying={isPlaying}
        audioContext={audioContext}
        sourceNode={sourceNode}
        showEqualizer={showEqualizer}
      />

      {/* Track Information */}
      <TrackInfo track={currentTrack} error={error} />
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

      {/* Track Information */}
      <TrackInfo track={currentTrack} error={error} />

      {/* Integrated Lyrics Box */}
      {lyrics && (
        <LyricsBox
          lines={lyrics.lines}
          currentTime={currentTime}
          isVisible={lyricsDisplayState === 'integrated'}
        />
      )}
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

        {/* Equalizer Toggle */}
        <EqualizerToggle
          isActive={showEqualizer}
          onToggle={toggleEqualizer}
        />
```

**➕ ADD AFTER (before Volume Control):**
```typescript
        {/* Lyrics Toggle */}
        <LyricsToggle
          displayState={lyricsDisplayState}
          hasLyrics={!!lyrics}
          onToggle={toggleLyrics}
        />
```

**🔍 FIND (at end of Player return, before closing `</div>`):**
```typescript
    </div>
  );
};
```

**✏️ REPLACE WITH:**
```typescript
      {/* Lyrics Panel */}
      {lyrics && (
        <LyricsPanel
          lines={lyrics.lines}
          currentTime={currentTime}
          isVisible={lyricsDisplayState === 'panel'}
          onClose={toggleLyrics}
          onLineClick={(time) => seek(time)}
        />
      )}
    </div>
  );
};
```

---

## Validation Checklist

- [ ] Lyrics toggle button appears
- [ ] Button disabled when no lyrics
- [ ] Click once: panel slides in (desktop: right, mobile: bottom)
- [ ] Click twice: panel closes, box appears between artwork and controls
- [ ] Click thrice: all lyrics hidden
- [ ] Click again: panel reappears
- [ ] Current line highlights in accent color
- [ ] Panel scrollable
- [ ] Box shows 3-5 lines centered on current
- [ ] Close button in panel works
- [ ] Click backdrop (mobile) closes panel
- [ ] State persists after page refresh
- [ ] Responsive on mobile and desktop

---

## Testing

1. Upload LRC file for track 1
2. Update `album.ts` with lyrics file path
3. Play track
4. Click lyrics button
5. Verify panel appears
6. Verify current line highlights
7. Click button again
8. Verify box appears
9. Test on mobile viewport

---

## Completion Criteria

- ✅ All components created
- ✅ 3-state toggle works
- ✅ Panel displays correctly
- ✅ Box displays correctly
- ✅ No TypeScript errors
- ✅ Responsive design works

**Next:** Proceed to `phase-4c-lyrics-sync.md`

---

# END OF PHASE 4B INSTRUCTIONS
