import { useState, useRef, useEffect, useCallback } from 'react';
import type { PlaybackState, AudioVersion } from '@/types';
import { getTrackById, getNextTrackId, getPreviousTrackId } from '@/data/album';

interface UseAudioPlayerReturn {
  // State
  currentTrackId: number | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  audioVersion: AudioVersion;
  error: string | null;
  
  // Actions
  play: () => Promise<void>;
  pause: () => void;
  togglePlayPause: () => void;
  loadTrack: (trackId: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (time: number) => void;
  toggleVersion: () => void;
  
  // Refs
  audioRef: React.RefObject<HTMLAudioElement>;
}

/**
 * useAudioPlayer Hook
 * 
 * Manages all audio playback logic for the music player.
 * Handles loading tracks, playback control, seeking, and error handling.
 * 
 * @returns Audio player state and control methods
 */
export function useAudioPlayer(): UseAudioPlayerReturn {
  // ========== STATE ==========
  const [currentTrackId, setCurrentTrackId] = useState<number | null>(1); // Start with first track
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioVersion, setAudioVersion] = useState<AudioVersion>('instrumental');
  const [error, setError] = useState<string | null>(null);

  // ========== REFS ==========
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  // ========== INITIALIZE AUDIO CONTEXT (for Phase 3 equalizer) ==========
  useEffect(() => {
    // Create AudioContext on mount (will be used in Phase 3)
    // Only create once per session
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }

    // Connect audio element to context when ref is available
    if (audioRef.current && audioContextRef.current && !sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceNodeRef.current.connect(audioContextRef.current.destination);
    }

    // Cleanup
    return () => {
      // Don't close AudioContext here - keep it alive for entire session
      // Will be used for equalizer in Phase 3
    };
  }, []);

  // ========== LOAD TRACK ==========
  const loadTrack = useCallback((trackId: number) => {
    const track = getTrackById(trackId);
    if (!track) {
      setError(`Track ${trackId} not found`);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    // Determine which file to load based on audioVersion and track.hasVocals
    const fileToLoad = audioVersion === 'vocal' && track.hasVocals
      ? track.vocalFile
      : track.instrumentalFile;

    setPlaybackState('loading');
    setError(null);
    setCurrentTrackId(trackId);

    // Set audio source
    audio.src = fileToLoad;
    audio.load();

    // Note: Don't call play() here - let user click play button
    // This prevents autoplay policy violations
  }, [audioVersion]);

  // ========== PLAY ==========
  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      // Resume AudioContext if suspended (browser autoplay policy)
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      await audio.play();
      setPlaybackState('playing');
      setError(null);
    } catch (err) {
      console.error('Playback error:', err);
      setError('Failed to play audio. Please try again.');
      setPlaybackState('paused');
    }
  }, []);

  // ========== PAUSE ==========
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setPlaybackState('paused');
  }, []);

  // ========== TOGGLE PLAY/PAUSE ==========
  const togglePlayPause = useCallback(() => {
    if (playbackState === 'playing') {
      pause();
    } else {
      play();
    }
  }, [playbackState, play, pause]);

  // ========== NEXT TRACK ==========
  const nextTrack = useCallback(() => {
    if (currentTrackId === null) return;
    
    const nextId = getNextTrackId(currentTrackId);
    loadTrack(nextId);
    
    // Auto-play next track if currently playing
    if (playbackState === 'playing') {
      // Small delay to ensure track loads
      setTimeout(() => play(), 100);
    }
  }, [currentTrackId, playbackState, loadTrack, play]);

  // ========== PREVIOUS TRACK ==========
  const prevTrack = useCallback(() => {
    if (currentTrackId === null) return;

    const audio = audioRef.current;
    
    // If more than 3 seconds into song, restart current track
    // Otherwise, go to previous track
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      const prevId = getPreviousTrackId(currentTrackId);
      loadTrack(prevId);
      
      // Auto-play previous track if currently playing
      if (playbackState === 'playing') {
        setTimeout(() => play(), 100);
      }
    }
  }, [currentTrackId, playbackState, loadTrack, play]);

  // ========== SEEK ==========
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(time)) return;

    // Clamp time to valid range
    const clampedTime = Math.max(0, Math.min(time, audio.duration || 0));
    audio.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  }, []);

  // ========== TOGGLE VERSION (Vocal/Instrumental) ==========
  const toggleVersion = useCallback(() => {
    const newVersion: AudioVersion = audioVersion === 'vocal' ? 'instrumental' : 'vocal';
    const audio = audioRef.current;
    const track = currentTrackId ? getTrackById(currentTrackId) : null;

    if (!audio || !track) return;

    // Save current playback state
    const wasPlaying = playbackState === 'playing';
    const savedTime = audio.currentTime;

    // Switch version
    setAudioVersion(newVersion);

    // Determine new file
    const newFile = newVersion === 'vocal' && track.hasVocals
      ? track.vocalFile
      : track.instrumentalFile;

    // Load new file
    audio.src = newFile;
    audio.load();

    // Restore playback position after metadata loads
    const restorePlayback = () => {
      audio.currentTime = savedTime;
      if (wasPlaying) {
        play();
      }
      audio.removeEventListener('loadedmetadata', restorePlayback);
    };

    audio.addEventListener('loadedmetadata', restorePlayback);
  }, [audioVersion, currentTrackId, playbackState, play]);

  // ========== AUDIO EVENT LISTENERS ==========
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Time update (fallback - main time tracking in useAudioTime)
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // Duration loaded
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setPlaybackState('paused'); // Ready to play
    };

    // Playback can start
    const handleCanPlay = () => {
      if (playbackState === 'loading') {
        setPlaybackState('paused');
      }
    };

    // Track ended
    const handleEnded = () => {
      setPlaybackState('paused');
      // Auto-advance to next track
      nextTrack();
    };

    // Error handling
    const handleError = () => {
      console.error('Audio error:', audio.error);
      setError(audio.error?.message || 'Failed to load audio file');
      setPlaybackState('stopped');
    };

    // Attach listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Cleanup
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [nextTrack, playbackState]);

  // ========== LOAD FIRST TRACK ON MOUNT ==========
  useEffect(() => {
    // Load initial track only once on mount
    const initialTrackId = 1;
    const track = getTrackById(initialTrackId);
    if (!track || !audioRef.current) return;
    
    // Determine which file to load based on initial audioVersion
    const fileToLoad = track.instrumentalFile; // Always start with instrumental
    
    setPlaybackState('loading');
    setError(null);
    setCurrentTrackId(initialTrackId);
    
    // Set audio source
    const audio = audioRef.current;
    audio.src = fileToLoad;
    audio.load();
    
    // Note: Don't call play() here - let user click play button
    // This prevents autoplay policy violations
  }, []); // Truly empty - runs once on mount with no external dependencies

  // ========== RETURN API ==========
  return {
    // State
    currentTrackId,
    playbackState,
    currentTime,
    duration,
    audioVersion,
    error,
    
    // Actions
    play,
    pause,
    togglePlayPause,
    loadTrack,
    nextTrack,
    prevTrack,
    seek,
    toggleVersion,
    
    // Refs
    audioRef,
  };
}