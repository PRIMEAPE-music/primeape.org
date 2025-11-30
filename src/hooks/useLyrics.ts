import { useState, useEffect, useRef } from 'react';
import { loadLRC, ParsedLRC } from '@/utils/lrcParser';
import type { LyricsDisplayState } from '@/types';
import { trackLyricsToggle } from '@/utils/analytics';

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
  const isInitialMount = useRef(true);

  // Load display state from localStorage
  const [displayState, setDisplayState] = useState<LyricsDisplayState>(() => {
    const saved = localStorage.getItem('primeape_lyrics_display');
    // Default to 'panel' on desktop, 'hidden' on mobile for better UX
    if (saved) return saved as LyricsDisplayState;
    return window.innerWidth >= 1100 ? 'panel' : 'hidden';
  });

  // Persist display state and track analytics when it changes (not on initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Save to localStorage
    try {
      localStorage.setItem('primeape_lyrics_display', displayState);
    } catch (e) {
      console.warn('Failed to save lyrics display state to localStorage:', e);
    }

    // Track analytics (wrapped in try-catch to prevent any errors from affecting UI)
    try {
      trackLyricsToggle({ new_state: displayState });
    } catch (e) {
      console.warn('Failed to track lyrics toggle:', e);
    }
  }, [displayState]);

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
      // Check if we're on desktop or mobile
      const isDesktop = window.innerWidth >= 1100;

      if (isDesktop) {
        // Desktop: toggle between panel and integrated (no hidden)
        return prev === 'panel' ? 'integrated' : 'panel';
      } else {
        // Mobile: cycle through all three states
        if (prev === 'hidden') return 'panel';
        if (prev === 'panel') return 'integrated';
        return 'hidden';
      }
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