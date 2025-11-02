import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useWaveform } from '@/hooks/useWaveform';
import './WaveformBar.css';

interface WaveformBarProps {
  audioUrl: string | null;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

/**
 * WaveformBar Component
 * 
 * Visual waveform progress bar that shows audio amplitude.
 * Click or drag to seek to specific position.
 * 
 * @param audioUrl - Current track audio file URL
 * @param currentTime - Current playback position
 * @param duration - Total track duration
 * @param onSeek - Callback when user seeks
 */
const WaveformBar: React.FC<WaveformBarProps> = ({
  audioUrl,
  currentTime,
  duration,
  onSeek,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredPosition, setHoveredPosition] = useState<number | null>(null);

  // Generate waveform (100 bars)
  const { waveformData, isLoading } = useWaveform(audioUrl, 100);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) : 0;

  /**
   * Draw waveform on canvas
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (accounting for device pixel ratio)
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Calculate bar dimensions
    const barCount = waveformData.length;
    const barWidth = rect.width / barCount;
    const barGap = barWidth * 0.2;
    const actualBarWidth = barWidth - barGap;
    const centerY = rect.height / 2;
    const maxBarHeight = rect.height * 0.8;

    // Get colors from CSS variables
    const styles = getComputedStyle(canvas);
    const playedColor = styles.getPropertyValue('--color-active').trim() || '#000';
    const unplayedColor = styles.getPropertyValue('--color-border').trim() || '#ccc';

    // Draw waveform bars
    for (let i = 0; i < barCount; i++) {
      const x = i * barWidth;
      const amplitude = waveformData[i];
      const barHeight = amplitude * maxBarHeight;
      
      // Determine color (played vs unplayed)
      const barProgress = i / barCount;
      const isPlayed = barProgress <= progress;
      ctx.fillStyle = isPlayed ? playedColor : unplayedColor;

      // Draw centered bar
      ctx.fillRect(
        x,
        centerY - barHeight / 2,
        actualBarWidth,
        barHeight
      );
    }

    // Draw hover indicator
    if (hoveredPosition !== null && !isDragging) {
      const hoverX = hoveredPosition * rect.width;
      ctx.strokeStyle = playedColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hoverX, 0);
      ctx.lineTo(hoverX, rect.height);
      ctx.stroke();
    }
  }, [waveformData, progress, hoveredPosition, isDragging]);

  /**
   * Calculate time from mouse/touch position
   */
  const calculateTimeFromPosition = (clientX: number): number => {
    const container = containerRef.current;
    if (!container) return 0;

    const rect = container.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    
    return percentage * duration;
  };

  /**
   * Handle click/drag to seek
   */
  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newTime = calculateTimeFromPosition(clientX);
    onSeek(newTime);
  };

  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;

    if (isDragging) {
      // Calculate time inline to avoid dependency
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
      const newTime = percentage * duration;
      onSeek(newTime);
    } else {
      // Update hover position
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
        setHoveredPosition(percentage);
      }
    }
  }, [isDragging, duration, onSeek]);

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setHoveredPosition(null);
  };

  // Attach global listeners for drag
  useEffect(() => {
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

  return (
    <div
      ref={containerRef}
      className={`waveform-bar ${isDragging ? 'waveform-bar--dragging' : ''} ${isLoading ? 'waveform-bar--loading' : ''}`}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
      onMouseMove={(e) => !isDragging && handlePointerMove(e.nativeEvent)}
      onMouseLeave={handleMouseLeave}
      role="slider"
      aria-label="Seek slider"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      tabIndex={0}
    >
      <canvas ref={canvasRef} className="waveform-bar__canvas" />
      {isLoading && (
        <div className="waveform-bar__loading-indicator">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
};

export default WaveformBar;