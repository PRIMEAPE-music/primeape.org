import { useState, useEffect } from 'react';
import { loadLRC, ParsedLRC } from '@/utils/lrcParser';
import type { LyricsDisplayState } from '@/types';

interface UseLyricsReturn {
  lyrics: ParsedLRC | null;
  isLoading: boolean;
  error: string | null;
  displayState: LyricsDisplayState;
  toggleDisplayState: () => void;
}

/**
 * useLyrics Hook
 * 
 * Manages lyrics loading and display state
 * 
 * @param lyricsUrl - URL to LRC file
 * @returns Lyrics data and display state management
 */
export function useLyrics(lyricsUrl: string | null): UseLyricsReturn {
  const [lyrics, setLyrics] = useState<ParsedLRC | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load display state from localStorage
  const [displayState, setDisplayState] = useState<LyricsDisplayState>(() => {
    const saved = localStorage.getItem('primeape_lyrics_display');
    return (saved as LyricsDisplayState) || 'hidden';
  });

  // Load lyrics when URL changes
  useEffect(() => {
    if (!lyricsUrl) {
      setLyrics(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchLyrics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const parsed = await loadLRC(lyricsUrl);
        
        if (!cancelled) {
          setLyrics(parsed);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load lyrics:', err);
          setError('Failed to load lyrics');
          setIsLoading(false);
        }
      }
    };

    fetchLyrics();

    return () => {
      cancelled = true;
    };
  }, [lyricsUrl]);

  // Toggle display state: hidden → panel → integrated → hidden
  const toggleDisplayState = () => {
    setDisplayState(prev => {
      let next: LyricsDisplayState;
      
      if (prev === 'hidden') {
        next = 'panel';
      } else if (prev === 'panel') {
        next = 'integrated';
      } else {
        next = 'hidden';
      }

      // Save to localStorage
      localStorage.setItem('primeape_lyrics_display', next);
      
      return next;
    });
  };

  return {
    lyrics,
    isLoading,
    error,
    displayState,
    toggleDisplayState,
  };
}