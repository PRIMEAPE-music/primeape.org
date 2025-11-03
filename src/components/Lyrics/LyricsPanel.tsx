import React, { useRef, useEffect } from 'react';
import type { LyricLine as LyricLineType } from '@/types';
import { useLyricsSync, smoothScrollToElement } from '@/hooks/useLyricsSync';
import LyricLine from './LyricLine';
import './LyricsPanel.css';

interface LyricsPanelProps {
  lines: LyricLineType[];
  currentTime: number;
  isPlaying: boolean;
  isVisible: boolean;
  onClose: () => void;
  onLineClick?: (time: number) => void;
  isMobile: boolean;
  onPlayPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  playbackState?: 'playing' | 'paused' | 'loading' | 'stopped';
}

/**
 * LyricsPanel Component
 * 
 * Side panel (desktop) or bottom panel (mobile) with full lyrics
 * Auto-scrolls to current line
 */
const LyricsPanel: React.FC<LyricsPanelProps> = ({
  lines,
  currentTime,
  isPlaying,
  isVisible,
  onClose,
  onLineClick,
  isMobile,
  onPlayPause,
  onPrevious,
  onNext,
  playbackState = 'paused',
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null); // Add ref for scrollable content
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Use sync hook
  const {
    currentLineIndex,
    upcomingLineIndex,
    isAutoScrollEnabled,
    setAutoScrollEnabled,
  } = useLyricsSync(lines, currentTime, isPlaying);

  // Detect user scroll
  const handleScroll = () => {
    isUserScrollingRef.current = true;
    setAutoScrollEnabled(false);

    // Re-enable auto-scroll after 3 seconds of no scrolling
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      isUserScrollingRef.current = false;
      setAutoScrollEnabled(true);
    }, 3000);
  };

  // Auto-scroll to current line
  useEffect(() => {
    if (!isVisible || currentLineIndex === -1 || !isAutoScrollEnabled) return;

    const content = contentRef.current; // Use content ref instead of panel ref
    const currentLine = content?.querySelector('.lyric-line--current') as HTMLElement;

    if (content && currentLine && !isUserScrollingRef.current) {
      smoothScrollToElement(currentLine, content); // Pass the scrollable container
    }
  }, [currentLineIndex, isVisible, isAutoScrollEnabled]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay backdrop (mobile) */}
      <div className="lyrics-panel__backdrop" onClick={onClose} />

      {/* Panel */}
      <div ref={panelRef} className={`lyrics-panel ${isMobile ? 'lyrics-panel--mobile' : ''}`}>
        {/* Header with optional mobile controls */}
        <div className="lyrics-panel__header">
          <h3 className="lyrics-panel__title">Lyrics</h3>
          <button
            className="lyrics-panel__close"
            onClick={onClose}
            aria-label="Close lyrics panel"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile compact controls */}
        {isMobile && onPlayPause && onPrevious && onNext && (
          <div className="lyrics-panel__mobile-controls">
            <button
              className="lyrics-panel__control-btn"
              onClick={onPrevious}
              aria-label="Previous track"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" />
              </svg>
            </button>
            
            <button
              className="lyrics-panel__control-btn lyrics-panel__control-btn--play"
              onClick={onPlayPause}
              aria-label={playbackState === 'playing' ? 'Pause' : 'Play'}
            >
              {playbackState === 'playing' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
            
            <button
              className="lyrics-panel__control-btn"
              onClick={onNext}
              aria-label="Next track"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" />
              </svg>
            </button>
          </div>
        )}

        {/* Lyrics content */}
        <div ref={contentRef} className="lyrics-panel__content" onScroll={handleScroll}>
          {lines.length === 0 ? (
            <p className="lyrics-panel__empty">No lyrics available</p>
          ) : (
            lines.map((line, index) => (
              <LyricLine
                key={index}
                line={line}
                isCurrent={index === currentLineIndex}
                isUpcoming={index === upcomingLineIndex}
                onClick={() => onLineClick?.(line.time)}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default LyricsPanel;