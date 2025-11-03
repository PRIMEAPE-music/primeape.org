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
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
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