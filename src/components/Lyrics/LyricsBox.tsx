import React, { useRef, useEffect } from 'react';
import type { LyricLine as LyricLineType } from '@/types';
import { useLyricsSync, smoothScrollToElement } from '@/hooks/useLyricsSync';
import './LyricsBox.css';

interface LyricsBoxProps {
  lines: LyricLineType[];
  currentTime: number;
  isPlaying: boolean;
  isVisible: boolean;
}

/**
 * LyricsBox Component
 * 
 * Compact lyrics display between artwork and controls
 * Shows 3-4 lines with current line centered
 */
const LyricsBox: React.FC<LyricsBoxProps> = ({
  lines,
  currentTime,
  isPlaying,
  isVisible,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);

  // Use sync hook (auto-scroll always enabled for box)
  const { currentLineIndex } = useLyricsSync(lines, currentTime, isPlaying);

  // Auto-scroll to keep current line centered
  useEffect(() => {
    if (!isVisible || currentLineIndex === -1) return;

    const box = boxRef.current;
    const currentLine = box?.querySelector('.lyrics-box__line--current') as HTMLElement;

    if (box && currentLine) {
      smoothScrollToElement(currentLine, box);
    }
  }, [currentLineIndex, isVisible]);

  if (!isVisible || lines.length === 0) return null;

  // Show 2 lines before and after current (5 total)
  const visibleLines = [];
  for (let i = Math.max(0, currentLineIndex - 2); i <= Math.min(lines.length - 1, currentLineIndex + 2); i++) {
    visibleLines.push({ ...lines[i], index: i });
  }

  return (
    <div ref={boxRef} className="lyrics-box">
      {visibleLines.map((line, _idx) => (
        <div
          key={line.index}
          className={`lyrics-box__line ${line.index === currentLineIndex ? 'lyrics-box__line--current' : ''}`}
        >
          {line.text || '\u00A0'}
        </div>
      ))}
    </div>
  );
};

export default LyricsBox;