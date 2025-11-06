import React from 'react';
import Player from '../Player/Player';
import './PlayerSection.css';

interface PlayerSectionProps {
  onPlayerStateChange: (state: {
    currentTrackId: number | null;
    isPlaying: boolean;
    isLoading: boolean;
  }) => void;
  onTrackSelectFromExternal: (trackId: number) => void;
}

/**
 * PlayerSection Component
 * 
 * Full-viewport section wrapper for the music player.
 * Provides background styling and vertical centering.
 */
const PlayerSection: React.FC<PlayerSectionProps> = ({
  onPlayerStateChange,
  onTrackSelectFromExternal,
}) => {
  return (
    <section className="player-section">
      <div className="player-section__container">
        <Player 
          onStateChange={onPlayerStateChange}
          onExternalTrackSelect={onTrackSelectFromExternal}
        />
      </div>
    </section>
  );
};

export default PlayerSection;