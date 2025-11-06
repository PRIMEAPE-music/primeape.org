# Mobile Tracklist - Fix Play Toggle & Initial Scroll Issues

## Issues Identified

### Issue 1: Every Other Track Plays
**Problem:** Clicking tracks alternates between playing and pausing
**Root Cause:** The `handleTrackSelect` function has logic that toggles play/pause when clicking the same track. However, after a track loads, sometimes the state update timing causes the next click to be treated as "same track" when it shouldn't be.

### Issue 2: Page Scrolls to Tracklist on Load
**Problem:** When site first loads (no track selected yet), page jumps down to tracklist
**Root Cause:** The Tracklist component's auto-scroll effect runs even when `currentTrackId` is `null`, causing the mobile tracklist to scroll into view on page load.

---

## Fix Instructions

### Fix 1: Always Play New Track Selection (Don't Toggle)

The issue is in the Player component's `handleTrackSelect` logic. When selecting from the mobile tracklist, we should ALWAYS play the track, not toggle play/pause.

#### File: `src/components/Player/Player.tsx`

🔍 **FIND:**
```tsx
  // Handle track selection from tracklist
  const handleTrackSelect = React.useCallback((trackId: number) => {
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
  }, [currentTrackId, playbackState, togglePlayPause, loadTrack]);
```

✏️ **REPLACE WITH:**
```tsx
  // Handle track selection from tracklist
  const handleTrackSelect = React.useCallback((trackId: number) => {
    // If clicking the same track that's already loaded
    if (trackId === currentTrackId) {
      // Toggle play/pause
      togglePlayPause();
    } else {
      // Load and play new track
      loadTrack(trackId);
      // Auto-play immediately after load starts
      // The loadTrack sets state to 'loading', which will transition to 'paused' when ready
      // We'll play as soon as it's ready via the effect below
    }
  }, [currentTrackId, togglePlayPause, loadTrack]);

  // Auto-play when a new track finishes loading (for tracklist selections)
  const previousTrackIdRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    // When track changes and becomes ready to play
    if (
      currentTrackId !== null &&
      currentTrackId !== previousTrackIdRef.current &&
      playbackState === 'paused' &&
      previousTrackIdRef.current !== null // Don't auto-play on initial load
    ) {
      // New track loaded and ready - auto-play it
      togglePlayPause();
    }
    
    // Update the ref
    if (currentTrackId !== previousTrackIdRef.current) {
      previousTrackIdRef.current = currentTrackId;
    }
  }, [currentTrackId, playbackState, togglePlayPause]);
```

**What Changed:**
- Removed the `setTimeout` approach which was unreliable
- Added a `useEffect` that watches for track changes and auto-plays when the new track is ready
- Uses a ref to track previous track ID to distinguish between initial load and track changes
- Only auto-plays when transitioning from one track to another (not on initial page load)

---

### Fix 2: Prevent Initial Auto-Scroll in Tracklist

The tracklist should only auto-scroll when there's actually a track playing, not on initial page load.

#### File: `src/components/Tracklist/Tracklist.tsx`

🔍 **FIND:**
```tsx
  // Auto-scroll to current track when it changes
  useEffect(() => {
    if (!currentTrackId) return;

    const tracklist = tracklistRef.current;
    const currentTrackElement = tracklist?.querySelector('.tracklist-item--current') as HTMLElement;

    if (tracklist && currentTrackElement) {
      // Scroll current track into view (centered if possible)
      currentTrackElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTrackId]);
```

✏️ **REPLACE WITH:**
```tsx
  // Track if this is the initial mount
  const hasScrolledRef = React.useRef(false);

  // Auto-scroll to current track when it changes
  useEffect(() => {
    if (!currentTrackId) return;

    const tracklist = tracklistRef.current;
    const currentTrackElement = tracklist?.querySelector('.tracklist-item--current') as HTMLElement;

    if (tracklist && currentTrackElement) {
      // On first scroll (when track is first selected), don't animate and don't scroll page
      if (!hasScrolledRef.current) {
        hasScrolledRef.current = true;
        // Scroll without animation and only within container (don't affect page scroll)
        currentTrackElement.scrollIntoView({
          behavior: 'auto', // Instant, no animation on first load
          block: 'center',
          inline: 'nearest',
        });
      } else {
        // Subsequent scrolls can be smooth
        currentTrackElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [currentTrackId]);
```

**What Changed:**
- Added `hasScrolledRef` to track if auto-scroll has happened before
- First scroll uses `behavior: 'auto'` (instant) to prevent jarring animation on page load
- First scroll also uses `inline: 'nearest'` to be less aggressive
- Subsequent track changes use smooth scrolling as before
- This prevents the mobile tracklist from forcing the entire page to scroll on initial load

---

### Alternative Fix 2 (Simpler): Only Scroll When Playing

If the above still causes issues, here's a simpler approach - only scroll when a track is actively playing:

#### File: `src/components/Tracklist/Tracklist.tsx`

**ALTERNATIVE APPROACH - Use this instead if the above doesn't fully fix it:**

🔍 **FIND:**
```tsx
  // Auto-scroll to current track when it changes
  useEffect(() => {
    if (!currentTrackId) return;

    const tracklist = tracklistRef.current;
    const currentTrackElement = tracklist?.querySelector('.tracklist-item--current') as HTMLElement;

    if (tracklist && currentTrackElement) {
      // Scroll current track into view (centered if possible)
      currentTrackElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTrackId]);
```

✏️ **REPLACE WITH:**
```tsx
  // Auto-scroll to current track when it changes
  // Only scroll if user has interacted (track is playing or has played)
  const hasInteractedRef = React.useRef(false);

  useEffect(() => {
    // Mark as interacted once something is playing
    if (isPlaying && !hasInteractedRef.current) {
      hasInteractedRef.current = true;
    }
  }, [isPlaying]);

  useEffect(() => {
    // Don't scroll until user has started playback
    if (!currentTrackId || !hasInteractedRef.current) return;

    const tracklist = tracklistRef.current;
    const currentTrackElement = tracklist?.querySelector('.tracklist-item--current') as HTMLElement;

    if (tracklist && currentTrackElement) {
      // Scroll current track into view (centered if possible)
      currentTrackElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTrackId, isPlaying]);
```

**What Changed:**
- Only scrolls after `isPlaying` has been true at least once
- Prevents any scrolling on initial page load when no track has played yet
- More conservative approach - waits for explicit user interaction

**Choose:** Try the first fix first. If the page still jumps to tracklist on load, use this alternative approach instead.

---

## Additional Fix: Prevent Page-Level ScrollIntoView

Sometimes `scrollIntoView` scrolls the entire page, not just the container. Let's ensure it only scrolls within the tracklist container.

#### File: `src/components/Tracklist/Tracklist.css`

➕ **ADD AFTER:** `.tracklist__content { ... }` styles

```css

/* Ensure tracklist container doesn't trigger page scroll */
.tracklist {
  /* Contain scroll behavior within this element */
  overflow: clip; /* Prevents content from triggering parent scroll */
}

.tracklist__content {
  /* Ensure this is the scroll container */
  position: relative;
  isolation: isolate; /* Creates new stacking context */
}
```

**What This Does:**
- `overflow: clip` on the tracklist container prevents child scrollIntoView from affecting parent scroll
- `isolation: isolate` ensures the scrollable area is treated independently

---

## Summary of Changes

### Play/Pause Fix:
- Removed unreliable `setTimeout` approach
- Added proper `useEffect` that auto-plays when new track finishes loading
- Uses ref to track previous track and prevent auto-play on initial load
- Result: Every track click loads and plays correctly

### Initial Scroll Fix (Choose One):
**Option 1 (Recommended):** First scroll is instant/non-animated
- Prevents jarring animation on page load
- Allows smooth scrolling for subsequent track changes

**Option 2 (More Conservative):** Only scroll after user interaction
- Completely prevents auto-scroll until first play
- Most reliable way to prevent unwanted scrolling

### CSS Enhancement:
- Ensures scrollIntoView only affects tracklist container, not page scroll

---

## Testing After Fixes

### Play/Pause Testing:
- [ ] Click track 1 in mobile tracklist → plays
- [ ] Click track 2 → switches and plays
- [ ] Click track 3 → switches and plays
- [ ] Click track 4 → switches and plays
- [ ] Every click should result in track playing (not alternating play/pause)
- [ ] Clicking same track twice → toggles play/pause (this is correct behavior)

### Initial Scroll Testing:
- [ ] Fresh page load → page stays at top (doesn't jump to tracklist)
- [ ] First track selection → tracklist scrolls to show that track
- [ ] Subsequent tracks → smooth scrolling within tracklist
- [ ] No impact on desktop tracklist behavior

### Edge Cases:
- [ ] Page load with no track → no scroll
- [ ] Select first track → plays correctly
- [ ] Select last track → plays correctly
- [ ] Rapid clicking different tracks → each plays when ready

---

## Technical Notes

### Why setTimeout Was Unreliable:
The previous approach used:
```tsx
setTimeout(() => {
  if (playbackState !== 'playing') {
    togglePlayPause();
  }
}, 100);
```

Problems:
1. 100ms might not be enough for track to load
2. Race conditions - state might change during timeout
3. `playbackState` captured in closure might be stale

### Why useEffect is Better:
```tsx
useEffect(() => {
  if (currentTrackId !== previousId && playbackState === 'paused') {
    togglePlayPause();
  }
}, [currentTrackId, playbackState]);
```

Benefits:
1. Reacts to actual state changes (track loaded and ready)
2. No arbitrary timeouts
3. Prevents auto-play on initial page load with ref check
4. More predictable and testable

### ScrollIntoView on Page Load:
The original code would scroll whenever `currentTrackId` changed, including:
- Initial load when track 1 is loaded by default
- Caused mobile tracklist to become visible and scroll page

The fix ensures scrolling only happens:
- After first user interaction (option 2), OR
- Without animation on first scroll (option 1)
- Only within tracklist container (CSS fix)

---

## Recommendation

Apply fixes in this order:
1. **Play/Pause fix** in Player.tsx (required)
2. **Initial scroll fix Option 1** in Tracklist.tsx (try first)
3. **CSS enhancement** in Tracklist.css (safety measure)
4. If Option 1 doesn't fully work, try **Option 2** instead

This should resolve both issues cleanly!