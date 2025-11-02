# Phase 3 Instructions - Advanced Player Features

## Overview

This folder contains complete implementation instructions for Phase 3 of the PRIMEAPE music website, broken down into 6 manageable sub-phases.

## Files Included

### 📋 phase-3-overview.md
Start here! This file explains:
- Complete phase structure
- Recommended implementation order
- How to use these instruction files with Claude Code
- Dependencies and prerequisites
- Final validation checklist

### 🔊 phase-3a-volume-control.md
**Time:** ~45 minutes | **Complexity:** Simple
- Volume slider (0-100%)
- Mute/unmute button
- Volume persistence via localStorage
- Visual feedback (dynamic volume icons)

### 🔀 phase-3b-shuffle-repeat.md
**Time:** ~1 hour | **Complexity:** Moderate
- Shuffle mode with Fisher-Yates algorithm
- Repeat modes (off → all → one)
- Shuffle queue management
- State persistence

### 📊 phase-3c-waveform-progress.md
**Time:** ~1.5 hours | **Complexity:** Complex
- Replace simple progress bar with waveform visualization
- Real-time waveform generation from audio files
- Canvas-based rendering
- Interactive seeking on waveform

### 📈 phase-3d-visual-equalizer.md
**Time:** ~1.5 hours | **Complexity:** Complex
- Real-time frequency analysis
- Animated equalizer bars (20-30 bars)
- Semi-transparent overlay on album artwork
- Toggle to show/hide

### 🎤 phase-3e-vocal-toggle-ui.md
**Time:** ~30 minutes | **Complexity:** Simple
- UI button for vocal/instrumental switching
- Visual indicator of current version
- Integrates with existing Phase 2 logic

### ⌨️ phase-3f-keyboard-shortcuts.md
**Time:** ~45 minutes | **Complexity:** Simple
- Global keyboard shortcut handler
- Space, arrows, volume keys, etc.
- Optional visual keyboard help overlay

---

## How to Use These Files

### For Each Sub-Phase:

1. **Open the instruction file** (e.g., `phase-3a-volume-control.md`)

2. **Copy the Claude Code Prompt** from the top of the file

3. **Run Claude Code** with the prompt:
   ```bash
   claude-code
   ```
   
4. **Paste the prompt** and let Claude Code read the instruction file

5. **Test the implementation** using the validation checklist in the file

6. **Move to next sub-phase** once validated

### Recommended Order:

✅ **Sequential (Safest):**
- 3A → 3B → 3C → 3D → 3E → 3F

✅ **Parallel (Advanced):**
- 3A + 3B together (independent)
- 3E + 3F together (independent)
- 3C and 3D separately (both complex)

---

## Prerequisites

**Before Starting Phase 3:**
- ✅ Phase 1 complete (project foundation)
- ✅ Phase 2 complete (basic audio player)
- ✅ At least 1-2 audio files uploaded for testing
- ✅ Modern browser (Chrome, Firefox, Safari)

**Skills Needed:**
- Phase 3A, 3B, 3E, 3F: Simple (good for beginners)
- Phase 3C, 3D: Complex (requires understanding of Canvas API and Web Audio API)

---

## Total Time Estimate

- **Minimum (skip complex features):** ~2 hours (3A + 3B + 3E + 3F)
- **Full Phase 3:** ~5-6 hours (all sub-phases)
- **With testing and debugging:** ~7-8 hours

---

## Phase 3 Deliverables

After completing all sub-phases, you'll have:

✅ **Volume Control**
- Slider with mute button
- Persistent preferences
- Dynamic icons

✅ **Playback Modes**
- Shuffle randomization
- Three repeat modes
- State persistence

✅ **Visual Feedback**
- Waveform progress bar
- Animated frequency equalizer
- Professional UI

✅ **Version Control**
- Vocal/instrumental toggle
- Seamless switching
- Visual indicator

✅ **Accessibility**
- Full keyboard navigation
- Shortcut help overlay
- ARIA labels

---

## Troubleshooting

### If Claude Code Gets Stuck:
1. Check that Phase 2 is complete
2. Verify audio files are uploaded
3. Try smaller sub-phases first (3A, 3E, 3F)
4. Check browser console for errors

### If Features Don't Work:
1. Verify TypeScript compiles: `npm run build`
2. Check browser console for errors
3. Test with real audio files (not placeholders)
4. Verify Web Audio API support (all modern browsers)

### If Performance Issues:
- Waveform generation: Use lower sample count (50 instead of 100)
- Equalizer: Reduce bar count (16 instead of 24)
- Check for memory leaks in DevTools

---

## Testing Strategy

**After Each Sub-Phase:**
1. Run TypeScript compiler
2. Check browser console (no errors)
3. Test feature manually
4. Verify responsive design (mobile/tablet/desktop)

**After All Sub-Phases:**
1. Test all features together
2. Check feature interactions (shuffle + repeat, etc.)
3. Verify state persistence (refresh page)
4. Test keyboard shortcuts
5. Performance check (smooth 60fps)

---

## Next Steps After Phase 3

Once Phase 3 is complete and validated:

**Immediate Next Phase:**
- Phase 4: Lyrics System (3-state display, LRC parsing, auto-scroll)

**Future Phases:**
- Phase 5: Tracklist & Navigation
- Phase 6: Content Sections (about, media links, contact)
- Phase 7: Merch System
- Phase 8: Download & Donation
- Phase 9: Theme System
- Phase 10: Mobile Optimization
- Phase 11: Analytics
- Phase 12: Deployment

---

## Support

If you encounter issues:
1. Check the "Known Pitfalls" section in each instruction file
2. Review the validation checklist
3. Verify prerequisites are met
4. Check Phase 2 is working correctly

---

## File Structure After Phase 3

```
src/
├── hooks/
│   ├── useAudioPlayer.ts (MODIFIED)
│   ├── useAudioTime.ts
│   ├── useWaveform.ts (NEW)
│   ├── useEqualizer.ts (NEW)
│   └── useKeyboardShortcuts.ts (NEW)
├── components/
│   ├── Player/
│   │   ├── Player.tsx (MODIFIED)
│   │   ├── VolumeControl.tsx (NEW)
│   │   ├── ShuffleButton.tsx (NEW)
│   │   ├── RepeatButton.tsx (NEW)
│   │   ├── WaveformBar.tsx (NEW)
│   │   ├── Equalizer.tsx (NEW)
│   │   ├── EqualizerToggle.tsx (NEW)
│   │   ├── VersionToggle.tsx (NEW)
│   │   ├── Artwork.tsx (MODIFIED)
│   │   └── [CSS files for all above]
│   └── KeyboardShortcutsHelp/ (OPTIONAL)
└── utils/
    ├── generateWaveform.ts (NEW)
    └── shuffleArray.ts (NEW)
```

---

## Success Metrics

Phase 3 is successful when:
- ✅ All sub-phases validated
- ✅ No TypeScript errors
- ✅ No console warnings/errors
- ✅ All features work on desktop and mobile
- ✅ Smooth performance (60fps animations)
- ✅ State persists across page reloads
- ✅ Keyboard shortcuts functional

---

**Good luck with Phase 3!** 🎵

Start with `phase-3-overview.md` and then proceed to `phase-3a-volume-control.md`.
