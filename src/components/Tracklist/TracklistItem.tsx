import React from 'react';
import type { Track } from '@/types';
import { formatTime } from '@/utils/formatTime';
import './TracklistItem.css';

interface TracklistItemProps {
  track: Track;
  isCurrentTrack: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  onClick: () => void;
}

/**
 * TracklistItem Component
 * 
 * Individual track item in the tracklist.
 * Shows track number, title, and duration.
 * Highlights when it's the current track.
 * Shows play/pause icon for current track.
 */
const TracklistItem: React.FC<TracklistItemProps> = ({
  track,
  isCurrentTrack,
  isPlaying,
  isLoading,
  onClick,
}) => {
  return (
    <button
      className={`tracklist-item ${isCurrentTrack ? 'tracklist-item--current' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      disabled={isLoading}
      aria-label={`Play ${track.title}`}
      aria-current={isCurrentTrack ? 'true' : 'false'}
      tabIndex={0}
    >
      {/* Track Number or Play/Pause Icon */}
      <div className="tracklist-item__number">
        {isCurrentTrack ? (
          <div className="tracklist-item__icon">
            {isPlaying ? (
              // Pause icon (two bars)
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <rect x="1" y="1" width="3" height="10" />
                <rect x="8" y="1" width="3" height="10" />
              </svg>
            ) : (
              // Play icon (triangle)
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <polygon points="2,1 2,11 10,6" />
              </svg>
            )}
          </div>
        ) : (
          <span className="tracklist-item__track-number">{track.id}</span>
        )}
      </div>

      {/* Track Title */}
      <div className="tracklist-item__title">{track.title}</div>

      {/* Track Duration */}
      <div className="tracklist-item__duration">
        {formatTime(track.duration)}
      </div>
    </button>
  );
};

export default TracklistItem;