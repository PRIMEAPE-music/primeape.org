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

  // Track if user has clicked a track (to enable auto-scroll)
  const userHasClickedRef = React.useRef(false);
  const previousTrackIdRef = React.useRef<number | null>(null);

  // Mark that user clicked when onTrackSelect is called
  const handleTrackClick = (trackId: number) => {
    userHasClickedRef.current = true;
    onTrackSelect(trackId);
  };

  // Auto-scroll to current track when it changes (only after user interaction)
  useEffect(() => {
    if (!currentTrackId) return;

    // Detect if this is a user-initiated track change (not initial load)
    const isUserChange = previousTrackIdRef.current !== null && 
                         currentTrackId !== previousTrackIdRef.current;
    
    // Update ref for next comparison
    previousTrackIdRef.current = currentTrackId;

    // Only scroll if user has clicked a track OR if this is a subsequent track change
    if (!userHasClickedRef.current && !isUserChange) {
      return; // Skip scroll on initial page load
    }

    const tracklist = tracklistRef.current;
    const currentTrackElement = tracklist?.querySelector('.tracklist-item--current') as HTMLElement;

    if (tracklist && currentTrackElement) {
      // Scroll current track into view
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
              onClick={() => handleTrackClick(track.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Tracklist;