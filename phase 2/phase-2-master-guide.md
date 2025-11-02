# PHASE 2: MASTER PROMPT GUIDE

This guide explains how to work with Claude Code throughout Phase 2 development.

## Overview

Phase 2 builds a fully functional music player. It's broken into 4 sub-parts (2A through 2D), each with its own instruction file and prompt.

## Workflow

```
Start → 2A → 2B → 2C → 2D → Validation → Complete!
         ↓     ↓     ↓     ↓
    30min 90min 60min 30min
```

## Before Starting Phase 2

✅ **Confirm Phase 1 is Complete:**
- Layout components working
- CSS theme system functional
- TypeScript compiling cleanly
- Dev server running

✅ **Review What We're Building:**
- Audio playback engine
- Interactive player controls
- Seekable progress bar
- Track navigation
- Time display
- Error handling

## Phase 2 Parts Breakdown

### Part 2A: Utilities & Time Tracking (30 minutes)
**File:** `prompt-2a-start.md`
- formatTime and parseTime functions
- useAudioTime custom hook
- Foundation for time display

**Simple** - Pure functions and basic hook

### Part 2B: Core Audio Player Hook (90 minutes)
**File:** `prompt-2b-start.md`
- Main useAudioPlayer hook
- HTMLAudioElement management
- Web Audio API context
- All playback logic
- Event handling

**Complex** - This is the brain of the player

### Part 2C: Player UI Components (60 minutes)
**File:** `prompt-2c-start.md`
- 5 visual components
- 5 CSS files
- Interactive controls
- Responsive design

**Moderate** - Visual implementation

### Part 2D: Integration & Validation (30 minutes)
**File:** `prompt-2d-integration.md`
- Main Player component
- PlayerSection wrapper
- App.tsx integration
- Comprehensive testing

**Simple** - Bringing it all together

## Prompt Files You'll Use

### Start Prompts (Use in Order)
1. **`prompt-2a-start.md`** - Start Part 2A
2. **`prompt-2b-start.md`** - Start Part 2B
3. **`prompt-2c-start.md`** - Start Part 2C
4. **`prompt-2d-start.md`** - Start Part 2D

## Estimated Total Time

- Part 2A: 30 minutes
- Part 2B: 90 minutes (most complex)
- Part 2C: 60 minutes
- Part 2D: 30 minutes + testing

**Total: 3-4 hours**

## How to Use This System

### Step 1: Start with Part 2A

Copy content from `prompt-2a-start.md` and paste into Claude Code.

**What Claude Code will do:**
- Read `phase-2a-utilities-time.md`
- Create formatTime.ts with utility functions
- Create useAudioTime.ts hook
- Report back with results

### Step 2: Review Results

Check:
- ✅ Both files created?
- ✅ TypeScript compiles?
- ✅ No errors?

### Step 3: Move to Part 2B

Use `prompt-2b-start.md` to start the audio hook.

**Important:** Part 2B is complex (~300 lines). Claude Code should:
- Take time to read instructions carefully
- Create the complete hook with all functions
- Implement proper event listener cleanup
- Use useCallback for all actions

### Step 4: Continue Through 2C and 2D

Follow the same pattern:
- Use the corresponding prompt file
- Let Claude Code complete the work
- Review results
- Move to next part

### Step 5: Comprehensive Validation (Part 2D)

Part 2D has 13 validation steps. Complete ALL of them:
1. TypeScript compilation
2. Dev server startup
3. Visual inspection
4. Basic playback testing
5. Seeking testing
6. Track navigation
7. Responsive design
8. Browser compatibility
9. Console checks
10. Performance checks
11. Accessibility checks
12. Error handling
13. Success criteria confirmation

## Key Differences from Phase 1

**Phase 1:**
- Static components
- Simple CSS
- No state management
- No user interaction

**Phase 2:**
- Dynamic audio playback
- Complex state management
- Heavy user interaction
- Browser APIs (Web Audio)
- Event listeners
- Memory management

## Common Challenges in Phase 2

### Challenge 1: Event Listener Memory Leaks
**Problem:** Forgetting to remove event listeners
**Solution:** Always return cleanup function from useEffect
**Check:** Look for paired addEventListener/removeEventListener

### Challenge 2: AudioContext Suspended
**Problem:** Browser blocks audio (autoplay policy)
**Solution:** Hook calls `audioContext.resume()` before playing
**Check:** Verify resume() called in play() function

### Challenge 3: Progress Bar Not Seeking
**Problem:** Duration is NaN before metadata loads
**Solution:** Hook listens for 'loadedmetadata' event
**Check:** Ensure duration > 0 before allowing seek

### Challenge 4: Previous Track Logic
**Problem:** Expected previous track but got restart
**Behavior:** If > 3 seconds, restarts. Otherwise goes to previous.
**This is intentional** - matches Spotify/Apple Music

### Challenge 5: Race Conditions on Track Change
**Problem:** Rapid clicking causes track confusion
**Solution:** Disable buttons during loading state
**Check:** Verify `disabled={isLoading}` on all buttons

## Audio Files for Testing

Phase 2 can be built without audio files, but for full testing you need:

**Minimum:** 1 MP3 file
- Location: `public/music/instrumental/01-A-GOOD-DAY-instrumental.mp3`
- Test basic playback

**Recommended:** 2-3 MP3 files
- Test track navigation
- Test auto-advance
- Test previous/next logic

**Ideal:** All 16 MP3 files
- Full testing of entire album

## Testing Without Audio Files

**Expected Behavior:**
- Player displays correctly
- Controls visible and functional
- Click play → error message appears
- Track navigation updates info
- Progress bar doesn't fill (no audio)

**This is normal!** Phase 2 is complete even without audio files.

## Testing With Audio Files

**Full Functionality:**
- Play/pause works
- Seeking works (click/drag progress bar)
- Track navigation works
- Auto-advance works
- Time display updates
- Artwork animates

## Quick Reference: Complexity by Part

| Part | Complexity | Time | Files Created |
|------|-----------|------|---------------|
| 2A | Simple | 30min | 2 files |
| 2B | Complex | 90min | 1 file (~300 lines) |
| 2C | Moderate | 60min | 10 files |
| 2D | Simple | 30min | 4 files + 1 modified |
| **Total** | **Moderate** | **3-4hrs** | **17 new + 1 modified** |

## Success Metrics

### After Each Part

**Part 2A:**
- ✅ Utility functions work correctly
- ✅ Hook uses requestAnimationFrame
- ✅ TypeScript compiles

**Part 2B:**
- ✅ Hook implements all functions
- ✅ Event listeners properly managed
- ✅ No memory leaks
- ✅ TypeScript compiles

**Part 2C:**
- ✅ All 5 components created
- ✅ All 5 CSS files created
- ✅ BEM naming used
- ✅ Responsive styles included
- ✅ TypeScript compiles

**Part 2D:**
- ✅ Player displays on page
- ✅ All components visible
- ✅ No console errors (except audio)
- ✅ Responsive on all devices
- ✅ All 13 validation steps passed

### Complete Phase 2

- ✅ `npm run dev` works
- ✅ Player displays correctly
- ✅ No TypeScript errors
- ✅ No console errors (except expected audio errors)
- ✅ Responsive design works
- ✅ With MP3s: full playback functionality
- ✅ Without MP3s: UI complete, graceful error handling

## Troubleshooting Guide

### Issue: TypeScript errors in Part 2B
**Check:**
- All imports use @ path alias
- All functions use useCallback
- All types imported from @/types
- Event listeners have cleanup

### Issue: Progress bar doesn't work
**Check:**
- onSeek prop passed to ProgressBar
- Both mouse and touch events handled
- Global listeners attached when dragging
- Cleanup function removes listeners

### Issue: Controls don't appear
**Check:**
- SVG code copied exactly
- Controls.tsx imports PlaybackState type
- Props passed correctly from Player

### Issue: Audio element not found
**Check:**
- `<audio ref={audioRef} />` in Player.tsx
- audioRef returned from useAudioPlayer
- preload="metadata" attribute present

### Issue: Memory leak warning
**Check:**
- All useEffect hooks have cleanup functions
- All event listeners removed in cleanup
- No orphaned setInterval or setTimeout

## Communication Tips

### For Part 2A (Simple)
```
"Create the time utilities and tracking hook per phase-2a-utilities-time.md"
```

### For Part 2B (Complex)
```
"This is complex - take your time. Create the complete useAudioPlayer hook 
with ALL functions, event listeners, and proper cleanup per 
phase-2b-audio-hook.md"
```

### For Part 2C (Moderate)
```
"Create all 5 player UI components with their CSS files per 
phase-2c-player-components.md. Remember: BEM naming, CSS variables, 
mobile responsive."
```

### For Part 2D (Integration)
```
"Final part! Create Player and PlayerSection, update App.tsx, then 
complete ALL 13 validation steps per phase-2d-integration.md. This is 
where we see everything work!"
```

## After Phase 2 is Complete

### Immediate Next Steps

1. **Test with Audio Files (if available)**
   - Add MP3s to `public/music/instrumental/`
   - Test full playback functionality
   - Verify auto-advance, seeking, navigation

2. **Commit to Git**
   ```bash
   git add .
   git commit -m "Complete Phase 2: Core Audio Player"
   git push
   ```

3. **Update Documentation**
   - Check off Phase 2 in README.md
   - Document any audio file requirements

### What You Have Now

✅ **Fully Functional Music Player**
- Play/pause control
- Track navigation (prev/next)
- Seekable progress bar
- Time display
- Auto-advance
- Error handling
- Responsive design

### What's Coming in Phase 3

Phase 3 will add advanced features:
- Waveform visualization (replaces simple progress bar)
- Visual equalizer (overlays on artwork)
- Volume control with slider
- Shuffle mode
- Repeat modes (off/all/one)
- Vocal/instrumental toggle button
- Keyboard shortcuts
- Additional animations

## Tips for Success

1. **Follow the Order** - Don't skip parts (2B depends on 2A, etc.)
2. **Read Instructions First** - Let Claude Code read the full instruction file
3. **Validate After Each Part** - Catch issues early
4. **TypeScript is Your Friend** - If it compiles, it usually works
5. **Test Responsive** - Use DevTools device toolbar
6. **Audio Files Optional** - Phase 2 is complete even without them
7. **Ask for Reports** - Request detailed feedback after each part

## You're Ready!

You have everything needed to build the music player:

- ✅ 4 instruction files (2A-2D)
- ✅ 4 start prompts (one for each part)
- ✅ This master guide
- ✅ Phase 1 foundation complete

Start with `prompt-2a-start.md` and build the player step by step!

Good luck! 🎵🚀
