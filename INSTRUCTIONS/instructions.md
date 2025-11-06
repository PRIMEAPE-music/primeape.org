# Mobile Tracklist - Simplified Fixes for Click-to-Play and Scroll

## Issues Identified

### Issue 1: Track Requires Two Clicks to Play
**Problem:** The new auto-play effect is waiting for `playbackState === 'paused'`, but after loadTrack, the state might not be 'paused' yet, requiring a second interaction.

**Solution:** Simplify by calling play directly in loadTrack callback, avoiding the complex effect logic.

### Issue 2: Page Still Jumps to Tracklist on Load
**Problem:** Even with the hasScrolledRef, the initial track load (track ID 1) triggers the scroll effect.

**Solution:** More aggressive prevention - don't auto-scroll at all on mobile for the first track selection, or disable auto-scroll entirely for mobile tracklist.

---

## Fix Instructions

### Fix 1: Remove Complex Auto-Play Logic - Use Direct Approach

Let's go back to basics and make it much simpler.

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

✏️ **REPLACE WITH:**
```tsx
  // Handle track selection from tracklist
  const handleTrackSelect = React.useCallback((trackId: number) => {
    // If clicking the same track that's already loaded
    if (trackId === currentTrackId) {
      // Toggle play/pause
      togglePlayPause();
    } else {
      // Load new track
      loadTrack(trackId);
      
      // Wait for track to be ready, then play
      const audio = audioRef.current;
      if (!audio) return;
      
      const playWhenReady = () => {
        // Play as soon as metadata is loaded
        audio.play().catch(err => {
          console.error('Auto-play failed:', err);
        });
        audio.removeEventListener('canplay', playWhenReady);
      };
      
      // If already can play, play immediately
      if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or better
        audio.play().catch(err => {
          console.error('Auto-play failed:', err);
        });
      } else {
        // Otherwise wait for canplay event
        audio.addEventListener('canplay', playWhenReady, { once: true });
      }
    }
  }, [currentTrackId, togglePlayPause, loadTrack, audioRef]);
```

**What Changed:**
- Removed the complex useEffect with refs and state watching
- Directly uses audio element's `canplay` event to know when track is ready
- Calls `audio.play()` directly instead of going through togglePlayPause
- Checks if audio is already ready to avoid waiting unnecessarily
- Uses `{ once: true }` to auto-remove the event listener
- Much simpler and more predictable

---

### Fix 2: Completely Prevent Auto-Scroll on Initial Load

The most reliable way is to not scroll until explicitly told to by user interaction.

#### File: `src/components/Tracklist/Tracklist.tsx`

🔍 **FIND:**
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

✏️ **REPLACE WITH:**
```tsx
  // Track if user has interacted (clicked a track)
  const userHasInteractedRef = React.useRef(false);
  const previousTrackIdRef = React.useRef<number | null>(null);

  // Auto-scroll to current track when it changes (but only after user interaction)
  useEffect(() => {
    if (!currentTrackId) return;

    // If track changed from one to another (not initial load), mark as interacted
    if (previousTrackIdRef.current !== null && currentTrackId !== previousTrackIdRef.current) {
      userHasInteractedRef.current = true;
    }
    
    // Update the ref
    previousTrackIdRef.current = currentTrackId;

    // Only scroll if user has explicitly changed tracks
    if (!userHasInteractedRef.current) return;

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

**What Changed:**
- Uses `userHasInteractedRef` to track if user has clicked a track
- Uses `previousTrackIdRef` to detect actual track changes (not initial load)
- Only scrolls after `previousTrackIdRef` has been set (meaning at least one track change has occurred)
- Completely prevents any scrolling on initial page load when track 1 loads by default
- Once user clicks a track, subsequent changes will scroll normally

---

### Alternative Approach: Disable Auto-Scroll for Mobile Tracklist Only

If you'd prefer, we can disable auto-scroll entirely for the mobile tracklist (since it's in ContentSections, not the player area where it's less important).

#### File: `src/components/ContentSections/ContentSections.tsx`

Add a prop to disable auto-scroll for the mobile instance:

🔍 **FIND:**
```tsx
      {/* Mobile Tracklist - only visible on tablet/mobile */}
      <div className="content-sections__mobile-tracklist">
        <Tracklist
          tracks={FOUNDATION_ALBUM.tracks}
          currentTrackId={currentTrackId}
          isPlaying={isPlaying}
          isLoading={isLoading}
          onTrackSelect={onTrackSelect}
        />
      </div>
```

✏️ **REPLACE WITH:**
```tsx
      {/* Mobile Tracklist - only visible on tablet/mobile */}
      <div className="content-sections__mobile-tracklist">
        <Tracklist
          tracks={FOUNDATION_ALBUM.tracks}
          currentTrackId={currentTrackId}
          isPlaying={isPlaying}
          isLoading={isLoading}
          onTrackSelect={onTrackSelect}
          disableAutoScroll={true}
        />
      </div>
```

#### File: `src/components/Tracklist/Tracklist.tsx`

Add the prop to the interface and use it:

🔍 **FIND:**
```tsx
interface TracklistProps {
  tracks: Track[];
  currentTrackId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  onTrackSelect: (trackId: number) => void;
}
```

✏️ **REPLACE WITH:**
```tsx
interface TracklistProps {
  tracks: Track[];
  currentTrackId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  onTrackSelect: (trackId: number) => void;
  disableAutoScroll?: boolean;
}
```

🔍 **FIND:**
```tsx
const Tracklist: React.FC<TracklistProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  isLoading,
  onTrackSelect,
}) => {
```

✏️ **REPLACE WITH:**
```tsx
const Tracklist: React.FC<TracklistProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  isLoading,
  onTrackSelect,
  disableAutoScroll = false,
}) => {
```

🔍 **FIND:**
```tsx
  // Auto-scroll to current track when it changes
  useEffect(() => {
    if (!currentTrackId) return;
```

✏️ **REPLACE WITH:**
```tsx
  // Auto-scroll to current track when it changes
  useEffect(() => {
    if (!currentTrackId || disableAutoScroll) return;
```

**What This Does:**
- Completely disables auto-scroll for mobile tracklist
- Desktop tracklist (in player) still auto-scrolls normally
- Simplest solution - no complexity around tracking interaction
- User can manually scroll mobile tracklist if needed

---

## Recommendation

**Use this combination:**

1. **Fix 1 (Simplified Click-to-Play)** - REQUIRED
   - Removes complex state watching
   - Uses direct audio.play() with canplay event
   - Should work on first click every time

2. **Fix 2 (Interaction-Based Scroll)** - RECOMMENDED
   - Prevents scroll until user explicitly changes tracks
   - More natural behavior
   - Doesn't scroll on initial page load

**OR, if scroll is still problematic:**

3. **Alternative Approach (Disable Mobile Auto-Scroll)** - SIMPLEST
   - Just turns off auto-scroll for mobile tracklist
   - Guarantees no page jumping
   - Desktop still works normally

---

## Testing After Fixes

### Click-to-Play:
- [ ] Fresh page load
- [ ] Click track 1 → plays immediately (not two clicks)
- [ ] Click track 2 → plays immediately
- [ ] Click track 3 → plays immediately
- [ ] Click same track → toggles play/pause correctly

### Page Load Scroll:
- [ ] Fresh page load → page stays at top (doesn't jump)
- [ ] Page loads showing player at top
- [ ] Tracklist visible but not forcing scroll
- [ ] First track click works and doesn't cause jarring scroll

### Ongoing Behavior:
- [ ] Switching tracks works smoothly
- [ ] Desktop tracklist unaffected (still auto-scrolls)
- [ ] Mobile tracklist shows current track indicator
- [ ] No console errors

---

## Why This is Simpler

### Previous Approach (Complex):
```
loadTrack → state changes → useEffect watches → checks conditions → togglePlayPause → more state changes → eventually plays
```

### New Approach (Simple):
```
loadTrack → wait for canplay event → audio.play() → done
```

Much more direct and predictable!

---

## Summary of Changes

1. **Player.tsx handleTrackSelect:**
   - Use audio element's `canplay` event directly
   - Call `audio.play()` when ready
   - No complex state watching or refs

2. **Tracklist.tsx auto-scroll:**
   - Track user interaction with refs
   - Only scroll after first explicit track change
   - Prevents initial page load scroll

3. **Alternative (if needed):**
   - Add `disableAutoScroll` prop to Tracklist
   - Set to `true` for mobile instance only
   - Simplest solution if other approaches still have issues

Apply Fix 1 + Fix 2, and if scroll is still an issue, apply the Alternative Approach as well.