# PHASE 3 OVERVIEW: ADVANCED PLAYER FEATURES

## Phase Structure

Phase 3 is broken into 6 sub-phases that can be completed sequentially. Each sub-phase is independent and builds on Phase 2.

### Recommended Order:

1. **Phase 3A: Volume Control** ⏱️ 45min | 🔧 Simple
   - Volume slider with mute toggle
   - Volume persistence (localStorage)
   - Visual feedback

2. **Phase 3B: Shuffle & Repeat Modes** ⏱️ 1hr | 🔧 Moderate  
   - Shuffle toggle with randomization
   - Repeat modes (off → all → one)
   - State persistence

3. **Phase 3C: Waveform Progress Bar** ⏱️ 1.5hr | 🔧 Complex
   - Replace simple progress bar with waveform visualization
   - Generate waveform data from audio
   - Interactive seeking on waveform

4. **Phase 3D: Visual Equalizer Overlay** ⏱️ 1.5hr | 🔧 Complex
   - Canvas-based frequency visualization  
   - Real-time audio analysis
   - Semi-transparent overlay on artwork
   - Toggle on/off option

5. **Phase 3E: Vocal/Instrumental Toggle UI** ⏱️ 30min | 🔧 Simple
   - Add UI button for version toggle
   - Visual indicator of current version
   - Seamless switching (logic already exists from Phase 2)

6. **Phase 3F: Keyboard Shortcuts** ⏱️ 45min | 🔧 Simple
   - Space: play/pause
   - Arrow keys: seek, skip tracks
   - Volume up/down keys
   - Keyboard shortcut overlay (optional)

### Total Estimated Time: 5-6 hours

---

## Dependencies

- ✅ **Phase 1:** Project foundation, types, styles
- ✅ **Phase 2:** Audio player hook, basic controls

---

## What You'll Need

### For Waveform (Phase 3C):
- At least 1 real MP3 file uploaded to test waveform generation
- Or use pre-generated waveform data (I'll provide sample data structure)

### For Equalizer (Phase 3D):
- Real audio files for frequency analysis
- Modern browser (Chrome/Firefox/Safari - all support Web Audio API)

### For Testing:
- Multiple tracks uploaded for shuffle/repeat testing
- Keyboard for shortcut testing

---

## File Structure After Phase 3

```
src/
├── hooks/
│   ├── useAudioPlayer.ts (MODIFIED - add shuffle/repeat)
│   ├── useAudioTime.ts (existing)
│   ├── useWaveform.ts (NEW)
│   ├── useEqualizer.ts (NEW)
│   └── useKeyboardShortcuts.ts (NEW)
├── components/
│   ├── Player/
│   │   ├── Player.tsx (MODIFIED - add new controls)
│   │   ├── VolumeControl.tsx (NEW)
│   │   ├── VolumeControl.css (NEW)
│   │   ├── ShuffleButton.tsx (NEW)
│   │   ├── ShuffleButton.css (NEW)
│   │   ├── RepeatButton.tsx (NEW)
│   │   ├── RepeatButton.css (NEW)
│   │   ├── VersionToggle.tsx (NEW)
│   │   ├── VersionToggle.css (NEW)
│   │   ├── WaveformBar.tsx (NEW - replaces ProgressBar)
│   │   ├── WaveformBar.css (NEW)
│   │   ├── Equalizer.tsx (NEW)
│   │   ├── Equalizer.css (NEW)
│   │   ├── Artwork.tsx (MODIFIED - add equalizer)
│   │   └── [existing components...]
└── utils/
    ├── formatTime.ts (existing)
    ├── generateWaveform.ts (NEW)
    └── shuffleArray.ts (NEW)
```

---

## How to Use These Instructions

### Option 1: Sequential Completion (Recommended)
Complete each sub-phase in order:
1. Read `phase-3a-volume-control.md`
2. Copy the Claude Code prompt
3. Run Claude Code with the prompt
4. Test and verify
5. Move to `phase-3b-shuffle-repeat.md`
6. Repeat until Phase 3F complete

### Option 2: Parallel Development (Advanced)
Some sub-phases are independent and can be done in parallel:
- 3A (Volume) + 3B (Shuffle/Repeat) can be done together
- 3C (Waveform) and 3D (Equalizer) are separate visualizations
- 3E (Version toggle) and 3F (Keyboard) are independent UI additions

### Option 3: Skip Sub-Phases
If you want to skip any sub-phase:
- **Skip 3C (Waveform):** Keep simple progress bar from Phase 2
- **Skip 3D (Equalizer):** Keep static artwork  
- **Skip 3F (Keyboard):** Mouse/touch only
- **Don't skip 3A, 3B, or 3E:** These are core features

---

## Claude Code Prompt Template

For each sub-phase, use this prompt structure:

```
I'm working on Phase 3[X] of the PRIMEAPE music website.

Please read and implement the instructions in: phase-3[x]-[name].md

Context:
- Phase 1 (foundation) is complete
- Phase 2 (basic player) is complete  
- Working directory: /path/to/primeape-foundation
- All TypeScript, React patterns established

Requirements:
- Follow all instructions exactly as written
- Maintain existing code style and patterns
- Test thoroughly before marking complete
- No placeholder code - full implementation only

Let me know when you're ready and I'll provide the instruction file.
```

---

## Validation After Phase 3

Once all sub-phases complete, verify:

### Functionality:
- [ ] Volume slider works, persists across sessions
- [ ] Mute toggle works
- [ ] Shuffle randomizes track order correctly
- [ ] Repeat modes cycle correctly (off → all → one)
- [ ] Waveform displays and is clickable for seeking
- [ ] Equalizer animates with audio frequencies
- [ ] Equalizer can be toggled on/off
- [ ] Vocal/instrumental toggle switches seamlessly
- [ ] All keyboard shortcuts work

### Visual:
- [ ] New controls fit cohesively with Phase 2 design
- [ ] Waveform looks clean and professional
- [ ] Equalizer overlay doesn't obscure artwork too much
- [ ] Mobile responsive (all controls accessible)

### Technical:
- [ ] TypeScript compiles with no errors
- [ ] No console errors or warnings
- [ ] No performance issues (60fps animations)
- [ ] localStorage working for all preferences

### Cross-browser:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

---

## Troubleshooting

### If Claude Code gets stuck:
1. Check that it has read the instruction file
2. Verify Phase 2 is complete and working
3. Try running one sub-phase at a time
4. Check for missing dependencies

### If features don't work:
1. Verify audio files are uploaded
2. Check browser console for errors
3. Ensure Web Audio API is supported (all modern browsers)
4. Test with different audio files

### If waveform generation is slow:
1. Use pre-generated waveform data (I'll provide structure)
2. Generate waveforms server-side
3. Use lower resolution waveforms (fewer data points)

---

## After Phase 3

Once Phase 3 is complete:
- ✅ Player has all advanced audio features
- ✅ Visual feedback (waveform, equalizer)
- ✅ Full user control (volume, shuffle, repeat, version)
- ✅ Keyboard accessible

**Next:** Phase 4 - Lyrics System (3-state display, LRC parsing, auto-scroll)

---

## Questions?

If any instruction file is unclear:
1. Check the "Known Pitfalls" section in that file
2. Review Phase 2 implementation for patterns
3. Check the TypeScript types in `src/types/index.ts`

---

**Ready to start?** Begin with `phase-3a-volume-control.md`
