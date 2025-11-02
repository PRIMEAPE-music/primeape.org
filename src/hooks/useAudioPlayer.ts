import { useState, useRef, useEffect, useCallback } from 'react';
import type { PlaybackState, AudioVersion, RepeatMode } from '@/types';
import { getTrackById, getNextTrackId, getPreviousTrackId, FOUNDATION_ALBUM } from '@/data/album';
import { shuffleArray, getNextShuffledItem, getPreviousShuffledItem } from '@/utils/shuffleArray';

interface UseAudioPlayerReturn {
  // State
  currentTrackId: number | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  audioVersion: AudioVersion;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
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
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  
  // Refs
  audioRef: React.RefObject<HTMLAudioElement>;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
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
  const [volume, setVolumeState] = useState(0.7); // Default 70%
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const shuffledQueueRef = useRef<number[]>([]);

  // ========== REFS ==========
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<MediaElementAudioSourceNode | null>(null);

  // ========== LOAD PREFERENCES FROM LOCALSTORAGE ==========
  useEffect(() => {
    const savedVolume = localStorage.getItem('primeape_volume');
    const savedMuted = localStorage.getItem('primeape_muted');
    const savedShuffle = localStorage.getItem('primeape_shuffle');
    const savedRepeat = localStorage.getItem('primeape_repeat');
    
    if (savedVolume) {
      const vol = parseFloat(savedVolume);
      if (!isNaN(vol) && vol >= 0 && vol <= 1) {
        setVolumeState(vol);
        previousVolumeRef.current = vol;
      }
    }
    
    if (savedMuted === 'true') {
      setIsMuted(true);
    }

    if (savedShuffle === 'true') {
      setIsShuffled(true);
      // Initialize shuffled queue
      const allTrackIds = FOUNDATION_ALBUM.tracks.map(t => t.id);
      shuffledQueueRef.current = shuffleArray(allTrackIds);
    }

    if (savedRepeat && (savedRepeat === 'off' || savedRepeat === 'all' || savedRepeat === 'one')) {
      setRepeatMode(savedRepeat as RepeatMode);
    }
  }, []);

  // ========== APPLY VOLUME TO AUDIO ELEMENT ==========
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ========== INITIALIZE AUDIO CONTEXT (for equalizer) ==========
  useEffect(() => {
    // Create AudioContext on mount
    if (!audioContextRef.current) {
      const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = ctx;
      setAudioContext(ctx);
    }

    // Connect audio element to context when ref is available
    if (audioRef.current && audioContextRef.current && !sourceNodeRef.current) {
      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      source.connect(audioContextRef.current.destination);
      sourceNodeRef.current = source;
      setSourceNode(source);
    }

    return () => {
      // Keep AudioContext alive for entire session
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
    
    let nextId: number;

    if (isShuffled) {
      // Get next from shuffled queue
      const allTrackIds = FOUNDATION_ALBUM.tracks.map(t => t.id);
      const { nextItem, newQueue } = getNextShuffledItem(
        currentTrackId,
        allTrackIds,
        shuffledQueueRef.current
      );
      shuffledQueueRef.current = newQueue;
      nextId = nextItem;
    } else {
      // Normal sequential order
      nextId = getNextTrackId(currentTrackId);
    }

    loadTrack(nextId);
    
    // Auto-play next track if currently playing
    if (playbackState === 'playing') {
      setTimeout(() => play(), 100);
    }
  }, [currentTrackId, playbackState, isShuffled, loadTrack, play]);

  // ========== PREVIOUS TRACK ==========
  const prevTrack = useCallback(() => {
    if (currentTrackId === null) return;

    const audio = audioRef.current;
    
    // If more than 3 seconds into song, restart current track
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    let prevId: number;

    if (isShuffled) {
      // Get previous from shuffled queue
      prevId = getPreviousShuffledItem(currentTrackId, shuffledQueueRef.current);
    } else {
      // Normal sequential order
      prevId = getPreviousTrackId(currentTrackId);
    }

    loadTrack(prevId);
    
    // Auto-play previous track if currently playing
    if (playbackState === 'playing') {
      setTimeout(() => play(), 100);
    }
  }, [currentTrackId, playbackState, isShuffled, loadTrack, play]);

  // ========== SEEK ==========
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(time)) return;

    // Clamp time to valid range
    const clampedTime = Math.max(0, Math.min(time, audio.duration || 0));
    audio.currentTime = clampedTime;
    setCurrentTime(clampedTime);
  }, []);

  // ========== SET VOLUME ==========
  const setVolume = useCallback((newVolume: number) => {
    // Clamp volume between 0 and 1
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    setVolumeState(clampedVolume);
    previousVolumeRef.current = clampedVolume;
    
    // Save to localStorage
    localStorage.setItem('primeape_volume', clampedVolume.toString());
    
    // Unmute if volume is changed while muted
    if (isMuted && clampedVolume > 0) {
      setIsMuted(false);
      localStorage.setItem('primeape_muted', 'false');
    }
  }, [isMuted]);

  // ========== TOGGLE SHUFFLE ==========
  const toggleShuffle = useCallback(() => {
    const newShuffleState = !isShuffled;
    setIsShuffled(newShuffleState);
    
    // Save to localStorage
    localStorage.setItem('primeape_shuffle', newShuffleState.toString());
    
    if (newShuffleState) {
      // Create shuffled queue when enabling shuffle
      const allTrackIds = FOUNDATION_ALBUM.tracks.map(t => t.id);
      shuffledQueueRef.current = shuffleArray(allTrackIds);
    } else {
      // Clear shuffle queue when disabling
      shuffledQueueRef.current = [];
    }
  }, [isShuffled]);

  // ========== TOGGLE REPEAT ==========
  const toggleRepeat = useCallback(() => {
    // Cycle through: off → all → one → off
    let newRepeatMode: RepeatMode;
    
    if (repeatMode === 'off') {
      newRepeatMode = 'all';
    } else if (repeatMode === 'all') {
      newRepeatMode = 'one';
    } else {
      newRepeatMode = 'off';
    }
    
    setRepeatMode(newRepeatMode);
    
    // Save to localStorage
    localStorage.setItem('primeape_repeat', newRepeatMode);
  }, [repeatMode]);

  // ========== TOGGLE MUTE ==========
  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Save to localStorage
    localStorage.setItem('primeape_muted', newMutedState.toString());
    
    // If unmuting and volume is 0, restore previous volume
    if (!newMutedState && volume === 0) {
      const restoreVolume = previousVolumeRef.current > 0 ? previousVolumeRef.current : 0.7;
      setVolumeState(restoreVolume);
      localStorage.setItem('primeape_volume', restoreVolume.toString());
    }
  }, [isMuted, volume]);

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
      if (repeatMode === 'one') {
        // Repeat current track
        if (audio) {
          audio.currentTime = 0;
          play();
        }
      } else if (repeatMode === 'all' || repeatMode === 'off') {
        // Advance to next track (will loop with 'all', stop at end with 'off')
        setPlaybackState('paused');
        
        // Check if we're at the last track with repeat off
        if (repeatMode === 'off' && !isShuffled) {
          const isLastTrack = currentTrackId === FOUNDATION_ALBUM.tracks[FOUNDATION_ALBUM.tracks.length - 1].id;
          if (isLastTrack) {
            // Don't auto-advance, stop playback
            return;
          }
        }
        
        nextTrack();
      }
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
  }, [nextTrack, playbackState, repeatMode, isShuffled, currentTrackId, play]);

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
    volume,
    isMuted,
    isShuffled,
    repeatMode,
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
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    
    // Refs
    audioRef,
    audioContext,
    sourceNode,
  };
}