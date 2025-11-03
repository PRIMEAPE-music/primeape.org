import { useState, useEffect, useRef } from 'react';
import type { LyricLine } from '@/types';
import { getCurrentLineIndex, getUpcomingLineIndex } from '@/utils/lrcParser';

interface UseLyricsSyncReturn {
  currentLineIndex: number;
  upcomingLineIndex: number;
  isAutoScrollEnabled: boolean;
  setAutoScrollEnabled: (enabled: boolean) => void;
}

/**
 * useLyricsSync Hook
 * 
 * Manages lyrics synchronization and auto-scroll behavior
 * 
 * @param lines - Array of lyric lines
 * @param currentTime - Current playback time
 * @param isPlaying - Whether audio is playing
 * @returns Current line index and auto-scroll state
 */
export function useLyricsSync(
  lines: LyricLine[],
  currentTime: number,
  _isPlaying: boolean
): UseLyricsSyncReturn {
  const [isAutoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const previousLineRef = useRef(-1);
  const userScrollTimerRef = useRef<number | null>(null);

  // Get current and upcoming line indices
  const currentLineIndex = getCurrentLineIndex(lines, currentTime);
  const upcomingLineIndex = getUpcomingLineIndex(lines, currentTime);

  // Re-enable auto-scroll when line changes and enough time has passed
  useEffect(() => {
    if (currentLineIndex !== previousLineRef.current) {
      previousLineRef.current = currentLineIndex;
      
      // Re-enable auto-scroll on line change
      // This allows user to manually scroll but auto-scroll resumes at next line
      if (userScrollTimerRef.current) {
        window.clearTimeout(userScrollTimerRef.current);
        userScrollTimerRef.current = null;
      }
      
      setAutoScrollEnabled(true);
    }
  }, [currentLineIndex]);

  // Disable auto-scroll when user manually scrolls (exported for external use)
  // const handleUserScroll = () => {
  //   setAutoScrollEnabled(false);
  //   
  //   // Re-enable auto-scroll after 3 seconds of no user scroll
  //   if (userScrollTimerRef.current) {
  //     window.clearTimeout(userScrollTimerRef.current);
  //   }
  //   
  //   userScrollTimerRef.current = window.setTimeout(() => {
  //     setAutoScrollEnabled(true);
  //   }, 3000);
  // };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (userScrollTimerRef.current) {
        window.clearTimeout(userScrollTimerRef.current);
      }
    };
  }, []);

  return {
    currentLineIndex,
    upcomingLineIndex,
    isAutoScrollEnabled,
    setAutoScrollEnabled: (enabled: boolean) => {
      setAutoScrollEnabled(enabled);
      if (userScrollTimerRef.current) {
        window.clearTimeout(userScrollTimerRef.current);
        userScrollTimerRef.current = null;
      }
    },
  };
}

/**
 * Smooth scroll element into view within its container
 * Scrolls ONLY the container, not the entire page viewport
 * 
 * @param element - Element to scroll into view
 * @param container - Container element that will be scrolled
 */
export function smoothScrollToElement(
  element: HTMLElement,
  container?: HTMLElement | null
) {
  // If no container provided, find the closest scrollable parent
  const scrollContainer = container || element.closest('.lyrics-panel__content, .lyrics-box') as HTMLElement;
  
  if (!scrollContainer) {
    console.warn('No scroll container found for lyrics auto-scroll');
    return;
  }

  // Calculate the element's position relative to the container
  const containerRect = scrollContainer.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  
  // Calculate the offset needed to center the element in the container
  const containerCenter = containerRect.height / 2;
  const elementCenter = elementRect.height / 2;
  const scrollOffset = elementRect.top - containerRect.top - containerCenter + elementCenter;
  
  // Get current scroll position
  const currentScroll = scrollContainer.scrollTop;
  const targetScroll = currentScroll + scrollOffset;

  // Smooth scroll within the container only
  scrollContainer.scrollTo({
    top: targetScroll,
    behavior: 'smooth'
  });
}