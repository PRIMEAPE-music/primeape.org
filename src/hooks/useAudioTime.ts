import { useState, useEffect, useRef } from 'react';

/**
 * useAudioTime Hook
 * 
 * Tracks audio currentTime with high-frequency updates using requestAnimationFrame.
 * More accurate than relying solely on 'timeupdate' events (which fire ~4x per second).
 * 
 * @param audioElement - HTMLAudioElement to track
 * @param isPlaying - Whether audio is currently playing
 * @returns Current time in seconds
 */
export function useAudioTime(
  audioElement: HTMLAudioElement | null,
  isPlaying: boolean
): number {
  const [currentTime, setCurrentTime] = useState(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement || !isPlaying) {
      // Cancel animation frame if not playing
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    // Update time on every frame while playing
    const updateTime = () => {
      if (audioElement && !audioElement.paused) {
        setCurrentTime(audioElement.currentTime);
        rafIdRef.current = requestAnimationFrame(updateTime);
      }
    };

    rafIdRef.current = requestAnimationFrame(updateTime);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [audioElement, isPlaying]);

  return currentTime;
}