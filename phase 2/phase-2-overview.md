# PHASE 2: CORE AUDIO PLAYER - OVERVIEW

## Purpose
This document provides the overview and execution order for Phase 2. Phase 2 is broken into 4 sub-parts for easier implementation and validation.

## Phase 2 Goals
- Complete audio playback engine using Web Audio API + HTMLAudioElement
- Custom React hook (`useAudioPlayer`) for audio state management
- Player component with artwork display
- Basic playback controls (play/pause, previous, next)
- Time display and seekable progress bar
- Track info display and navigation
- Audio preloading and error handling

## Estimated Complexity
**Moderate** - 3-4 hours total

## Dependencies
✅ Phase 1 complete - Project foundation, layout, types, album data

## Execution Order

Complete these sub-parts in order:

### Part 2A: Utilities & Time Tracking Hook
**File:** `phase-2a-utilities-time.md`
- Time formatting utilities
- useAudioTime hook for smooth time tracking
- Foundation for time display

**Estimated Time:** 30 minutes

### Part 2B: Core Audio Player Hook
**File:** `phase-2b-audio-hook.md`
- Main useAudioPlayer hook
- Audio element management
- Web Audio API context setup
- Playback control methods
- Event handling and state management

**Estimated Time:** 90 minutes

### Part 2C: Player UI Components
**File:** `phase-2c-player-components.md`
- Artwork component
- TrackInfo component
- TimeDisplay component
- ProgressBar component (seekable)
- Controls component (play/pause/prev/next)
- Component-specific styles

**Estimated Time:** 60 minutes

### Part 2D: Integration & Validation
**File:** `phase-2d-integration.md`
- Main Player component (combines all subcomponents)
- PlayerSection wrapper
- App.tsx integration
- Comprehensive testing and validation

**Estimated Time:** 30 minutes

## Success Criteria

After completing all 4 parts:
- ✅ Audio plays and pauses correctly
- ✅ Track navigation works (prev/next)
- ✅ Progress bar is seekable (click/drag)
- ✅ Time display is accurate
- ✅ Auto-advance to next track
- ✅ Error handling functional
- ✅ Responsive on all devices
- ✅ No TypeScript errors
- ✅ No console errors during normal use

## Architecture Overview

### Audio Implementation
```
HTMLAudioElement (playback)
    ↓
MediaElementSourceNode (bridge)
    ↓
AnalyserNode (Phase 3 - waveform/equalizer)
    ↓
AudioContext.destination (speakers)
```

### Component Hierarchy
```
PlayerSection (wrapper)
└── Player (main container)
    ├── Artwork (album cover)
    ├── TrackInfo (title, artist, track number)
    ├── TimeDisplay (current / duration)
    ├── ProgressBar (seekable timeline)
    └── Controls (play/pause/prev/next)
```

### State Management
```
useAudioPlayer hook
    ↓ (state + actions)
Player component
    ↓ (props + callbacks)
Child components
    ↓ (user interactions)
useAudioPlayer actions
    ↓ (updates)
Audio element + state
```

## What's New in Phase 2

**New Concepts:**
- Web Audio API integration
- HTMLAudioElement control
- RequestAnimationFrame for smooth time tracking
- Custom React hooks with complex state
- Audio event handling
- Seeking and scrubbing
- Track preloading

**New Files:** 14 new files total
- 2 utility/hook files
- 12 component/style files

**Modified Files:** 1 file
- `src/App.tsx` - add PlayerSection

## Testing Requirements

Phase 2 requires actual audio files for proper testing:
- **Minimum:** 1 MP3 file to test basic playback
- **Recommended:** 2-3 MP3 files to test navigation
- **Location:** `public/music/instrumental/`
- **Naming:** `01-A-GOOD-DAY-instrumental.mp3`, etc.

Without audio files, you can still build everything, but playback testing will show errors (expected).

## Key Differences from Phase 1

**Phase 1:**
- Static components
- No state management
- No user interaction
- Pure TypeScript/CSS

**Phase 2:**
- Dynamic audio playback
- Complex state management
- Heavy user interaction
- Browser APIs (Web Audio)
- Event listeners
- Performance considerations

## Common Challenges in Phase 2

1. **Audio Context Lifecycle** - Must handle suspended state
2. **Event Listener Cleanup** - Memory leaks if not careful
3. **Seek Precision** - Touch vs mouse events
4. **Race Conditions** - Rapid track changes
5. **Error States** - Missing files, network issues
6. **Browser Autoplay Policies** - May need user interaction first

All challenges are addressed in the instruction files.

## Next Steps After Phase 2

Once Phase 2 is complete and validated:
- Phase 3: Advanced Player Features (waveform, equalizer, volume, shuffle, repeat)
- Phase 4: Lyrics System
- Phase 5: Tracklist & Navigation

## File Locations

All Phase 2 instruction files:
- `phase-2a-utilities-time.md`
- `phase-2b-audio-hook.md`
- `phase-2c-player-components.md`
- `phase-2d-integration.md`

Work through them in order - each part builds on the previous.

## Important Notes

⚠️ **Audio Files Required for Testing**
You need real MP3 files to fully test Phase 2. Without them, you'll see errors (expected behavior).

⚠️ **No Volume Control Yet**
Volume control comes in Phase 3. Phase 2 uses default volume.

⚠️ **No Waveform Yet**
Phase 2 uses simple progress bar. Waveform visualization comes in Phase 3.

⚠️ **Keyboard Shortcuts Not Implemented**
Keyboard controls (spacebar, arrow keys) come in Phase 3.

Let's build a music player! 🎵
