# PHASE 4 CORRECTIONS - Track Info Positioning & LRC Parser

## Issues Overview

This correction file addresses two critical issues discovered at the end of Phase 4:

1. **TrackInfo Component Positioning** - Track info displays above the artwork instead of between the artwork and waveform
2. **LRC Parser Failures** - Parser breaks on 2-digit millisecond timestamps, preventing lyrics from loading

## Root Cause Analysis

### Issue 1: Layout Structure Problem
The `TrackInfo` component is rendered outside the `player__main-area` div in the component hierarchy, causing it to appear disconnected from the artwork at the top of the player.

**Current (incorrect) structure:**
```
Player
├── TrackInfo (appears at top, disconnected)
├── player__main-area
│   └── Artwork
├── TimeDisplay
└── WaveformBar
```

**Desired structure:**
```
Player
├── player__main-area
│   └── player__center-column
│       ├── Artwork
│       ├── TrackInfo
│       ├── TimeDisplay
│       └── WaveformBar
├── Integrated Lyrics Box
└── Secondary Controls
```

### Issue 2: Regex Pattern Inflexibility
The LRC parser uses a strict regex pattern that expects exactly 3-digit milliseconds:
```typescript
const timestampRegex = /\[(\d{2}):(\d{2})\.(\d{3})\]/g;
```

However, the user's LRC files contain 2-digit milliseconds (e.g., `[00:41.75]`), which don't match this pattern. This causes:
- Timestamps not being recognized
- Lyrics not being parsed
- The lyrics toggle breaking because `lyrics` is null

## Implementation Instructions

### Fix 1: Restructure Player Component Layout

**File:** `src/components/Player/Player.tsx`

**Objective:** Move TrackInfo into the main area and wrap it with Artwork in a centered column container.

#### Step 1: Restructure Player Layout - Move Components Into Center Column

**Location:** Find the section starting with TrackInfo through WaveformBar (around line 97-125)

**Current code pattern to find:**
```tsx
      {/* Track Information */}
      <TrackInfo 
        track={currentTrack} 
        album={FOUNDATION_ALBUM}
        trackIndex={trackIndex}
        error={error} 
      />

      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
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

      {/* Integrated Lyrics Box */}
      {lyrics && (
        <LyricsBox
          lines={lyrics.lines}
          currentTime={currentTime}
          isPlaying={isPlaying}
          isVisible={lyricsDisplayState === 'integrated'}
        />
      )}

      {/* Time Display */}
      <TimeDisplay currentTime={currentTime} duration={duration} />

      {/* Waveform Progress Bar */}
      <WaveformBar
```

**Replace with:**
```tsx
      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
        {/* Central Column: Artwork + Track Info + Time + Waveform */}
        <div className="player__center-column">
          {/* Album Artwork with Equalizer */}
          <Artwork 
            isPlaying={isPlaying}
            audioContext={audioContext}
            sourceNode={sourceNode}
            showEqualizer={showEqualizer}
          />

          {/* Track Information */}
          <TrackInfo 
            track={currentTrack} 
            album={FOUNDATION_ALBUM}
            trackIndex={trackIndex}
            error={error} 
          />

          {/* Time Display */}
          <TimeDisplay currentTime={currentTime} duration={duration} />

          {/* Waveform Progress Bar */}
          <WaveformBar
```

**Important:** Continue the WaveformBar props as they were, then close the center column div AFTER WaveformBar but BEFORE the floating lyrics box.

**Find the end of WaveformBar** (the closing `/>` tag) and add the closing div:
```tsx
          <WaveformBar
            audioUrl={currentTrack ? (audioVersion === 'vocal' && currentTrack.hasVocals ? currentTrack.vocalFile : currentTrack.instrumentalFile) : null}
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
          />
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

      {/* Integrated Lyrics Box */}
      {lyrics && (
        <LyricsBox
          lines={lyrics.lines}
          currentTime={currentTime}
          isPlaying={isPlaying}
          isVisible={lyricsDisplayState === 'integrated'}
        />
      )}
```

**Key changes:**
- Remove TrackInfo from before the main area
- Remove TimeDisplay and WaveformBar from after the main area
- Add new `player__center-column` wrapper div inside main area
- Order: Artwork → TrackInfo → TimeDisplay → WaveformBar
- All four components are now children of the center column
- Floating lyrics box stays in main area but outside center column
- Integrated lyrics box stays outside main area

**Result:** 
- Artwork appears first (largest visual element)
- TrackInfo appears directly below artwork
- TimeDisplay appears below TrackInfo
- WaveformBar appears at the bottom of the center column
- All components are vertically stacked and horizontally centered

---

### Fix 2: Add Center Column Styling

**File:** `src/components/Player/Player.css`

**Objective:** Define styles for the new center column container to properly position TrackInfo and Artwork.

#### Step 1: Add Center Column Styles

**Location:** After the `PLAYER MAIN AREA` section (around line 48, after `.player__main-area` block)

**Add this new section:**
```css
/* ============================================================================
   CENTER COLUMN - ARTWORK + TRACK INFO + TIME + WAVEFORM
   ============================================================================ */

.player__center-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md); /* 16px spacing between all components */
  width: 100%; /* Allow full width for waveform */
  max-width: 800px; /* Constrain on large screens */
}

/* Ensure center column is properly sized on desktop */
@media (min-width: 1100px) {
  .player__center-column {
    flex-shrink: 0; /* Prevent shrinking when lyrics panel is shown */
  }
}
```

**Explanation:**
- `flex-direction: column` - Stacks all four components (Artwork, TrackInfo, TimeDisplay, WaveformBar) vertically
- `align-items: center` - Centers all components horizontally
- `gap: var(--space-md)` - Adds consistent 16px spacing between each component
- `flex-shrink: 0` on desktop - Prevents column from shrinking when floating lyrics box appears
- `width: 100%` - Ensures WaveformBar can span full width
- `max-width: 800px` - Constrains the column to a reasonable width on large screens

**Result:** Artwork, TrackInfo, TimeDisplay, and WaveformBar will be vertically stacked and horizontally centered within the main area, creating a cohesive player interface.

---

### Fix 3: Update LRC Parser to Accept Variable Millisecond Digits

**File:** `src/utils/lrcParser.ts`

**Objective:** Make the parser flexible enough to handle 1, 2, or 3-digit millisecond formats.

#### Step 1: Update Timestamp Regex Pattern

**Location:** Inside the `parseLRC` function, find the regex definition (around line 50-51)

**Current code:**
```typescript
  // Regular expression for LRC timestamps: [mm:ss.xxx]
  const timestampRegex = /\[(\d{2}):(\d{2})\.(\d{3})\]/g;
```

**Replace with:**
```typescript
  // Regular expression for LRC timestamps: [mm:ss.x], [mm:ss.xx], or [mm:ss.xxx]
  // Captures 1-3 digit milliseconds to handle various LRC format variations
  const timestampRegex = /\[(\d{2}):(\d{2})\.(\d{1,3})\]/g;
```

**Key change:** 
- `\d{3}` → `\d{1,3}` allows 1 to 3 digits for milliseconds
- Now matches: `[00:10.5]`, `[00:41.75]`, and `[00:10.333]`

#### Step 2: Normalize Milliseconds to 3 Digits

**Location:** Inside the timestamp processing loop (around line 70-75)

**Current code:**
```typescript
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const milliseconds = parseInt(match[3], 10);
    const timeInSeconds = minutes * 60 + seconds + milliseconds / 1000;
```

**Replace with:**
```typescript
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    
    // Normalize milliseconds to 3 digits by padding with zeros
    // Examples: "5" → "500", "75" → "750", "750" → "750"
    // This ensures "75" is interpreted as 750ms (0.75s), not 75ms (0.075s)
    let msString = match[3];
    while (msString.length < 3) {
      msString += '0';
    }
    const milliseconds = parseInt(msString, 10);
    
    const timeInSeconds = minutes * 60 + seconds + milliseconds / 1000;
```

**Explanation:**
- Capture the millisecond string as-is
- Pad with trailing zeros until we have 3 digits
- `"75"` becomes `"750"` (750 milliseconds)
- `"5"` becomes `"500"` (500 milliseconds)
- `"750"` stays `"750"` (already 3 digits)
- Then parse as integer and convert to seconds

**Critical:** This padding approach is correct because in timestamps, `[00:41.75]` means 41.750 seconds (41 seconds and 750 milliseconds), not 41.075 seconds.

---

### Fix 4: Add Error Handling for Malformed LRC Lines

**File:** `src/utils/lrcParser.ts`

**Objective:** Skip lines that are only timestamps (no text) to prevent empty lyric entries.

#### Step 1: Add Timestamp-Only Line Filter

**Location:** Inside the line processing loop (around line 55-60)

**Current code:**
```typescript
  // Process lines
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
```

**Replace with:**
```typescript
  // Process lines
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Skip lines that are only timestamps with no text (malformed LRC)
    // Example: "[00:10.5]" with no lyrics after it
    if (/^\[[\d:.]+\]$/.test(trimmedLine)) continue;
```

**Explanation:**
- Regex `/^\[[\d:.]+\]$/` matches lines that are ONLY a timestamp with no text
- `^` = start of line
- `\[[\d:.]+\]` = timestamp pattern
- `$` = end of line (nothing after timestamp)
- This prevents parsing errors and empty lyric lines

**Result:** Parser will gracefully skip malformed lines without breaking.

---

## TypeScript Type Safety

No type changes are needed for these fixes. The existing types remain valid:

```typescript
// types/index.ts - No changes required
export interface LyricLine {
  time: number; // timestamp in seconds
  text: string;
}
```

The parser still outputs the same structure, just with more robust parsing logic.

---

## Testing Instructions

### Test 1: TrackInfo Visual Position

**Steps:**
1. Run the development server: `npm run dev`
2. Open the website in a browser
3. Select any track and play it

**Expected Results:**
- ✅ Artwork appears first at the top
- ✅ TrackInfo appears directly **below** the artwork
- ✅ TimeDisplay appears below TrackInfo
- ✅ WaveformBar appears below TimeDisplay
- ✅ Layout flow is: Artwork → TrackInfo → TimeDisplay → WaveformBar
- ✅ All components are horizontally centered
- ✅ Spacing between components is consistent (16px)

**Visual Check:**
```
┌─────────────────────────┐
│                         │
│   [Album Artwork]       │ ← Artwork
│                         │
├─────────────────────────┤
│      Track 15           │ ← TrackInfo
│       BATTLES           │
│      PRIMEAPE           │
├─────────────────────────┤
│    0:12 / 2:47          │ ← TimeDisplay
├─────────────────────────┤
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ │ ← WaveformBar
└─────────────────────────┘
```

**Mobile Check (< 1100px):**
- ✅ Artwork still appears first
- ✅ TrackInfo appears below artwork
- ✅ TimeDisplay and WaveformBar follow in order
- ✅ Layout remains vertical and centered

### Test 2: LRC Parser with 2-Digit Milliseconds

**Prerequisite:** Place `14-GRANDEUR.lrc` in `public/lyrics/` directory

**Setup:**
1. Ensure `src/data/album.ts` has this for track 14:
```typescript
{
  id: 14,
  title: 'GRANDEUR',
  lyricsFile: '/lyrics/14-GRANDEUR.lrc', // Ensure this path is set
  // ... other properties
}
```

**Steps:**
1. Play track 14 (GRANDEUR)
2. Open browser console (F12)
3. Click the lyrics toggle button (📄 icon)
4. Observe lyrics panel or integrated box

**Expected Results:**
- ✅ No console errors about "Failed to load lyrics"
- ✅ No errors about invalid timestamp formats
- ✅ Lyrics panel/box displays all lyrics correctly
- ✅ Lyrics auto-scroll as the track plays
- ✅ Current line highlights properly
- ✅ Clicking a lyric line seeks to that timestamp

**Console Validation:**
- ✅ No red error messages
- ✅ `useLyrics` hook completes successfully
- ✅ Parsed lyrics object contains all lyric lines

### Test 3: Various Timestamp Formats

**Purpose:** Verify parser handles different millisecond digit counts

**Test cases to verify:**

| Format | Example | Expected Parsing |
|--------|---------|------------------|
| 1-digit | `[00:10.5]` | 10.500 seconds |
| 2-digit | `[00:41.75]` | 41.750 seconds |
| 3-digit | `[00:10.333]` | 10.333 seconds |

**How to test:**
1. Create a test LRC file with all three formats
2. Load it for any track
3. Verify all timestamps are recognized and parsed
4. Check that sync timing is accurate

### Test 4: Lyrics Toggle State Cycle

**Steps:**
1. Play a track with lyrics
2. Click the lyrics toggle button multiple times
3. Observe the three states

**Expected State Cycle:**
1. Hidden (no lyrics shown)
2. Panel (floating lyrics box on desktop, bottom panel on mobile)
3. Integrated (lyrics box below waveform)
4. Back to Hidden

**Validation:**
- ✅ Button cycles through all three states without errors
- ✅ Each state displays (or hides) lyrics correctly
- ✅ State persists in localStorage
- ✅ No console errors during state transitions

### Test 5: Responsive Behavior

**Desktop (≥ 1100px):**
- ✅ TrackInfo centered above artwork
- ✅ Lyrics panel appears as floating box (when in panel state)
- ✅ Center column maintains size with lyrics shown

**Tablet/Mobile (< 1100px):**
- ✅ TrackInfo still above artwork
- ✅ Vertical layout maintained
- ✅ Lyrics panel appears below artwork (not floating)
- ✅ Touch interactions work properly

---

## Validation Checklist

Before considering these corrections complete, verify:

### Layout Fixes
- [ ] TrackInfo, TimeDisplay, and WaveformBar moved inside `player__main-area`
- [ ] All four components (Artwork, TrackInfo, TimeDisplay, WaveformBar) wrapped in `player__center-column`
- [ ] Visual hierarchy is correct: Artwork → TrackInfo → TimeDisplay → WaveformBar
- [ ] Spacing between all components is consistent (16px)
- [ ] Layout works on desktop (≥1100px) and mobile (<1100px)
- [ ] WaveformBar spans full width of center column

### Parser Fixes
- [ ] Regex accepts 1-3 digit milliseconds: `\d{1,3}`
- [ ] Milliseconds are normalized to 3 digits with padding
- [ ] Test LRC file (GRANDEUR) loads without errors
- [ ] Lyrics display and sync correctly
- [ ] Empty/malformed lines are filtered out
- [ ] No console errors during lyrics loading

### Integration Tests
- [ ] Lyrics toggle button cycles through all three states
- [ ] Auto-scroll follows playback accurately
- [ ] Clicking lyrics seeks to correct timestamp
- [ ] State persists in localStorage
- [ ] No visual glitches during state changes

### Cross-Browser Validation
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on macOS/iOS)
- [ ] Mobile browsers (Chrome Mobile, Safari iOS)

---

## Common Pitfalls to Avoid

### 1. Don't Leave Components Outside the Center Column
**Wrong:**
```tsx
<div className="player__main-area">
  <div className="player__center-column">
    <Artwork />
    <TrackInfo />
  </div>
</div>

{/* TimeDisplay and WaveformBar left outside - WRONG! */}
<TimeDisplay />
<WaveformBar />
```

**Correct:**
```tsx
<div className="player__main-area">
  <div className="player__center-column">
    <Artwork />
    <TrackInfo />
    <TimeDisplay />
    <WaveformBar />
  </div>

  {/* Floating Lyrics Box - still inside main-area but outside center column */}
  {lyrics && lyricsDisplayState === 'panel' && (
    <div className="player__floating-box">...</div>
  )}
</div>
```

### 2. Don't Use Leading Zeros in Millisecond Padding
**Wrong:**
```typescript
// This would make "75" become "075" (invalid)
let msString = match[3];
while (msString.length < 3) {
  msString = '0' + msString; // WRONG: prepending zeros
}
```

**Correct:**
```typescript
// This makes "75" become "750" (correct)
let msString = match[3];
while (msString.length < 3) {
  msString += '0'; // CORRECT: appending zeros
}
```

**Why:** In LRC timestamps, `[00:41.75]` means 41 seconds + 750 milliseconds, not 41 seconds + 75 milliseconds.

### 3. Don't Forget the Center Column Styles
Without the `.player__center-column` CSS, the Artwork, TrackInfo, TimeDisplay, and WaveformBar won't be properly aligned. Make sure both the JSX change AND the CSS change are applied.

---

## File Summary

### Files Modified (3 total)

1. **`src/components/Player/Player.tsx`**
   - Moved TrackInfo, TimeDisplay, and WaveformBar into `player__main-area`
   - Added `player__center-column` wrapper
   - Wrapped Artwork, TrackInfo, TimeDisplay, and WaveformBar together in correct order

2. **`src/components/Player/Player.css`**
   - Added `.player__center-column` styles
   - Flexbox column layout with center alignment
   - Added width and max-width constraints
   - Responsive adjustments for desktop

3. **`src/utils/lrcParser.ts`**
   - Updated regex to accept 1-3 digit milliseconds
   - Added millisecond normalization logic
   - Added malformed line filtering

### Files NOT Modified

- `src/components/Player/TrackInfo.tsx` - No changes needed
- `src/components/Player/Artwork.tsx` - No changes needed
- `src/components/Player/TimeDisplay.tsx` - No changes needed (just moved)
- `src/components/Player/WaveformBar.tsx` - No changes needed (just moved)
- `src/hooks/useLyrics.ts` - No changes needed
- `src/types/index.ts` - No changes needed

---

## Expected Outcome

After applying these corrections:

1. **Visual Layout:** The player will have a clean vertical hierarchy with Artwork at the top, followed by TrackInfo, TimeDisplay, and WaveformBar - all centered and properly spaced
2. **Lyrics Functionality:** LRC files with 2-digit milliseconds (like GRANDEUR.lrc) will parse correctly and display synced lyrics
3. **Lyrics Toggle:** The three-state toggle (hidden → panel → integrated) will work without breaking
4. **Auto-scroll:** Lyrics will highlight and scroll with playback timing
5. **No Console Errors:** All lyrics-related operations will complete without errors

---

## Next Steps After Corrections

Once these corrections are validated:

1. ✅ Confirm TrackInfo positioning is correct on desktop and mobile
2. ✅ Confirm GRANDEUR lyrics load and sync properly
3. ✅ Test lyrics toggle through all three states
4. ✅ Verify no console errors
5. ➡️ **Ready to proceed to Phase 5: Tracklist & Navigation**

Phase 5 will add the scrollable tracklist component with click-to-play functionality, building on the solid Phase 4 foundation.

---

## Support & Debugging

### If Components Are Not In Correct Order

1. Check that ALL four components (Artwork, TrackInfo, TimeDisplay, WaveformBar) are **inside** `player__center-column`
2. Verify component order in JSX: Artwork first, then TrackInfo, then TimeDisplay, then WaveformBar
3. Check browser DevTools (Inspect Element) to see actual DOM structure
4. Verify `player__center-column` has `flex-direction: column` in CSS
5. Clear browser cache and hard reload (Ctrl+Shift+R)

### If Lyrics Still Don't Load

1. Open browser console (F12) and look for error messages
2. Check that LRC file path in `album.ts` is correct: `/lyrics/14-GRANDEUR.lrc`
3. Verify LRC file exists in `public/lyrics/` directory
4. Check Network tab in DevTools - is the LRC file being fetched?
5. Add console.log in `lrcParser.ts` to debug:
```typescript
console.log('Parsing LRC content:', content);
console.log('Found timestamps:', Array.from(content.matchAll(timestampRegex)));
```

### If Lyrics Load But Don't Sync

1. Check that timestamps in LRC file are chronological (sorted by time)
2. Verify millisecond padding is working correctly
3. Test with a simple LRC file with known good timestamps
4. Check `getCurrentLineIndex` function is being called in LyricsPanel/LyricsBox

---

## Conclusion

These corrections address the two critical Phase 4 issues:
- **Layout:** TrackInfo now properly positioned in the visual hierarchy
- **Parsing:** LRC parser now handles variable millisecond formats robustly

The fixes are minimal, targeted, and maintain backward compatibility with existing functionality. All components continue to work as designed, with improved robustness and correct visual layout.

Apply these changes, test thoroughly, and you'll have a solid Phase 4 foundation to build Phase 5 upon.
