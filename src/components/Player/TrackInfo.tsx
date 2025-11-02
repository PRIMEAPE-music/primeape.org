import React from 'react';
import type { Track, Album } from '@/types';
import './TrackInfo.css';

interface TrackInfoProps {
  track: Track | null;
  album: Album | null;
  trackIndex: number;
  error: string | null;
}

/**
 * TrackInfo Component
 * 
 * Displays current track information (title, artist, track number).
 * Shows error message if track fails to load.
 * 
 * @param track - Current track object
 * @param album - Current album object (for artist info)
 * @param trackIndex - Zero-based track index (for display as Track N)
 * @param error - Error message if any
 */
const TrackInfo: React.FC<TrackInfoProps> = ({ track, album, trackIndex, error }) => {
  if (error) {
    return (
      <div className="track-info track-info--error">
        <p className="track-info__error-message">{error}</p>
        <p className="track-info__error-hint">Please try selecting another track</p>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="track-info">
        <p className="track-info__title">No track selected</p>
      </div>
    );
  }

  return (
    <div className="track-info">
      <p className="track-info__track-number">
        Track {trackIndex + 1}
      </p>
      <h2 className="track-info__title">{track.title}</h2>
      <p className="track-info__artist">{album?.artist || 'Unknown Artist'}</p>
    </div>
  );
};

export default TrackInfo;