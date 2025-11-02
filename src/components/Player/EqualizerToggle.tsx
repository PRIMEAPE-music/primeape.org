import React from 'react';
import './EqualizerToggle.css';

interface EqualizerToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

/**
 * EqualizerToggle Component
 * 
 * Button to toggle equalizer visualization on/off.
 */
const EqualizerToggle: React.FC<EqualizerToggleProps> = ({
  isActive,
  onToggle,
}) => {
  return (
    <button
      className={`equalizer-toggle ${isActive ? 'equalizer-toggle--active' : ''}`}
      onClick={onToggle}
      aria-label={isActive ? 'Hide equalizer' : 'Show equalizer'}
      title={isActive ? 'Equalizer: On' : 'Equalizer: Off'}
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
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    </button>
  );
};

export default EqualizerToggle;