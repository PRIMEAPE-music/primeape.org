import React from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { getTrackById, FOUNDATION_ALBUM } from '@/data/album';
import Artwork from './Artwork';
import TrackInfo from './TrackInfo';
import TimeDisplay from './TimeDisplay';
import ProgressBar from './ProgressBar';
import Controls from './Controls';
import './Player.css';

/**
 * Player Component
 * 
 * Main music player component that orchestrates all player sub-components.
 * Manages audio playback state via useAudioPlayer hook.
 * 
 * Phase 2: Basic playback with simple progress bar
 * Phase 3: Will add waveform, equalizer, volume, shuffle, repeat
 * Phase 4: Will add lyrics integration
 */
const Player: React.FC = () => {
  const {
    currentTrackId,
    playbackState,
    currentTime,
    duration,
    error,
    togglePlayPause,
    nextTrack,
    prevTrack,
    seek,
    audioRef,
  } = useAudioPlayer();

  // Get current track data
  const currentTrack = currentTrackId ? getTrackById(currentTrackId) || null : null;
  const trackIndex = currentTrack ? FOUNDATION_ALBUM.tracks.findIndex(track => track.id === currentTrack.id) : 0;
  const isPlaying = playbackState === 'playing';

  return (
    <div className="player">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Album Artwork */}
      <Artwork isPlaying={isPlaying} />

      {/* Track Information */}
      <TrackInfo 
        track={currentTrack} 
        album={FOUNDATION_ALBUM}
        trackIndex={trackIndex}
        error={error} 
      />

      {/* Time Display */}
      <TimeDisplay currentTime={currentTime} duration={duration} />

      {/* Progress Bar */}
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={seek}
      />

      {/* Playback Controls */}
      <Controls
        playbackState={playbackState}
        onPlayPause={togglePlayPause}
        onPrevious={prevTrack}
        onNext={nextTrack}
      />

      {/* Placeholder for additional controls (Phase 3) */}
      {/* Volume, Shuffle, Repeat, Vocal/Instrumental toggle will go here */}
    </div>
  );
};

export default Player;