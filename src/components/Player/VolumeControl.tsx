import React, { useState, useRef, useCallback } from 'react';
import './VolumeControl.css';

interface VolumeControlProps {
  volume: number; // 0-1
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

/**
 * VolumeControl Component
 * 
 * Volume slider with mute toggle button.
 * Icon changes based on volume level (muted, low, medium, high).
 * 
 * @param volume - Current volume level (0-1)
 * @param isMuted - Whether audio is muted
 * @param onVolumeChange - Callback when volume changes
 * @param onMuteToggle - Callback when mute button clicked
 */
const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  /**
   * Determine which volume icon to show
   */
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return 'muted';
    } else if (volume < 0.33) {
      return 'low';
    } else if (volume < 0.66) {
      return 'medium';
    } else {
      return 'high';
    }
  };

  const volumeIcon = getVolumeIcon();

  /**
   * Calculate volume from mouse/touch position
   */
  const calculateVolumeFromPosition = (clientX: number): number => {
    const slider = sliderRef.current;
    if (!slider) return volume;

    const rect = slider.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    
    return percentage;
  };

  /**
   * Handle slider click/drag start
   */
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newVolume = calculateVolumeFromPosition(clientX);
    onVolumeChange(newVolume);
  };

  /**
   * Handle slider drag
   */
  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    // Calculate volume inline to avoid dependency on calculateVolumeFromPosition
    const slider = sliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    
    onVolumeChange(percentage);
  }, [isDragging, onVolumeChange]);

  /**
   * Handle drag end
   */
  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Attach global listeners for drag
  React.useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      handlePointerMove(e);
    };

    const handleUp = () => {
      handlePointerUp();
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchend', handleUp);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, handlePointerMove]);

  const displayVolume = isMuted ? 0 : volume;
  const percentage = displayVolume * 100;

  return (
    <div className="volume-control">
      {/* Mute Toggle Button */}
      <button
        className="volume-control__button"
        onClick={onMuteToggle}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {volumeIcon === 'muted' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
        {volumeIcon === 'low' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
        {volumeIcon === 'medium' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
        {volumeIcon === 'high' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* Volume Slider */}
      <div
        ref={sliderRef}
        className={`volume-control__slider ${isDragging ? 'volume-control__slider--dragging' : ''}`}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        role="slider"
        aria-label="Volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
        tabIndex={0}
      >
        <div className="volume-control__track">
          <div
            className="volume-control__fill"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="volume-control__thumb"
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Volume Percentage (optional) */}
      <span className="volume-control__percentage">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};

export default VolumeControl;