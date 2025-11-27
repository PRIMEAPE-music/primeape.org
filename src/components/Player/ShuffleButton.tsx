import React from 'react';
import './ShuffleButton.css';
import { trackShuffleToggle } from '@/utils/analytics';

interface ShuffleButtonProps {
  isShuffled: boolean;
  onToggle: () => void;
}

/**
 * ShuffleButton Component
 * 
 * Toggle button for shuffle mode.
 * Active state indicated by color change.
 * 
 * @param isShuffled - Whether shuffle mode is active
 * @param onToggle - Callback when button clicked
 */
const ShuffleButton: React.FC<ShuffleButtonProps> = ({
  isShuffled,
  onToggle,
}) => {
  const handleClick = () => {
    onToggle();
    // Track with the NEW state (after toggle)
    trackShuffleToggle({ enabled: !isShuffled });
  };

  return (
    <button
      className={`shuffle-button ${isShuffled ? 'shuffle-button--active' : ''}`}
      onClick={handleClick}
      aria-label={isShuffled ? 'Disable shuffle' : 'Enable shuffle'}
      title={isShuffled ? 'Shuffle: On' : 'Shuffle: Off'}
    >
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
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
        <polyline points="21 16 21 21 16 21" />
        <line x1="15" y1="15" x2="21" y2="21" />
        <line x1="4" y1="4" x2="9" y2="9" />
      </svg>
    </button>
  );
};

export default ShuffleButton;