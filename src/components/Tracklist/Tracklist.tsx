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

  // Track if this is the initial mount
  const hasScrolledRef = useRef(false);

  // Track if user has clicked a track (to enable auto-scroll)
  const userHasClickedRef = React.useRef(false);
  const previousTrackIdRef = React.useRef<number | null>(null);

  // Mark that user clicked when onTrackSelect is called
  const handleTrackClick = (trackId: number) => {
    userHasClickedRef.current = true;
    onTrackSelect(trackId);
  };

  // Auto-scroll to current track when it changes
  useEffect(() => {
    if (!currentTrackId) return;

    const tracklistContent = tracklistRef.current?.querySelector('.tracklist__content') as HTMLElement;
    const currentTrackElement = tracklistContent?.querySelector('.tracklist-item--current') as HTMLElement;

    if (tracklistContent && currentTrackElement) {
      // Calculate scroll position to center the element within the container
      const containerRect = tracklistContent.getBoundingClientRect();
      const elementRect = currentTrackElement.getBoundingClientRect();
      
      // Calculate how much to scroll to center the element
      const scrollTop = tracklistContent.scrollTop;
      const elementOffsetFromContainer = elementRect.top - containerRect.top;
      const targetScroll = scrollTop + elementOffsetFromContainer - (containerRect.height / 2) + (elementRect.height / 2);
      
      // On first scroll (when track is first selected), don't animate
      if (!hasScrolledRef.current) {
        hasScrolledRef.current = true;
        // Instant scroll without animation on first load
        tracklistContent.scrollTop = targetScroll;
      } else {
        // Subsequent scrolls are smooth
        tracklistContent.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
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