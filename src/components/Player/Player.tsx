import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { getTrackById, FOUNDATION_ALBUM } from '@/data/album';
import Artwork from './Artwork';
import TrackInfo from './TrackInfo';
import TimeDisplay from './TimeDisplay';
import WaveformBar from './WaveformBar';
import Controls from './Controls';
import VolumeControl from './VolumeControl';
import ShuffleButton from './ShuffleButton';
import RepeatButton from './RepeatButton';
import EqualizerToggle from './EqualizerToggle';
import VersionToggle from './VersionToggle';
import LyricsToggle from '../Lyrics/LyricsToggle';
import LyricsPanel from '../Lyrics/LyricsPanel';
import LyricsBox from '../Lyrics/LyricsBox';
import Tracklist from '../Tracklist/Tracklist';
import { useLyrics } from '@/hooks/useLyrics';
import KeyboardShortcutsHelp from '../KeyboardShortcutsHelp/KeyboardShortcutsHelp';
import './Player.css';

interface PlayerProps {
  onStateChange?: (state: {
    currentTrackId: number | null;
    isPlaying: boolean;
    isLoading: boolean;
  }) => void;
  trackSelectHandlerRef?: React.MutableRefObject<((trackId: number) => void) | null>;
}

/**
 * Player Component
 * 
 * Main music player component that orchestrates all player sub-components.
 * Manages audio playback state via useAudioPlayer hook.
 * Exposes player state to parent for mobile tracklist integration.
 * 
 * Phase 2: Basic playback with simple progress bar
 * Phase 3: Will add waveform, equalizer, volume, shuffle, repeat
 * Phase 4: Will add lyrics integration
 * Mobile Enhancement: Shares state with external components
 */
const Player: React.FC<PlayerProps> = ({
  onStateChange,
  trackSelectHandlerRef,
}) => {
  // Equalizer state
  const [showEqualizer, setShowEqualizer] = useState(() => {
    const saved = localStorage.getItem('primeape_equalizer');
    return saved === 'true';
  });

  // Save equalizer preference
  useEffect(() => {
    localStorage.setItem('primeape_equalizer', showEqualizer.toString());
  }, [showEqualizer]);

  const toggleEqualizer = () => setShowEqualizer(prev => !prev);
  const {
    currentTrackId,
    playbackState,
    currentTime,
    duration,
    audioVersion,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    error,
    togglePlayPause,
    loadTrack,
    nextTrack,
    prevTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleVersion,
    audioRef,
    audioContext,
    sourceNode,
  } = useAudioPlayer();

  // Get current track data
  const currentTrack = currentTrackId ? getTrackById(currentTrackId) || null : null;
  const trackIndex = currentTrack ? FOUNDATION_ALBUM.tracks.findIndex(track => track.id === currentTrack.id) : 0;
  const isPlaying = playbackState === 'playing';

  // Notify parent of player state changes (for mobile tracklist)
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        currentTrackId,
        isPlaying: playbackState === 'playing',
        isLoading: playbackState === 'loading',
      });
    }
  }, [currentTrackId, playbackState, onStateChange]);

  // Note: External track selection now handled via trackSelectHandlerRef
  // No additional effect needed - the ref is set in the effect above

  // Lyrics
  const {
    lyrics,
    displayState: lyricsDisplayState,
    toggleDisplayState: toggleLyrics,
  } = useLyrics(currentTrack?.lyricsFile || null);

  // DEBUG: Log lyrics state whenever it changes
  useEffect(() => {
    console.log('🎵 Player Component State:', {
      trackId: currentTrackId,
      trackTitle: currentTrack?.title,
      lyricsFile: currentTrack?.lyricsFile,
      hasLyrics: !!lyrics,
      linesCount: lyrics?.lines?.length || 0,
      displayState: lyricsDisplayState,
      shouldShowPanel: !!(lyrics && lyricsDisplayState === 'panel'),
      shouldShowBox: !!(lyrics && lyricsDisplayState === 'integrated'),
    });
  }, [lyrics, lyricsDisplayState, currentTrack, currentTrackId]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: togglePlayPause,
    onNext: nextTrack,
    onPrevious: prevTrack,
    onSeekForward: () => {
      // Skip forward 10 seconds
      const newTime = Math.min(currentTime + 10, duration);
      seek(newTime);
    },
    onSeekBackward: () => {
      // Skip backward 10 seconds
      const newTime = Math.max(currentTime - 10, 0);
      seek(newTime);
    },
    onVolumeUp: () => {
      // Increase volume by 5%
      const newVolume = Math.min(volume + 0.05, 1);
      setVolume(newVolume);
    },
    onVolumeDown: () => {
      // Decrease volume by 5%
      const newVolume = Math.max(volume - 0.05, 0);
      setVolume(newVolume);
    },
    onMute: toggleMute,
    onShuffle: toggleShuffle,
    onRepeat: toggleRepeat,
    isEnabled: true,
  });

  // Handle track selection from tracklist
  const handleTrackSelect = React.useCallback((trackId: number) => {
    // If clicking the same track that's already loaded
    if (trackId === currentTrackId) {
      // Toggle play/pause
      togglePlayPause();
    } else {
      // Load and play new track
      loadTrack(trackId);
      // Auto-play immediately after load starts
      // The loadTrack sets state to 'loading', which will transition to 'paused' when ready
      // We'll play as soon as it's ready via the effect below
    }
  }, [currentTrackId, togglePlayPause, loadTrack]);

  // Auto-play when a new track finishes loading (for tracklist selections)
  const previousTrackIdRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    // When track changes and becomes ready to play
    if (
      currentTrackId !== null &&
      currentTrackId !== previousTrackIdRef.current &&
      playbackState === 'paused' &&
      previousTrackIdRef.current !== null // Don't auto-play on initial load
    ) {
      // New track loaded and ready - auto-play it
      togglePlayPause();
    }
    
    // Update the ref
    if (currentTrackId !== previousTrackIdRef.current) {
      previousTrackIdRef.current = currentTrackId;
    }
  }, [currentTrackId, playbackState, togglePlayPause]);

  // Expose track selection handler to parent via ref
  React.useEffect(() => {
    if (trackSelectHandlerRef) {
      trackSelectHandlerRef.current = handleTrackSelect;
    }
  }, [handleTrackSelect, trackSelectHandlerRef]);

  return (
    <div className="player">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
        {/* Tracklist (LEFT side, desktop only) */}
        <div className="player__floating-box player__floating-box--tracklist">
          <Tracklist
            tracks={FOUNDATION_ALBUM.tracks}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            isLoading={playbackState === 'loading'}
            onTrackSelect={handleTrackSelect}
          />
        </div>

        {/* Center Column - Artwork + Track Info + Time + Waveform */}
        <div className="player__center-column">
          {/* Album Title Above Artwork */}
          <h3 className="player__album-title">{FOUNDATION_ALBUM.title}</h3>
          
          {/* Album Artwork with Equalizer */}
          <Artwork 
            isPlaying={isPlaying}
            audioContext={audioContext}
            sourceNode={sourceNode}
            showEqualizer={showEqualizer}
          />

          {/* Track Information */}
          <TrackInfo 
            track={currentTrack} 
            album={FOUNDATION_ALBUM}
            trackIndex={trackIndex}
            error={error} 
          />

          {/* Integrated Lyrics Box (appears between track info and time) */}
          {lyrics && (
            <LyricsBox
              lines={lyrics.lines}
              currentTime={currentTime}
              isPlaying={isPlaying}
              isVisible={lyricsDisplayState === 'integrated'}
            />
          )}

          {/* Time Display */}
          <TimeDisplay currentTime={currentTime} duration={duration} />

          {/* Waveform Progress Bar */}
          <WaveformBar
            audioUrl={currentTrack ? (audioVersion === 'vocal' && currentTrack.hasVocals ? currentTrack.vocalFile : currentTrack.instrumentalFile) : null}
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
          />
        </div>

        {/* Floating Lyrics Box (Desktop ≥1100px) - Always visible when lyrics exist */}
        {lyrics && (
          <div className="player__floating-box player__floating-box--lyrics">
            <LyricsPanel
              lines={lyrics.lines}
              currentTime={currentTime}
              isPlaying={isPlaying}
              isVisible={true}
              onClose={toggleLyrics}
              onLineClick={(time) => seek(time)}
              isMobile={false}
            />
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <Controls
        playbackState={playbackState}
        onPlayPause={togglePlayPause}
        onPrevious={prevTrack}
        onNext={nextTrack}
      />

      {/* Version Toggle (Vocal/Instrumental) */}
      <div className="player__version-row">
        <VersionToggle
          currentVersion={audioVersion}
          onToggle={toggleVersion}
        />
      </div>

      {/* Secondary Controls Row */}
      <div className="player__secondary-controls">
        {/* Shuffle Button */}
        <ShuffleButton
          isShuffled={isShuffled}
          onToggle={toggleShuffle}
        />

        {/* Equalizer Toggle */}
        <EqualizerToggle
          isActive={showEqualizer}
          onToggle={toggleEqualizer}
        />

        {/* Lyrics Toggle */}
        <LyricsToggle
          displayState={lyricsDisplayState}
          hasLyrics={!!lyrics}
          onToggle={toggleLyrics}
        />

        {/* Volume Control */}
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onMuteToggle={toggleMute}
        />

        {/* Repeat Button */}
        <RepeatButton
          repeatMode={repeatMode}
          onToggle={toggleRepeat}
        />
      </div>

      {/* Mobile/Tablet Lyrics Panel (< 1100px) */}
      <div className="player__mobile-lyrics-panel">
        {lyrics && lyricsDisplayState === 'panel' && (
          <LyricsPanel
            lines={lyrics.lines}
            currentTime={currentTime}
            isPlaying={isPlaying}
            isVisible={true}
            onClose={toggleLyrics}
            onLineClick={(time) => seek(time)}
            isMobile={true}
            onPlayPause={togglePlayPause}
            onPrevious={prevTrack}
            onNext={nextTrack}
            playbackState={playbackState}
          />
        )}
      </div>

      {/* Keyboard Shortcuts Help Overlay */}
      <KeyboardShortcutsHelp />
    </div>
  );
};

export default Player;