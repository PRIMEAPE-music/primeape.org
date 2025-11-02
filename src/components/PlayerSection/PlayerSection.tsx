import React from 'react';
import Player from '../Player/Player';
import './PlayerSection.css';

/**
 * PlayerSection Component
 * 
 * Full-viewport section wrapper for the music player.
 * Provides background styling and vertical centering.
 */
const PlayerSection: React.FC = () => {
  return (
    <section className="player-section">
      <div className="player-section__container">
        <Player />
      </div>
    </section>
  );
};

export default PlayerSection;