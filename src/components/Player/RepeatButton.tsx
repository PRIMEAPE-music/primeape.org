import React from 'react';
import type { RepeatMode } from '@/types';
import './RepeatButton.css';
import { trackRepeatToggle } from '@/utils/analytics';

interface RepeatButtonProps {
  repeatMode: RepeatMode;
  onToggle: () => void;
}

/**
 * RepeatButton Component
 * 
 * Toggle button for repeat modes (off → all → one).
 * Shows different icons for each mode.
 * 
 * @param repeatMode - Current repeat mode ('off' | 'all' | 'one')
 * @param onToggle - Callback when button clicked (cycles modes)
 */
const RepeatButton: React.FC<RepeatButtonProps> = ({
  repeatMode,
  onToggle,
}) => {
  const getTitle = () => {
    if (repeatMode === 'off') return 'Repeat: Off';
    if (repeatMode === 'all') return 'Repeat: All';
    return 'Repeat: One';
  };

  const handleClick = () => {
    onToggle();
    // Determine and track the NEW mode (after toggle: off → all → one → off)
    const nextMode: RepeatMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
    trackRepeatToggle({ mode: nextMode });
  };

  return (
    <button
      className={`repeat-button ${repeatMode !== 'off' ? 'repeat-button--active' : ''}`}
      onClick={handleClick}
      aria-label={`Repeat mode: ${repeatMode}`}
      title={getTitle()}
    >
      {/* Repeat icon (base) */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>

      {/* "1" overlay for repeat-one mode */}
      {repeatMode === 'one' && (
        <span className="repeat-button__one">1</span>
      )}
    </button>
  );
};

export default RepeatButton;