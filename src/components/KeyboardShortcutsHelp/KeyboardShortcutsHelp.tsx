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