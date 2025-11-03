# PHASE 4 OVERVIEW: LYRICS SYSTEM

## Phase Structure

Phase 4 implements the complete 3-state lyrics system with LRC file support, auto-scrolling, and mobile-optimized display. This phase is broken into 3 sub-phases.

### Sub-Phases:

1. **Phase 4A: LRC Parser & Utilities** ⏱️ 45min | 🔧 Simple
   - LRC format parser
   - SRT to LRC converter
   - Lyrics data structures
   - File loading utilities

2. **Phase 4B: Lyrics Display Components** ⏱️ 1.5hr | 🔧 Moderate
   - 3-state toggle system (hidden → panel → integrated)
   - Side panel component (desktop/mobile)
   - Integrated lyrics box component
   - Current line highlighting

3. **Phase 4C: Auto-Scroll & Sync** ⏱️ 1hr | 🔧 Moderate
   - Sync engine for timestamped lyrics
   - Auto-scroll logic
   - Current line tracking
   - Smooth scroll animations

### Total Estimated Time: 3-4 hours

---

## Lyrics System Design

### Three Display States:

**State 1: Hidden**
- No lyrics visible
- Default state if no lyrics file available

**State 2: Side Panel (Desktop) / Bottom Panel (Mobile)**
- Lyrics slide in from right (desktop) or bottom (mobile)
- Scrollable panel with all lyrics
- Current line highlighted
- Manual scroll + auto-scroll option

**State 3: Integrated Box**
- Compact box between artwork and controls
- Shows 3-4 lines at a time
- Auto-scrolls to keep current line centered
- Minimal space footprint

### Toggle Flow:

```
Press 1st time → Panel appears (State 2)
Press 2nd time → Panel closes, box appears (State 3)
Press 3rd time → All lyrics hidden (State 1)
Press again    → Back to panel (State 2)
```

---

## LRC Format Explained

LRC (Lyric) files contain timestamped lyrics:

```
[00:12.00]First line of lyrics
[00:15.50]Second line of lyrics
[00:18.20]Third line of lyrics
```

**Format:** `[MM:SS.SS]Lyric text`

**Advantages:**
- Simple text format
- Easy to create/edit
- Precise synchronization
- Industry standard

---

## Dependencies

- ✅ **Phase 2:** Audio player with currentTime tracking
- ✅ **Phase 3:** Player layout established

---

## File Structure After Phase 4

```
src/
├── hooks/
│   ├── useLyrics.ts (NEW)
│   └── useLyricsSync.ts (NEW)
├── components/
│   ├── Lyrics/
│   │   ├── LyricsToggle.tsx (NEW)
│   │   ├── LyricsToggle.css (NEW)
│   │   ├── LyricsPanel.tsx (NEW)
│   │   ├── LyricsPanel.css (NEW)
│   │   ├── LyricsBox.tsx (NEW)
│   │   ├── LyricsBox.css (NEW)
│   │   └── LyricLine.tsx (NEW)
│   └── Player/
│       └── Player.tsx (MODIFIED)
├── utils/
│   ├── lrcParser.ts (NEW)
│   └── srtToLrc.ts (NEW)
└── types/
    └── index.ts (MODIFIED - add lyrics types)
```

---

## What You'll Need

### For Testing:
- At least 1 LRC file with timestamped lyrics
- Or 1 SRT file to convert to LRC
- A track to play with lyrics

### Creating LRC Files:

**Option 1: Manual Creation**
```
[00:00.00]Song title by Artist
[00:05.50]First line
[00:08.30]Second line
```

**Option 2: From DaVinci Resolve SRT**
- Export subtitles as SRT from DaVinci
- Use the SRT→LRC converter (Phase 4A)

**Option 3: Online Tools**
- lrclib.net
- syair.info
- Aegisub (free software)

---

## Key Features

### LRC Parser (Phase 4A):
- Parse LRC format to structured data
- Handle metadata tags ([ar:Artist], [ti:Title], etc.)
- Sort by timestamp
- Error handling for malformed files

### Display Components (Phase 4B):
- Toggle button in player controls
- Responsive panels (desktop vs mobile)
- Smooth slide animations
- Current line highlighting with accent color
- Fallback for plain text (non-timestamped)

### Sync Engine (Phase 4C):
- Real-time line matching based on currentTime
- Auto-scroll with smooth transitions
- Configurable scroll behavior
- Performance optimized (no lag)

---

## How to Use These Instructions

### Option 1: Sequential (Recommended)
Complete each sub-phase in order:
1. Phase 4A: Parse lyrics files
2. Phase 4B: Build display components
3. Phase 4C: Add synchronization

### Option 2: All at Once (Advanced)
If comfortable with the system:
- Read all three instruction files
- Implement entire Phase 4 in one session
- More efficient but harder to debug

---

## Claude Code Prompt Template

For each sub-phase:

```
I'm working on Phase 4[X] of the PRIMEAPE music website.

Please read and implement: phase-4[x]-[name].md

Context:
- Phase 1-3 complete
- Audio player functional with all controls
- Need to add lyrics system with 3-state toggle

Requirements:
- Follow instructions exactly
- Maintain existing patterns
- Test thoroughly
- Full implementation only

Ready to begin.
```

---

## Validation After Phase 4

### Functionality:
- [ ] LRC files parse correctly
- [ ] Toggle button cycles through 3 states
- [ ] Panel displays on desktop/mobile appropriately
- [ ] Integrated box shows between artwork and controls
- [ ] Current line highlights in real-time
- [ ] Auto-scroll keeps current line visible
- [ ] Works with timestamped LRC files
- [ ] Gracefully handles missing lyrics files
- [ ] Works with plain text (non-timestamped)

### Visual:
- [ ] Smooth slide animations
- [ ] Current line clearly highlighted
- [ ] Typography readable
- [ ] Mobile: panel doesn't obscure controls
- [ ] Desktop: panel doesn't interfere with player

### Technical:
- [ ] TypeScript compiles with no errors
- [ ] No console errors or warnings
- [ ] Lyrics load efficiently
- [ ] No memory leaks
- [ ] Performance: smooth 60fps scrolling

---

## Known Challenges

### Challenge 1: LRC File Format Variations
**Issue:** Different tools create slightly different LRC formats  
**Solution:** Parser handles common variations gracefully

### Challenge 2: Mobile Panel Positioning
**Issue:** Panel could cover player controls  
**Solution:** Careful CSS positioning with z-index management

### Challenge 3: Auto-Scroll Timing
**Issue:** Scroll could feel jerky or laggy  
**Solution:** CSS smooth-scroll + requestAnimationFrame for precision

### Challenge 4: Long Lyrics Files
**Issue:** Large files (100+ lines) could slow down  
**Solution:** Virtualized scrolling (optional) or simple optimization

---

## Testing Strategy

**Phase 4A Testing:**
1. Create simple LRC file
2. Verify parser extracts lines correctly
3. Test timestamp parsing
4. Check error handling

**Phase 4B Testing:**
1. Toggle button appears in player
2. Click once → panel slides in
3. Click twice → box appears
4. Click thrice → all hidden
5. Verify mobile vs desktop layout

**Phase 4C Testing:**
1. Play track with LRC file
2. Watch current line highlight
3. Verify auto-scroll follows
4. Test manual scroll override
5. Check performance (no lag)

---

## Edge Cases to Handle

- No lyrics file exists (graceful fallback)
- Malformed LRC file (error handling)
- Lyrics without timestamps (display as plain text)
- Very long lines (text wrapping)
- Very short gaps between lines (< 0.5s)
- User manually scrolls (pause auto-scroll temporarily)

---

## After Phase 4

Once Phase 4 is complete:
- ✅ Complete lyrics system functional
- ✅ 3-state toggle working
- ✅ Synchronized highlighting
- ✅ Mobile-optimized display

**Next:** Phase 5 - Tracklist & Navigation (clickable track list, current track highlighting)

---

## Lyrics File Naming Convention

Store LRC files in `/public/lyrics/`:

```
public/lyrics/
├── 01-A-GOOD-DAY.lrc
├── 02-AWARENESS.lrc
├── 03-MOTIVATIONS.lrc
└── ...
```

**Format:** `[track-number]-[TRACK-NAME].lrc`

Must match the file naming in `album.ts` data.

---

## Sample LRC File

Here's a minimal example for testing:

```lrc
[ar:PRIMEAPE]
[ti:A GOOD DAY]
[al:FOUNDATION]
[length:03:24]

[00:00.50]Wake up to a new beginning
[00:03.80]Sun is shining, I'm winning
[00:07.20]Today's gonna be a good day
[00:10.50]Nothing standing in my way

[00:14.00]Step by step, I'm moving forward
[00:17.30]Leave the past, no looking backward
[00:20.60]Every moment is a blessing
[00:24.00]This is my confessing
```

Save as `01-A-GOOD-DAY.lrc` for testing.

---

## Troubleshooting

### If Lyrics Don't Display:
1. Check file path matches album.ts
2. Verify LRC format is correct
3. Check browser console for errors
4. Test with sample LRC file above

### If Sync is Off:
1. Verify timestamps in LRC are accurate
2. Check audio currentTime is updating
3. Test with simpler LRC file
4. Adjust sync offset if needed

### If Panel Doesn't Appear:
1. Check toggle button is visible
2. Verify CSS animations not disabled
3. Test z-index stacking
4. Check mobile viewport

---

## Performance Tips

- Parse LRC files once on load (cache)
- Use CSS transforms for animations (GPU accelerated)
- Debounce scroll events
- Lazy render lyrics lines (render visible only)
- Use React.memo for LyricLine components

---

**Ready to start?** Begin with `phase-4a-lrc-parser.md`

---

# Phase 4 Breakdown

| Sub-Phase | Time | Complexity | Key Deliverable |
|-----------|------|------------|-----------------|
| 4A | 45min | Simple | LRC parser + utilities |
| 4B | 1.5hr | Moderate | Display components |
| 4C | 1hr | Moderate | Sync & auto-scroll |

**Total:** 3-4 hours for complete lyrics system

---

Good luck! 🎵📝
