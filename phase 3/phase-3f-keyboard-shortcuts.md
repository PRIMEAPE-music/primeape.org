# PHASE 3F: KEYBOARD SHORTCUTS

## Claude Code Prompt

```
I'm implementing Phase 3F (Keyboard Shortcuts) for the PRIMEAPE music website.

Please implement:
1. Keyboard shortcuts for player controls
2. Custom hook for keyboard event handling
3. Visual shortcut reference (optional overlay)

Context:
- All player controls are functional
- Need to add keyboard navigation
- Space, arrows, volume keys, etc.

This adds keyboard accessibility to the player.
```

---

## Overview

**Sub-Phase:** 3F  
**Feature:** Keyboard Shortcuts  
**Complexity:** Simple  
**Time Estimate:** 45 minutes

**What Will Be Built:**
- Global keyboard shortcut handler
- Common shortcuts (play/pause, seek, volume, skip)
- Visual shortcut helper (optional)

**Shortcuts to Implement:**
- `Space` - Play/Pause
- `→` (Right Arrow) - Skip forward 10s
- `←` (Left Arrow) - Skip backward 10s
- `↑` (Up Arrow) - Volume up 5%
- `↓` (Down Arrow) - Volume down 5%
- `N` - Next track
- `P` - Previous track
- `M` - Mute/Unmute
- `S` - Toggle shuffle
- `R` - Cycle repeat mode
- `?` - Show shortcuts help (optional)

---

## Files to Create

```
src/hooks/useKeyboardShortcuts.ts
src/components/KeyboardShortcutsHelp/KeyboardShortcutsHelp.tsx (optional)
src/components/KeyboardShortcutsHelp/KeyboardShortcutsHelp.css (optional)
```

## Files to Modify

```
src/components/Player/Player.tsx (integrate useKeyboardShortcuts)
```

---

## Implementation Instructions

### File: `src/hooks/useKeyboardShortcuts.ts`

**📁 CREATE NEW FILE:**

```typescript
import { useEffect } from 'react';

interface KeyboardShortcutsConfig {
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onVolumeUp: () => void;
  onVolumeDown: () => void;
  onMute: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  isEnabled?: boolean;
}

/**
 * useKeyboardShortcuts Hook
 * 
 * Attaches global keyboard event listeners for player controls.
 * 
 * Shortcuts:
 * - Space: Play/Pause
 * - Arrow Right: Skip forward 10s
 * - Arrow Left: Skip backward 10s
 * - Arrow Up: Volume up 5%
 * - Arrow Down: Volume down 5%
 * - N: Next track
 * - P: Previous track
 * - M: Mute toggle
 * - S: Shuffle toggle
 * - R: Repeat cycle
 * 
 * @param config - Keyboard shortcut handlers
 */
export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  const {
    onPlayPause,
    onNext,
    onPrevious,
    onSeekForward,
    onSeekBackward,
    onVolumeUp,
    onVolumeDown,
    onMute,
    onShuffle,
    onRepeat,
    isEnabled = true,
  } = config;

  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Check for modifier keys (Ctrl, Alt, Cmd) - ignore these combinations
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onPlayPause();
          break;

        case 'ArrowRight':
          e.preventDefault();
          onSeekForward();
          break;

        case 'ArrowLeft':
          e.preventDefault();
          onSeekBackward();
          break;

        case 'ArrowUp':
          e.preventDefault();
          onVolumeUp();
          break;

        case 'ArrowDown':
          e.preventDefault();
          onVolumeDown();
          break;

        case 'KeyN':
          e.preventDefault();
          onNext();
          break;

        case 'KeyP':
          e.preventDefault();
          onPrevious();
          break;

        case 'KeyM':
          e.preventDefault();
          onMute();
          break;

        case 'KeyS':
          e.preventDefault();
          onShuffle();
          break;

        case 'KeyR':
          e.preventDefault();
          onRepeat();
          break;

        default:
          // No action for other keys
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    onPlayPause,
    onNext,
    onPrevious,
    onSeekForward,
    onSeekBackward,
    onVolumeUp,
    onVolumeDown,
    onMute,
    onShuffle,
    onRepeat,
    isEnabled,
  ]);
}
```

---

### File: `src/components/Player/Player.tsx`

**🔍 FIND:**
```typescript
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
```

**✏️ REPLACE WITH:**
```typescript
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
```

**🔍 FIND (right after the useAudioPlayer hook call):**
```typescript
  const {
    currentTrackId,
    playbackState,
    currentTime,
    duration,
    audioVersion,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    error,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleVersion,
    audioRef,
    audioContext,
    sourceNode,
  } = useAudioPlayer();

  // Get current track data
  const currentTrack = currentTrackId ? getTrackById(currentTrackId) : null;
  const isPlaying = playbackState === 'playing';
```

**➕ ADD AFTER:**
```typescript
  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: togglePlayPause,
    onNext: nextTrack,
    onPrevious: prevTrack,
    onSeekForward: () => {
      // Skip forward 10 seconds
      const newTime = Math.min(currentTime + 10, duration);
      seek(newTime);
    },
    onSeekBackward: () => {
      // Skip backward 10 seconds
      const newTime = Math.max(currentTime - 10, 0);
      seek(newTime);
    },
    onVolumeUp: () => {
      // Increase volume by 5%
      const newVolume = Math.min(volume + 0.05, 1);
      setVolume(newVolume);
    },
    onVolumeDown: () => {
      // Decrease volume by 5%
      const newVolume = Math.max(volume - 0.05, 0);
      setVolume(newVolume);
    },
    onMute: toggleMute,
    onShuffle: toggleShuffle,
    onRepeat: toggleRepeat,
    isEnabled: true,
  });
```

---

## Optional: Keyboard Shortcuts Help Overlay

### File: `src/components/KeyboardShortcutsHelp/KeyboardShortcutsHelp.tsx`

**📁 CREATE NEW FILE (OPTIONAL):**

```typescript
import React, { useState, useEffect } from 'react';
import './KeyboardShortcutsHelp.css';

/**
 * KeyboardShortcutsHelp Component
 * 
 * Shows overlay with keyboard shortcut reference.
 * Triggered by pressing "?" key.
 */
const KeyboardShortcutsHelp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show/hide with "?" key
      if (e.key === '?' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setIsVisible(prev => !prev);
      }

      // Hide with Escape key
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="keyboard-shortcuts-help"
      onClick={() => setIsVisible(false)}
    >
      <div 
        className="keyboard-shortcuts-help__content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="keyboard-shortcuts-help__title">
          Keyboard Shortcuts
        </h2>

        <div className="keyboard-shortcuts-help__grid">
          <div className="keyboard-shortcuts-help__section">
            <h3>Playback</h3>
            <div className="keyboard-shortcuts-help__item">
              <kbd>Space</kbd>
              <span>Play / Pause</span>
            </div>
            <div className="keyboard-shortcuts-help__item">
              <kbd>N</kbd>
              <span>Next track</span>
            </div>
            <div className="keyboard-shortcuts-help__item">
              <kbd>P</kbd>
              <span>Previous track</span>
            </div>
          </div>

          <div className="keyboard-shortcuts-help__section">
            <h3>Seek</h3>
            <div className="keyboard-shortcuts-help__item">
              <kbd>→</kbd>
              <span>Forward 10s</span>
            </div>
            <div className="keyboard-shortcuts-help__item">
              <kbd>←</kbd>
              <span>Backward 10s</span>
            </div>
          </div>

          <div className="keyboard-shortcuts-help__section">
            <h3>Volume</h3>
            <div className="keyboard-shortcuts-help__item">
              <kbd>↑</kbd>
              <span>Volume up</span>
            </div>
            <div className="keyboard-shortcuts-help__item">
              <kbd>↓</kbd>
              <span>Volume down</span>
            </div>
            <div className="keyboard-shortcuts-help__item">
              <kbd>M</kbd>
              <span>Mute / Unmute</span>
            </div>
          </div>

          <div className="keyboard-shortcuts-help__section">
            <h3>Modes</h3>
            <div className="keyboard-shortcuts-help__item">
              <kbd>S</kbd>
              <span>Toggle shuffle</span>
            </div>
            <div className="keyboard-shortcuts-help__item">
              <kbd>R</kbd>
              <span>Cycle repeat</span>
            </div>
          </div>
        </div>

        <p className="keyboard-shortcuts-help__footer">
          Press <kbd>?</kbd> to toggle this help or <kbd>Esc</kbd> to close
        </p>
      </div>
    </div>
  );
};

export default KeyboardShortcutsHelp;
```

---

### File: `src/components/KeyboardShortcutsHelp/KeyboardShortcutsHelp.css`

**📁 CREATE NEW FILE (OPTIONAL):**

```css
.keyboard-shortcuts-help {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-md);
  animation: fade-in var(--transition-normal);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.keyboard-shortcuts-help__content {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.keyboard-shortcuts-help__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-lg);
  text-align: center;
}

.keyboard-shortcuts-help__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.keyboard-shortcuts-help__section h3 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-sm);
}

.keyboard-shortcuts-help__item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.keyboard-shortcuts-help__item kbd {
  min-width: 60px;
  padding: var(--space-xs) var(--space-sm);
  background-color: var(--color-border);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-sm);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-align: center;
  box-shadow: 0 2px 0 var(--color-accent);
}

.keyboard-shortcuts-help__item span {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.keyboard-shortcuts-help__footer {
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.keyboard-shortcuts-help__footer kbd {
  padding: var(--space-xs);
  background-color: var(--color-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .keyboard-shortcuts-help__content {
    padding: var(--space-lg);
  }

  .keyboard-shortcuts-help__grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
}
```

---

### To Add Shortcuts Help to Player (Optional):

**🔍 FIND in `src/components/Player/Player.tsx`:**
```typescript
import VersionToggle from './VersionToggle';
```

**✏️ REPLACE WITH:**
```typescript
import VersionToggle from './VersionToggle';
import KeyboardShortcutsHelp from '../KeyboardShortcutsHelp/KeyboardShortcutsHelp';
```

**🔍 FIND (at the very end of Player return, just before closing `</div>`):**
```typescript
    </div>
  );
};
```

**✏️ REPLACE WITH:**
```typescript
      {/* Keyboard Shortcuts Help Overlay */}
      <KeyboardShortcutsHelp />
    </div>
  );
};
```

---

## Validation Checklist

### Keyboard Shortcuts:
- [ ] Space: Play/pause works
- [ ] Right arrow: Skips forward 10s
- [ ] Left arrow: Skips backward 10s
- [ ] Up arrow: Increases volume
- [ ] Down arrow: Decreases volume
- [ ] N: Next track
- [ ] P: Previous track
- [ ] M: Mute toggle
- [ ] S: Shuffle toggle
- [ ] R: Repeat cycle
- [ ] Shortcuts don't fire when typing in input fields
- [ ] Shortcuts don't conflict with browser shortcuts

### Help Overlay (if implemented):
- [ ] ? key shows/hides help overlay
- [ ] Escape key closes help
- [ ] Click outside closes help
- [ ] All shortcuts listed
- [ ] Mobile responsive

## Testing

1. **Basic Shortcuts:**
   - Press Space - should play/pause
   - Press N - should skip to next track
   - Press P - should go to previous

2. **Seek Shortcuts:**
   - Start playing
   - Press → five times
   - Should be ~50s into track

3. **Volume Shortcuts:**
   - Press ↑ repeatedly
   - Volume should increase
   - Press ↓
   - Volume should decrease

4. **Input Field Test:**
   - Focus on any input/textarea on page (if any)
   - Press Space
   - Should NOT trigger play/pause

5. **Help Overlay:**
   - Press ?
   - Help should appear
   - Press Escape
   - Help should close

## Known Pitfalls

1. **Browser Conflicts:**
   - Space scrolls page by default - we prevent this
   - Ctrl+shortcuts reserved for browser - we ignore these

2. **Input Focus:**
   - Always check if user is typing before handling
   - Check for contentEditable elements

3. **Rapid Key Presses:**
   - Callbacks should handle rapid firing gracefully
   - Volume/seek should clamp to valid ranges

## Completion Criteria

- ✅ All keyboard shortcuts functional
- ✅ No conflicts with browser shortcuts
- ✅ Shortcuts ignored in input fields
- ✅ Help overlay working (if implemented)
- ✅ No console errors

**Congratulations!** Phase 3 is now complete.

---

# END OF PHASE 3F INSTRUCTIONS

## Phase 3 Complete!

You've now implemented:
- ✅ Phase 3A: Volume Control
- ✅ Phase 3B: Shuffle & Repeat
- ✅ Phase 3C: Waveform Progress Bar
- ✅ Phase 3D: Visual Equalizer
- ✅ Phase 3E: Vocal/Instrumental Toggle
- ✅ Phase 3F: Keyboard Shortcuts

**Next Steps:**
- Test all features together
- Verify Phase 3 completion checklist (see phase-3-overview.md)
- Proceed to Phase 4: Lyrics System

**Your music player now has:**
- Advanced audio controls (volume, shuffle, repeat)
- Visual feedback (waveform, equalizer)
- Seamless version switching
- Full keyboard accessibility

Great work! 🎵
