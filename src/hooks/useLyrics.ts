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
    // Default to 'panel' for better UX (panel always visible on desktop)
    return (saved as LyricsDisplayState) || 'panel';
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
      console.log('🎵 useLyrics: Starting fetch for URL:', lyricsUrl);
      setIsLoading(true);
      setError(null);

      try {
        const parsed = await loadLRC(lyricsUrl);
        console.log('🎵 useLyrics: Loaded lyrics:', {
          linesCount: parsed.lines.length,
          hasMetadata: !!parsed.metadata,
          firstLine: parsed.lines[0]
        });
        
        if (!cancelled) {
          setLyrics(parsed);
          setIsLoading(false);
          console.log('🎵 useLyrics: State updated, lyrics set');
        }
      } catch (err) {
        if (!cancelled) {
          console.error('❌ useLyrics: Failed to load lyrics:', err);
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

  // Toggle display state
  // Desktop (≥1100px): panel → integrated → panel (no hidden state)
  // Mobile (<1100px): hidden → panel → integrated → hidden
  const toggleDisplayState = () => {
    setDisplayState(prev => {
      let next: LyricsDisplayState;
      
      // Check if we're on desktop or mobile
      const isDesktop = window.innerWidth >= 1100;
      
      if (isDesktop) {
        // Desktop: toggle between panel and integrated (no hidden)
        if (prev === 'panel') {
          next = 'integrated';
        } else {
          next = 'panel';
        }
      } else {
        // Mobile: cycle through all three states
        if (prev === 'hidden') {
          next = 'panel';
        } else if (prev === 'panel') {
          next = 'integrated';
        } else {
          next = 'hidden';
        }
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