import React from 'react';
import { FOUNDATION_ALBUM } from '@/data/album';
import Equalizer from './Equalizer';
import './Artwork.css';

interface ArtworkProps {
  isPlaying: boolean;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
  showEqualizer: boolean;
}

/**
 * Artwork Component
 * 
 * Displays album artwork with subtle animation when playing.
 * 
 * Phase 2: Simple artwork display
 * Phase 3: Will add visual equalizer overlay
 * 
 * @param isPlaying - Whether audio is currently playing
 */
const Artwork: React.FC<ArtworkProps> = ({ 
  isPlaying,
  audioContext,
  sourceNode,
  showEqualizer
}) => {
  return (
    <div className={`artwork ${isPlaying ? 'artwork--playing' : ''}`}>
      <div className="artwork__container">
        <img
          src={FOUNDATION_ALBUM.artworkUrl}
          alt={`${FOUNDATION_ALBUM.title} album cover`}
          className="artwork__image"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.classList.add('artwork__container--no-image');
          }}
        />
        
        {/* Equalizer Overlay */}
        <Equalizer
          audioContext={audioContext}
          sourceNode={sourceNode}
          isPlaying={isPlaying}
          isVisible={showEqualizer}
        />
      </div>
    </div>
  );
};

export default Artwork;