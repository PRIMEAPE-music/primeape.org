# PHASE 4 - FLOATING BOX IMPLEMENTATION

## Claude Code Prompt

```
I'm implementing a design change for Phase 4 (Lyrics System) of the PRIMEAPE music website.

DESIGN CHANGE: Replace the side panel lyrics display with a floating box layout.

Key Requirements:
1. Lyrics appear in a floating box to the RIGHT of album artwork (not from screen edge)
2. Box dimensions: 320px wide × 750px tall (nearly 2× artwork height)
3. Box is vertically centered with artwork (extends above and below equally)
4. Desktop only (≥1100px) - mobile keeps existing bottom panel behavior
5. Maintains all existing functionality (toggle, auto-scroll, sync)

Context:
- Phase 4B and 4C are complete
- Current implementation has side panel sliding from right edge
- Need to reposition as floating box next to artwork
- Prepares for Phase 5 tracklist box on left side

Follow the detailed instructions below to implement this design change.
```

---

## Overview

**What This Changes:**
- Lyrics panel positioning and layout
- Player component structure
- Responsive breakpoints
- CSS animations

**What Stays The Same:**
- All lyrics functionality (parsing, sync, highlighting)
- Mobile behavior (bottom panel)
- Integrated lyrics box (state 3)
- Toggle button and state management

**Estimated Time:** Claude Code should complete this in 5-10 minutes

---

## Files to Modify

```
src/components/Lyrics/LyricsPanel.css (MAJOR CHANGES)
src/components/Player/Player.tsx (STRUCTURAL CHANGES)
src/components/Player/Player.css (NEW STYLES)
```

---

## Implementation Instructions

### File: `src/components/Lyrics/LyricsPanel.css`

**🔄 COMPLETE REWRITE:**

```css
/* ============================================================================
   LYRICS PANEL - FLOATING BOX DESIGN
   ============================================================================ */

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

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ============================================================================
   PANEL CONTAINER
   ============================================================================ */

.lyrics-panel {
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  transition: background-color var(--transition-normal),
              border-color var(--transition-normal);
}

/* ============================================================================
   DESKTOP: FLOATING BOX (≥1100px)
   ============================================================================ */

@media (min-width: 1100px) {
  .lyrics-panel {
    position: relative;
    width: 320px;
    height: 750px;
    animation: fade-scale-in var(--transition-normal);
  }

  @keyframes fade-scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
}

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

/* ============================================================================
   HEADER
   ============================================================================ */

.lyrics-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.lyrics-panel__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.lyrics-panel__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: var(--space-xs);
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.lyrics-panel__close:hover {
  color: var(--color-text-primary);
  background-color: var(--color-border);
}

.lyrics-panel__close:active {
  transform: scale(0.95);
}

.lyrics-panel__close:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* ============================================================================
   CONTENT
   ============================================================================ */

.lyrics-panel__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
}

/* Custom scrollbar for lyrics */
.lyrics-panel__content::-webkit-scrollbar {
  width: 8px;
}

.lyrics-panel__content::-webkit-scrollbar-track {
  background: var(--color-bg);
  border-radius: var(--radius-sm);
}

.lyrics-panel__content::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: var(--radius-sm);
}

.lyrics-panel__content::-webkit-scrollbar-thumb:hover {
  background: var(--color-hover);
}

/* Firefox scrollbar */
.lyrics-panel__content {
  scrollbar-width: thin;
  scrollbar-color: var(--color-accent) var(--color-bg);
}

.lyrics-panel__empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--space-xl);
  font-size: var(--font-size-sm);
}

/* ============================================================================
   RESPONSIVE ADJUSTMENTS
   ============================================================================ */

@media (max-width: 768px) {
  .lyrics-panel__header {
    padding: var(--space-sm) var(--space-md);
  }

  .lyrics-panel__content {
    padding: var(--space-sm);
  }
}
```

---

### File: `src/components/Player/Player.tsx`

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
      {/* Track Information */}
      <TrackInfo track={currentTrack} error={error} />

      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
        {/* Placeholder for Tracks Box (Phase 5) */}
        <div className="player__floating-box player__floating-box--tracks">
          {/* Tracks box will go here in Phase 5 */}
        </div>

        {/* Album Artwork with Equalizer */}
        <Artwork 
          isPlaying={isPlaying}
          audioContext={audioContext}
          sourceNode={sourceNode}
          showEqualizer={showEqualizer}
        />

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
      </div>
```

**🔍 FIND (near the end of Player return, look for the LyricsPanel that's outside the main structure):**
```typescript
      {/* Lyrics Panel */}
      {lyrics && (
        <LyricsPanel
          lines={lyrics.lines}
          currentTime={currentTime}
          isPlaying={isPlaying}
          isVisible={lyricsDisplayState === 'panel'}
          onClose={toggleLyrics}
          onLineClick={(time) => seek(time)}
        />
      )}
    </div>
  );
};
```

**✏️ REPLACE WITH:**
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
    </div>
  );
};
```

---

### File: `src/components/Player/Player.css`

**🔍 FIND:**
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

**✏️ REPLACE WITH:**
```css
.player {
  width: 100%;
  max-width: 1400px; /* Increased to accommodate floating boxes */
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
```

**➕ ADD AFTER (add these new styles):**

```css
/* ============================================================================
   PLAYER MAIN AREA - FLOATING BOX LAYOUT
   ============================================================================ */

.player__main-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl); /* 32px between boxes and artwork */
  padding: var(--space-xl) 0;
  position: relative;
  min-height: 800px;
}

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

  .player__floating-box--tracks {
    order: 1; /* Left side */
  }

  .player__floating-box--lyrics {
    order: 3; /* Right side */
  }

  /* Artwork in center */
  .player__main-area .artwork {
    order: 2;
    align-self: center;
  }

  /* Placeholder for tracks box - invisible but maintains layout */
  .player__floating-box--tracks {
    width: 320px;
    height: 750px;
    visibility: hidden; /* Hidden but takes up space */
  }
}

/* ============================================================================
   MOBILE/TABLET LYRICS PANEL
   ============================================================================ */

.player__mobile-lyrics-panel {
  display: none;
}

/* Show mobile panel on tablet and mobile when lyrics are visible */
@media (max-width: 1099px) {
  .player__mobile-lyrics-panel {
    display: block;
  }

  .player__main-area {
    flex-direction: column;
    align-items: center;
    min-height: auto;
    gap: var(--space-md);
  }
}

/* Desktop: hide mobile panel */
@media (min-width: 1100px) {
  .player__mobile-lyrics-panel {
    display: none;
  }
}

/* ============================================================================
   RESPONSIVE ADJUSTMENTS
   ============================================================================ */

@media (max-width: 1099px) {
  .player {
    max-width: var(--player-max-width);
    padding: var(--space-lg) var(--space-md);
  }
}

@media (max-width: 768px) {
  .player {
    padding: var(--space-md);
  }

  .player__main-area {
    padding: var(--space-md) 0;
  }
}
```

---

## Validation Checklist

After implementation, verify:

### Desktop (≥1100px):
- [ ] Lyrics box appears to RIGHT of album artwork (not screen edge)
- [ ] Box dimensions: 320px wide × 750px tall
- [ ] Box extends above and below artwork equally
- [ ] Box vertically centered with artwork
- [ ] Gap between box and artwork: ~32px
- [ ] Fade-scale animation on appear
- [ ] Close button works
- [ ] Auto-scroll works
- [ ] Click line to seek works
- [ ] Styled scrollbar visible
- [ ] No mobile panel appears

### Tablet (769px - 1099px):
- [ ] Floating box does NOT appear
- [ ] Mobile-style bottom panel appears instead
- [ ] Panel slides up from bottom
- [ ] Backdrop visible
- [ ] All functionality works

### Mobile (<769px):
- [ ] Floating box does NOT appear
- [ ] Mobile-style bottom panel appears
- [ ] Panel slides up from bottom
- [ ] Backdrop visible
- [ ] All functionality works

### All Screen Sizes:
- [ ] Toggle cycles correctly (hidden → panel → integrated → hidden)
- [ ] Integrated box (state 3) still works
- [ ] State persists after refresh
- [ ] No layout breaking
- [ ] No console errors
- [ ] TypeScript compiles successfully

### Positioning Verification:
- [ ] Track info displays ABOVE floating boxes
- [ ] Boxes align with top of track info area
- [ ] Boxes extend below artwork
- [ ] Bottom of boxes just above waveform progress bar
- [ ] Artwork stays centered between boxes

---

## Testing Instructions

### Step 1: Test Desktop (≥1100px)
1. Resize browser to 1200px wide
2. Click lyrics toggle button
3. Verify box appears next to artwork (not from edge)
4. Measure box height (should be taller than artwork)
5. Verify scrollbar appears and works
6. Click line to seek - verify it works
7. Watch auto-scroll while playing
8. Close and verify it disappears

### Step 2: Test Tablet (900px)
1. Resize browser to 900px wide
2. Click lyrics toggle
3. Verify BOTTOM panel appears (not floating box)
4. Verify backdrop appears
5. Close and verify it works

### Step 3: Test Mobile (400px)
1. Resize browser to 400px wide
2. Click lyrics toggle
3. Verify bottom panel appears
4. Verify functionality works

### Step 4: Test Integrated Box
1. On any screen size
2. Toggle to state 3 (integrated box)
3. Verify box appears between artwork and controls
4. Verify auto-scroll works

### Step 5: Visual Inspection
1. Desktop: Check vertical centering
2. Measure gaps (should be ~32px)
3. Check box heights match spec (750px)
4. Verify symmetry (ready for Phase 5 tracks box)

---

## Known Issues & Solutions

### Issue 1: Box Not Centered Vertically
**Symptoms:** Box appears too high or too low  
**Solution:** Check `align-items: center` on `.player__main-area`

### Issue 2: Layout Breaks on Tablet
**Symptoms:** Floating box appears when it shouldn't  
**Solution:** Verify breakpoint logic in media queries (1099px max)

### Issue 3: Mobile Panel Doesn't Appear
**Symptoms:** No panel on mobile when toggled  
**Solution:** Check `.player__mobile-lyrics-panel` display rules

### Issue 4: Gap Too Small/Large
**Symptoms:** Boxes too close or too far from artwork  
**Solution:** Adjust `gap: var(--space-xl)` in `.player__main-area`

### Issue 5: Scrollbar Not Styled
**Symptoms:** Default browser scrollbar shows  
**Solution:** Check webkit-scrollbar CSS is applied

---

## Performance Notes

**Expected Performance:**
- Smooth fade-scale animation (60fps)
- No layout shift when toggling
- Instant response to scroll
- No lag with 100+ lyric lines

**If Performance Issues:**
1. Check for excessive re-renders (React DevTools)
2. Verify CSS transforms used (not left/right properties)
3. Confirm auto-scroll debounced (Phase 4C)
4. Check browser console for warnings

---

## Post-Implementation

### Phase 5 Preparation:
This implementation includes a placeholder for the Phase 5 tracks box:
```typescript
<div className="player__floating-box player__floating-box--tracks">
  {/* Tracks box will go here in Phase 5 */}
</div>
```

**In Phase 5, you'll:**
1. Replace placeholder with actual Tracklist component
2. Use same 320px × 750px dimensions
3. Use same styling (border, shadow, animation)
4. Display all 16 tracks without scrolling

### CSS Variables Available:
- `--space-xl`: 32px (gap between boxes)
- `--color-border`: Border color
- `--color-bg`: Background color
- `--shadow-xl`: Box shadow
- `--radius-lg`: Border radius

---

## Success Criteria

Phase 4 floating box implementation is successful when:

✅ **Desktop (≥1100px):**
- Floating box appears next to artwork
- Box is 320px × 750px
- Vertically centered with artwork
- Smooth animations

✅ **Tablet/Mobile (<1100px):**
- Bottom panel appears instead
- No floating boxes visible
- All functionality preserved

✅ **All Features Work:**
- Toggle states
- Auto-scroll
- Line highlighting
- Click to seek
- Close button
- State persistence

✅ **No Regressions:**
- TypeScript compiles
- No console errors
- No layout breaks
- Performance smooth

✅ **Ready for Phase 5:**
- Placeholder in place
- Layout accommodates second box
- Symmetrical design

---

## Completion

Once validated:
1. Commit changes to Git
2. Test on multiple screen sizes
3. Verify in different browsers
4. Prepare for Phase 5 (Tracklist)

**Next:** Phase 5 will add the tracks box on the left side, completing the symmetrical floating box layout.

---

# END OF FLOATING BOX IMPLEMENTATION INSTRUCTIONS

**Estimated Time:** 5-10 minutes (Claude Code)  
**Difficulty:** Moderate (structural changes)  
**Impact:** Major visual improvement, prepares for Phase 5

Good luck! 🎵
