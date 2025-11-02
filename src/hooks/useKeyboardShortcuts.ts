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