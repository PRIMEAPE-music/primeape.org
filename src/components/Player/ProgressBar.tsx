import React, { useRef, useState } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

/**
 * ProgressBar Component
 * 
 * Interactive progress bar that shows playback position and allows seeking.
 * Click or drag to jump to a specific time in the track.
 * 
 * Phase 2: Simple filled bar
 * Phase 3: Will be replaced with waveform visualization
 * 
 * @param currentTime - Current playback position in seconds
 * @param duration - Total track duration in seconds
 * @param onSeek - Callback when user seeks to new position
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  onSeek,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /**
   * Calculate time from mouse/touch position
   */
  const calculateTimeFromPosition = (clientX: number): number => {
    const bar = progressBarRef.current;
    if (!bar) return 0;

    const rect = bar.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    
    return percentage * duration;
  };

  /**
   * Handle mouse/touch down - start dragging
   */
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newTime = calculateTimeFromPosition(clientX);
    onSeek(newTime);
  };

  /**
   * Handle mouse/touch move - continue dragging
   */
  const handlePointerMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newTime = calculateTimeFromPosition(clientX);
    onSeek(newTime);
  };

  /**
   * Handle mouse/touch up - stop dragging
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
  }, [isDragging]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div
      ref={progressBarRef}
      className={`progress-bar ${isDragging ? 'progress-bar--dragging' : ''}`}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      role="slider"
      aria-label="Seek slider"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      tabIndex={0}
    >
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${progress}%` }}
        />
        <div
          className="progress-bar__thumb"
          style={{ left: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;