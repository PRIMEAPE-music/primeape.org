import React from 'react';
import type { LyricsDisplayState } from '@/types';
import './LyricsToggle.css';

interface LyricsToggleProps {
  displayState: LyricsDisplayState;
  hasLyrics: boolean;
  onToggle: () => void;
}

/**
 * LyricsToggle Component
 * 
 * Button to toggle between lyrics display states
 * Shows current state with visual indicator
 */
const LyricsToggle: React.FC<LyricsToggleProps> = ({
  displayState,
  hasLyrics,
  onToggle,
}) => {
  const getTitle = () => {
    if (!hasLyrics) return 'No lyrics available';
    if (displayState === 'hidden') return 'Show lyrics panel';
    if (displayState === 'panel') return 'Show integrated lyrics';
    return 'Hide lyrics';
  };

  return (
    <button
      className={`lyrics-toggle ${displayState !== 'hidden' ? 'lyrics-toggle--active' : ''}`}
      onClick={onToggle}
      disabled={!hasLyrics}
      aria-label={getTitle()}
      title={getTitle()}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
      
      {/* State indicator dots */}
      <span className="lyrics-toggle__indicator">
        {displayState === 'panel' && <span className="lyrics-toggle__dot" />}
        {displayState === 'integrated' && (
          <>
            <span className="lyrics-toggle__dot" />
            <span className="lyrics-toggle__dot" />
          </>
        )}
      </span>
    </button>
  );
};

export default LyricsToggle;