# EXECUTE: Phase 5 Fixes - Duration Display & Layout Centering

**Prompt for Claude Code:**
"Please implement these Phase 5 fixes to correct the track durations and prevent layout shifting. Follow all implementation instructions exactly as specified below."

---

## Issue 1: Track Durations Show 3:00 (Placeholder Values)

**Root Cause:** The `album.ts` file has placeholder duration values of 180 seconds (3:00) for all tracks.

**Solution:** Update the actual durations for each track. The durations need to be manually updated based on the actual MP3 file lengths.

### Fix 1: Update Track Durations in Album Data

**File:** `src/data/album.ts`

**Current state:** All tracks have `duration: 180` (placeholder)

**Action Required:** Replace placeholder durations with actual track lengths in seconds.

**Find the tracks array** and update each track's duration:

```typescript
const tracks: Track[] = [
  {
    id: 1,
    title: 'A GOOD DAY',
    duration: 180, // ← UPDATE THIS with actual duration
    vocalFile: '/music/vocal/01-A-GOOD-DAY.mp3',
    instrumentalFile: '/music/instrumental/01-A-GOOD-DAY-instrumental.mp3',
    lyricsFile: '/lyrics/test.lrc',
    hasVocals: false,
  },
  {
    id: 2,
    title: 'AWARENESS',
    duration: 180, // ← UPDATE THIS
    vocalFile: '/music/vocal/02-AWARENESS.mp3',
    instrumentalFile: '/music/instrumental/02-AWARENESS-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  // ... continue for all tracks
];
```

**How to get actual durations:**

**Option A - Use Browser Console (Quick Method):**
1. Play each track in the browser
2. Let it fully load
3. Open console and run: `document.querySelector('audio').duration`
4. Record the number (in seconds)
5. Update album.ts with actual values

**Option B - Use Audio Metadata Tool:**
1. Use a tool like `ffprobe` or `mediainfo` on the MP3 files
2. Get duration in seconds for each file
3. Update album.ts

**Example with actual durations (you'll need to replace these with real values):**

```typescript
const tracks: Track[] = [
  {
    id: 1,
    title: 'A GOOD DAY',
    duration: 167, // 2:47 (example - replace with actual)
    vocalFile: '/music/vocal/01-A-GOOD-DAY.mp3',
    instrumentalFile: '/music/instrumental/01-A-GOOD-DAY-instrumental.mp3',
    lyricsFile: '/lyrics/test.lrc',
    hasVocals: false,
  },
  {
    id: 2,
    title: 'AWARENESS',
    duration: 189, // 3:09 (example - replace with actual)
    vocalFile: '/music/vocal/02-AWARENESS.mp3',
    instrumentalFile: '/music/instrumental/02-AWARENESS-instrumental.mp3',
    lyricsFile: null,
    hasVocals: false,
  },
  // ... etc
];
```

**Note:** For now, you can leave the placeholder values if you don't have the actual durations yet. The functionality works correctly; it's just displaying placeholder data.

---

## Issue 2: Layout Shifts When Lyrics Panel Closes

**Root Cause:** The center column is using `justify-content: center` in the main area, which causes it to center between the tracklist and empty space (instead of staying centered absolutely).

**Solution:** Use flexbox with proper spacing to keep center column always centered.

### Fix 2: Update Player Main Area Layout

**File:** `src/components/Player/Player.css`

**Find the `.player__main-area` rule** (around line 38-47):

```css
.player__main-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl); /* 32px between boxes and artwork */
  padding: var(--space-xl) 0;
  position: relative;
  min-height: 800px;
}
```

**Replace with:**

```css
.player__main-area {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Changed from 'center' */
  gap: var(--space-xl); /* 32px between boxes and artwork */
  padding: var(--space-xl) 0;
  position: relative;
  min-height: 800px;
}
```

**This alone won't fix it. We need to add spacing logic.**

---

### Fix 3: Add Spacer Divs for Balanced Layout

**File:** `src/components/Player/Player.tsx`

**Objective:** Add invisible spacer divs that maintain equal spacing on both sides of the center column.

**Find the player__main-area section** (around line 150-180):

```tsx
      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
        {/* Tracklist (LEFT side, desktop only) */}
        <div className="player__floating-box player__floating-box--tracklist">
          <Tracklist
            tracks={FOUNDATION_ALBUM.tracks}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            isLoading={playbackState === 'loading'}
            onTrackSelect={handleTrackSelect}
          />
        </div>

        {/* Central Column: Artwork + Track Info + Time + Waveform */}
        <div className="player__center-column">
          {/* ... center column content ... */}
        </div>

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

**Replace with (add spacer when lyrics are hidden):**

```tsx
      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
        {/* Tracklist (LEFT side, desktop only) */}
        <div className="player__floating-box player__floating-box--tracklist">
          <Tracklist
            tracks={FOUNDATION_ALBUM.tracks}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            isLoading={playbackState === 'loading'}
            onTrackSelect={handleTrackSelect}
          />
        </div>

        {/* Central Column: Artwork + Track Info + Time + Waveform */}
        <div className="player__center-column">
          {/* ... center column content ... */}
        </div>

        {/* Floating Lyrics Box (Desktop ≥1100px) OR Spacer */}
        {lyrics && lyricsDisplayState === 'panel' ? (
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
        ) : (
          <div className="player__floating-box player__floating-box--spacer" aria-hidden="true" />
        )}
      </div>
```

---

### Fix 4: Add Spacer Styling

**File:** `src/components/Player/Player.css`

**Find the desktop floating box section** (around line 65-90):

```css
/* Show floating boxes on desktop */
@media (min-width: 1100px) {
  .player__floating-box {
    display: block;
  }

  /* Tracklist box - LEFT side */
  .player__floating-box--tracklist {
    width: 380px;
    height: 750px;
    order: -1; /* Ensure tracklist appears first (LEFT) */
  }

  /* Lyrics box - RIGHT side */
  .player__floating-box--lyrics {
    order: 1; /* Ensure lyrics appears last (RIGHT) */
  }

  /* Artwork naturally centers */
  .player__main-area .artwork {
    align-self: center;
  }
}
```

**Add spacer styling:**

```css
/* Show floating boxes on desktop */
@media (min-width: 1100px) {
  .player__floating-box {
    display: block;
  }

  /* Tracklist box - LEFT side */
  .player__floating-box--tracklist {
    width: 380px;
    height: 750px;
    order: -1; /* Ensure tracklist appears first (LEFT) */
  }

  /* Lyrics box - RIGHT side */
  .player__floating-box--lyrics {
    width: 427px;
    order: 1; /* Ensure lyrics appears last (RIGHT) */
  }

  /* Spacer box - RIGHT side (when lyrics hidden) */
  .player__floating-box--spacer {
    width: 427px; /* Same width as lyrics panel */
    height: 1px; /* Minimal height, just for spacing */
    order: 1; /* Same order as lyrics */
    visibility: hidden; /* Invisible but takes up space */
  }

  /* Artwork naturally centers */
  .player__main-area .artwork {
    align-self: center;
  }
}
```

---

## Alternative Solution (Simpler)

If the spacer approach feels too complex, here's an alternative using CSS Grid:

### Alternative Fix: Use CSS Grid for Player Main Area

**File:** `src/components/Player/Player.css`

**Replace the `.player__main-area` rule:**

```css
.player__main-area {
  display: grid;
  grid-template-columns: 380px 1fr 427px; /* LEFT | CENTER | RIGHT */
  gap: var(--space-xl);
  padding: var(--space-xl) 0;
  position: relative;
  min-height: 800px;
  align-items: start;
}

/* Center column should be centered within its grid cell */
.player__center-column {
  justify-self: center;
}

/* Hide tracklist on mobile/tablet */
@media (max-width: 1099px) {
  .player__main-area {
    display: flex;
    flex-direction: column;
    grid-template-columns: none;
  }
}
```

**This ensures:**
- Tracklist is always 380px (LEFT)
- Center column is always centered in the middle grid cell
- Right side is always 427px (for lyrics or empty space)

---

## Testing Instructions

### Test Fix 1: Durations
1. Update at least one track's duration in `album.ts` with a real value
2. Reload the page
3. Check that the tracklist shows the updated duration
4. Verify formatTime is working correctly (e.g., 167 seconds → "2:47")

### Test Fix 2 & 3: Layout Centering (Spacer Method)
1. Open the website
2. Click lyrics toggle to cycle through states
3. **When lyrics are HIDDEN:**
   - Center column should be perfectly centered
   - Equal space on left (after tracklist) and right (spacer)
4. **When lyrics are in PANEL mode:**
   - Center column should stay in same position
   - Lyrics panel replaces the spacer on right
5. **When lyrics are INTEGRATED:**
   - Center column should stay in same position
   - Right side shows nothing (spacer)

### Test Alternative Fix: Layout Centering (Grid Method)
1. Open the website
2. Toggle lyrics through all states
3. Center column should NEVER move horizontally
4. Tracklist always on left (380px)
5. Right side always reserves 427px (lyrics or empty)

---

## Validation Checklist

### Duration Fix
- [ ] Actual track durations are displayed (not all 3:00)
- [ ] formatTime utility works correctly
- [ ] Durations are accurate for each track

### Layout Fix (Choose one method)
- [ ] Center column stays perfectly centered regardless of lyrics state
- [ ] No horizontal shifting when toggling lyrics
- [ ] Equal visual weight on both sides
- [ ] Tracklist always visible on left (desktop)
- [ ] Layout works on mobile (tracklist hidden)

### Visual Quality
- [ ] No awkward gaps or overlaps
- [ ] Spacing feels balanced
- [ ] Transitions are smooth
- [ ] All three boxes (tracklist, center, lyrics) align properly

---

## Recommended Approach

**For Duration Fix:**
- Start by updating a few tracks manually
- Test that formatTime works
- Update remaining tracks as you get actual durations

**For Layout Fix:**
- Try the **Grid method (alternative)** first - it's simpler and more reliable
- If you prefer flexbox, use the **Spacer method**
- Grid method is recommended for this use case

---

## Summary

**Issue 1 - Durations:**
- Update `src/data/album.ts` with actual track durations
- Placeholder values (180) need to be replaced with real seconds

**Issue 2 - Layout Shifting:**
- **Recommended:** Use CSS Grid for player__main-area
- **Alternative:** Add spacer div when lyrics are hidden
- Both methods keep center column always centered

Apply these fixes and your Phase 5 will be complete!
