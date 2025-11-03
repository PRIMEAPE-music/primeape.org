# Lyrics Panel Behavior Modifications

## Objective
Modify the lyrics system to have platform-specific behaviors:
- **Desktop (≥1100px)**: Lyrics panel always visible, lyrics button only toggles auto-scroll box
- **Mobile (<1100px)**: Lyrics panel toggleable with full-screen display and compact playback controls

## Files to Modify
1. `src/hooks/useLyrics.ts`
2. `src/components/Player/Player.tsx`
3. `src/components/Lyrics/LyricsPanel.tsx`
4. `src/components/Lyrics/LyricsPanel.css`
5. `src/components/Lyrics/LyricsToggle.tsx`

---

## 1. src/hooks/useLyrics.ts

### Change 1: Update default display state to 'panel'

**FIND:**
```typescript
  // Load display state from localStorage
  const [displayState, setDisplayState] = useState<LyricsDisplayState>(() => {
    const saved = localStorage.getItem('primeape_lyrics_display');
    return (saved as LyricsDisplayState) || 'hidden';
  });
```

**REPLACE WITH:**
```typescript
  // Load display state from localStorage
  const [displayState, setDisplayState] = useState<LyricsDisplayState>(() => {
    const saved = localStorage.getItem('primeape_lyrics_display');
    // Default to 'panel' for better UX (panel always visible on desktop)
    return (saved as LyricsDisplayState) || 'panel';
  });
```

### Change 2: Update toggle logic for desktop/mobile behavior

**FIND:**
```typescript
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
```

**REPLACE WITH:**
```typescript
  // Toggle display state
  // Desktop (≥1100px): panel → integrated → panel (no hidden state)
  // Mobile (<1100px): hidden → panel → hidden (no integrated state)
  const toggleDisplayState = () => {
    setDisplayState(prev => {
      let next: LyricsDisplayState;
      
      // Check if we're on desktop or mobile
      const isDesktop = window.innerWidth >= 1100;
      
      if (isDesktop) {
        // Desktop: toggle between panel and integrated (no hidden)
        if (prev === 'panel') {
          next = 'integrated';
        } else {
          next = 'panel';
        }
      } else {
        // Mobile: toggle between hidden and panel (no integrated)
        if (prev === 'hidden') {
          next = 'panel';
        } else {
          next = 'hidden';
        }
      }

      // Save to localStorage
      localStorage.setItem('primeape_lyrics_display', next);
      
      return next;
    });
  };
```

---

## 2. src/components/Player/Player.tsx

### Change 1: Update desktop floating lyrics panel to always show

**FIND:**
```typescript
        {/* Floating Lyrics Box (Desktop ≥1100px) */}
        {lyrics && lyricsDisplayState === 'panel' && (
          <div className="player__floating-box player__floating-box--lyrics">
            <LyricsPanel
              lines={lyrics.lines}
              currentTime={currentTime}
              isPlaying={isPlaying}
              isVisible={true}
              onClose={toggleLyrics}
              onLineClick={(time) => seek(time)}
            />
          </div>
        )}
```

**REPLACE WITH:**
```typescript
        {/* Floating Lyrics Box (Desktop ≥1100px) - Always visible when lyrics exist */}
        {lyrics && (
          <div className="player__floating-box player__floating-box--lyrics">
            <LyricsPanel
              lines={lyrics.lines}
              currentTime={currentTime}
              isPlaying={isPlaying}
              isVisible={true}
              onClose={toggleLyrics}
              onLineClick={(time) => seek(time)}
              isMobile={false}
            />
          </div>
        )}
```

### Change 2: Add mobile controls props to mobile lyrics panel

**FIND:**
```typescript
      {/* Mobile/Tablet Lyrics Panel (< 1100px) */}
      <div className="player__mobile-lyrics-panel">
        {lyrics && lyricsDisplayState === 'panel' && (
          <LyricsPanel
            lines={lyrics.lines}
            currentTime={currentTime}
            isPlaying={isPlaying}
            isVisible={true}
            onClose={toggleLyrics}
            onLineClick={(time) => seek(time)}
          />
        )}
      </div>
```

**REPLACE WITH:**
```typescript
      {/* Mobile/Tablet Lyrics Panel (< 1100px) */}
      <div className="player__mobile-lyrics-panel">
        {lyrics && lyricsDisplayState === 'panel' && (
          <LyricsPanel
            lines={lyrics.lines}
            currentTime={currentTime}
            isPlaying={isPlaying}
            isVisible={true}
            onClose={toggleLyrics}
            onLineClick={(time) => seek(time)}
            isMobile={true}
            onPlayPause={togglePlayPause}
            onPrevious={prevTrack}
            onNext={nextTrack}
            playbackState={playbackState}
          />
        )}
      </div>
```

---

## 3. src/components/Lyrics/LyricsPanel.tsx

### Change 1: Update interface to include mobile props

**FIND:**
```typescript
interface LyricsPanelProps {
  lines: LyricLineType[];
  currentTime: number;
  isPlaying: boolean;
  isVisible: boolean;
  onClose: () => void;
  onLineClick?: (time: number) => void;
}
```

**REPLACE WITH:**
```typescript
interface LyricsPanelProps {
  lines: LyricLineType[];
  currentTime: number;
  isPlaying: boolean;
  isVisible: boolean;
  onClose: () => void;
  onLineClick?: (time: number) => void;
  isMobile: boolean;
  onPlayPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  playbackState?: 'playing' | 'paused' | 'loading' | 'stopped';
}
```

### Change 2: Update component destructuring

**FIND:**
```typescript
const LyricsPanel: React.FC<LyricsPanelProps> = ({
  lines,
  currentTime,
  isPlaying,
  isVisible,
  onClose,
  onLineClick,
}) => {
```

**REPLACE WITH:**
```typescript
const LyricsPanel: React.FC<LyricsPanelProps> = ({
  lines,
  currentTime,
  isPlaying,
  isVisible,
  onClose,
  onLineClick,
  isMobile,
  onPlayPause,
  onPrevious,
  onNext,
  playbackState = 'paused',
}) => {
```

### Change 3: Add mobile controls to JSX

**FIND:**
```typescript
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
```

**REPLACE WITH:**
```typescript
  return (
    <>
      {/* Overlay backdrop (mobile) */}
      <div className="lyrics-panel__backdrop" onClick={onClose} />

      {/* Panel */}
      <div ref={panelRef} className={`lyrics-panel ${isMobile ? 'lyrics-panel--mobile' : ''}`}>
        {/* Header with optional mobile controls */}
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

        {/* Mobile compact controls */}
        {isMobile && onPlayPause && onPrevious && onNext && (
          <div className="lyrics-panel__mobile-controls">
            <button
              className="lyrics-panel__control-btn"
              onClick={onPrevious}
              aria-label="Previous track"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" />
              </svg>
            </button>
            
            <button
              className="lyrics-panel__control-btn lyrics-panel__control-btn--play"
              onClick={onPlayPause}
              aria-label={playbackState === 'playing' ? 'Pause' : 'Play'}
            >
              {playbackState === 'playing' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
            
            <button
              className="lyrics-panel__control-btn"
              onClick={onNext}
              aria-label="Next track"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </button>
          </div>
        )}
```

---

## 4. src/components/Lyrics/LyricsPanel.css

### Change 1: Add mobile controls styling after close button styles

**LOCATION:** Add after the `.lyrics-panel__close:focus-visible` rule (around line 125)

**ADD THIS CSS:**
```css
/* ============================================================================
   MOBILE COMPACT CONTROLS
   ============================================================================ */

.lyrics-panel__mobile-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg);
}

.lyrics-panel__control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  color: var(--color-text-primary);
  cursor: pointer;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.lyrics-panel__control-btn--play {
  width: 56px;
  height: 56px;
  background-color: var(--color-active);
  color: var(--color-bg);
}

.lyrics-panel__control-btn:hover:not(:disabled) {
  background-color: var(--color-border);
  transform: scale(1.05);
}

.lyrics-panel__control-btn--play:hover:not(:disabled) {
  background-color: var(--color-hover);
}

.lyrics-panel__control-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.lyrics-panel__control-btn:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* Hide mobile controls on desktop */
@media (min-width: 1100px) {
  .lyrics-panel__mobile-controls {
    display: none;
  }
}
```

### Change 2: Update mobile panel to full screen

**FIND:**
```css
/* ============================================================================
   MOBILE: BOTTOM PANEL (<769px)
   ============================================================================ */

@media (max-width: 768px) {
  .lyrics-panel {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60vh;
    max-height: 500px;
    border-top: 2px solid var(--color-border);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    z-index: calc(var(--z-modal) + 1);
    animation: slide-up var(--transition-normal);
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
```

**REPLACE WITH:**
```css
/* ============================================================================
   MOBILE: FULL SCREEN PANEL (<769px)
   ============================================================================ */

@media (max-width: 768px) {
  .lyrics-panel--mobile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    max-height: none;
    border: none;
    border-radius: 0;
    z-index: calc(var(--z-modal) + 1);
    animation: slide-up var(--transition-normal);
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
```

### Change 3: Update tablet panel to full screen

**FIND:**
```css
/* ============================================================================
   TABLET: USE MOBILE PANEL (769px - 1099px)
   ============================================================================ */

@media (min-width: 769px) and (max-width: 1099px) {
  .lyrics-panel {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60vh;
    max-height: 500px;
    border-top: 2px solid var(--color-border);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    z-index: calc(var(--z-modal) + 1);
    animation: slide-up var(--transition-normal);
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
```

**REPLACE WITH:**
```css
/* ============================================================================
   TABLET: FULL SCREEN PANEL (769px - 1099px)
   ============================================================================ */

@media (min-width: 769px) and (max-width: 1099px) {
  .lyrics-panel--mobile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    max-height: none;
    border: none;
    border-radius: 0;
    z-index: calc(var(--z-modal) + 1);
    animation: slide-up var(--transition-normal);
  }

  @keyframes slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
```

---

## 5. src/components/Lyrics/LyricsToggle.tsx

### Change 1: Update button title logic for desktop/mobile

**FIND:**
```typescript
  const getTitle = () => {
    if (!hasLyrics) return 'No lyrics available';
    if (displayState === 'hidden') return 'Show lyrics panel';
    if (displayState === 'panel') return 'Show integrated lyrics';
    return 'Hide lyrics';
  };
```

**REPLACE WITH:**
```typescript
  const getTitle = () => {
    if (!hasLyrics) return 'No lyrics available';
    
    // Check if we're on desktop or mobile
    const isDesktop = window.innerWidth >= 1100;
    
    if (isDesktop) {
      // Desktop: toggle between panel and auto-scroll box
      if (displayState === 'panel') return 'Show auto-scroll lyrics';
      return 'Hide auto-scroll lyrics';
    } else {
      // Mobile: toggle panel visibility
      if (displayState === 'hidden') return 'Show lyrics';
      return 'Hide lyrics';
    }
  };
```

---

## Testing Checklist

After implementing these changes, verify:

### Desktop (≥1100px):
- [ ] Lyrics panel appears on right side when lyrics exist
- [ ] Panel is always visible (does not hide)
- [ ] Lyrics button toggles auto-scroll box on/off
- [ ] Button tooltip says "Show auto-scroll lyrics" / "Hide auto-scroll lyrics"
- [ ] Panel maintains fixed 427px width
- [ ] No mobile controls visible in panel

### Mobile (<1100px):
- [ ] Lyrics button toggles panel visibility
- [ ] When shown, panel takes full screen (100vh)
- [ ] Compact controls appear at top (Previous, Play/Pause, Next)
- [ ] Controls are functional and properly sized (44px/56px)
- [ ] Close button (X) in top right works
- [ ] Button tooltip says "Show lyrics" / "Hide lyrics"
- [ ] Auto-scroll box does NOT appear on mobile
- [ ] Backdrop overlay appears behind panel

### Both:
- [ ] TypeScript compiles without errors
- [ ] No console errors
- [ ] Lyrics sync and auto-scroll work correctly
- [ ] User scroll disables auto-scroll temporarily
- [ ] localStorage persists display state
- [ ] Smooth animations on show/hide

---

## Implementation Notes

1. **Order of Changes**: Implement in the order listed (1-5) to avoid TypeScript errors
2. **TypeScript**: Ensure all new props are properly typed
3. **CSS Specificity**: The `.lyrics-panel--mobile` class is added conditionally via the `isMobile` prop
4. **Responsive Testing**: Test at exactly 1099px and 1100px to verify breakpoint behavior
5. **Default State**: New users will see panel by default ('panel' instead of 'hidden')

## Expected Behavior Summary

| Platform | Button Action | Panel Visibility | States Used |
|----------|--------------|------------------|-------------|
| Desktop (≥1100px) | Toggles auto-scroll box | Always visible | panel ↔ integrated |
| Mobile (<1100px) | Toggles panel | Show/Hide | hidden ↔ panel |