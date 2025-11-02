import React from 'react';
import type { PlaybackState } from '@/types';
import './Controls.css';

interface ControlsProps {
  playbackState: PlaybackState;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Controls Component
 * 
 * Playback control buttons (previous, play/pause, next).
 * Shows loading spinner when track is loading.
 * 
 * @param playbackState - Current playback state
 * @param onPlayPause - Play/pause toggle callback
 * @param onPrevious - Previous track callback
 * @param onNext - Next track callback
 */
const Controls: React.FC<ControlsProps> = ({
  playbackState,
  onPlayPause,
  onPrevious,
  onNext,
}) => {
  const isPlaying = playbackState === 'playing';
  const isLoading = playbackState === 'loading';

  return (
    <div className="controls">
      {/* Previous Button */}
      <button
        className="controls__button controls__button--secondary"
        onClick={onPrevious}
        disabled={isLoading}
        aria-label="Previous track"
        title="Previous track (or restart if > 3s)"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="19 20 9 12 19 4 19 20" />
          <line x1="5" y1="19" x2="5" y2="5" />
        </svg>
      </button>

      {/* Play/Pause Button */}
      <button
        className="controls__button controls__button--primary"
        onClick={onPlayPause}
        disabled={isLoading}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
      >
        {isLoading ? (
          <div className="spinner" />
        ) : isPlaying ? (
          // Pause Icon
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Play Icon
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="8 5 19 12 8 19 8 5" />
          </svg>
        )}
      </button>

      {/* Next Button */}
      <button
        className="controls__button controls__button--secondary"
        onClick={onNext}
        disabled={isLoading}
        aria-label="Next track"
        title="Next track"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="5 4 15 12 5 20 5 4" />
          <line x1="19" y1="5" x2="19" y2="19" />
        </svg>
      </button>
    </div>
  );
};

export default Controls;