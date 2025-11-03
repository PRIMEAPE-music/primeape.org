import React from 'react';
import type { LyricLine as LyricLineType } from '@/types';
import './LyricLine.css';

interface LyricLineProps {
  line: LyricLineType;
  isCurrent: boolean;
  isUpcoming: boolean;
  onClick?: () => void;
}

/**
 * LyricLine Component
 * 
 * Single line of lyrics with highlighting
 */
const LyricLine: React.FC<LyricLineProps> = ({
  line,
  isCurrent,
  isUpcoming,
  onClick,
}) => {
  return (
    <div
      className={`lyric-line ${isCurrent ? 'lyric-line--current' : ''} ${isUpcoming ? 'lyric-line--upcoming' : ''}`}
      onClick={onClick}
    >
      {line.text || '\u00A0'} {/* Non-breaking space for empty lines */}
    </div>
  );
};

export default React.memo(LyricLine);