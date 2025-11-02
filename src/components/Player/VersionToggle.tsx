import React from 'react';
import type { AudioVersion } from '@/types';
import './VersionToggle.css';

interface VersionToggleProps {
  currentVersion: AudioVersion;
  onToggle: () => void;
}

/**
 * VersionToggle Component
 * 
 * Button to toggle between vocal and instrumental versions.
 * Shows "V" for vocal, "I" for instrumental.
 * 
 * @param currentVersion - Current audio version ('vocal' | 'instrumental')
 * @param onToggle - Callback when button clicked
 */
const VersionToggle: React.FC<VersionToggleProps> = ({
  currentVersion,
  onToggle,
}) => {
  const isVocal = currentVersion === 'vocal';

  return (
    <button
      className={`version-toggle ${isVocal ? 'version-toggle--vocal' : 'version-toggle--instrumental'}`}
      onClick={onToggle}
      aria-label={`Switch to ${isVocal ? 'instrumental' : 'vocal'} version`}
      title={`Current: ${isVocal ? 'Vocal' : 'Instrumental'}\nClick to switch`}
    >
      <span className="version-toggle__icon">
        {isVocal ? 'V' : 'I'}
      </span>
      <span className="version-toggle__label">
        {isVocal ? 'Vocal' : 'Instrumental'}
      </span>
    </button>
  );
};

export default VersionToggle;