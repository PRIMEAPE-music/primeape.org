import React, { useRef, useEffect } from 'react';
import type { Track } from '@/types';
import TracklistItem from './TracklistItem';
import './Tracklist.css';

interface TracklistProps {
  tracks: Track[];
  currentTrackId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  onTrackSelect: (trackId: number) => void;
}

/**
 * Tracklist Component
 * 
 * Scrollable list of all tracks in the album.
 * Displays on the LEFT side of the player (desktop).
 * Auto-scrolls to keep current track visible.
 * Click any track to play it.
 */
const Tracklist: React.FC<TracklistProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  isLoading,
  onTrackSelect,
}) => {
  const tracklistRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current track when it changes
  useEffect(() => {
    if (!currentTrackId) return;

    const tracklist = tracklistRef.current;
    const currentTrackElement = tracklist?.querySelector('.tracklist-item--current') as HTMLElement;

    if (tracklist && currentTrackElement) {
      // Scroll current track into view (centered if possible)
      currentTrackElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTrackId]);

  return (
    <div ref={tracklistRef} className="tracklist">
      {/* Header */}
      <div className="tracklist__header">
        <h3 className="tracklist__title">Tracklist</h3>
        <span className="tracklist__count">{tracks.length} tracks</span>
      </div>

      {/* Track List */}
      <div className="tracklist__content">
        {tracks.length === 0 ? (
          <div className="tracklist__empty">
            <p>No tracks available</p>
          </div>
        ) : (
          tracks.map((track) => (
            <TracklistItem
              key={track.id}
              track={track}
              isCurrentTrack={track.id === currentTrackId}
              isPlaying={isPlaying}
              isLoading={isLoading && track.id === currentTrackId}
              onClick={() => onTrackSelect(track.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Tracklist;