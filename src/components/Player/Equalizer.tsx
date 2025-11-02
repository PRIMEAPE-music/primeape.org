import React, { useRef, useEffect } from 'react';
import { useEqualizer } from '@/hooks/useEqualizer';
import './Equalizer.css';

interface EqualizerProps {
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
  isPlaying: boolean;
  isVisible: boolean;
}

/**
 * Equalizer Component
 * 
 * Visual frequency equalizer that displays animated bars
 * responding to audio frequencies. Rendered on Canvas.
 * 
 * @param audioContext - Web Audio API context
 * @param sourceNode - Audio source node
 * @param isPlaying - Whether audio is playing
 * @param isVisible - Whether equalizer should be visible
 */
const Equalizer: React.FC<EqualizerProps> = ({
  audioContext,
  sourceNode,
  isPlaying,
  isVisible,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get frequency data
  const { frequencyData } = useEqualizer(audioContext, sourceNode, isPlaying);

  // Render equalizer bars
  useEffect(() => {
    if (!isVisible) return;
    
    const canvas = canvasRef.current;
    if (!canvas || frequencyData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    if (!isPlaying) return; // Don't draw if not playing

    // Configuration
    const barCount = 24; // Number of bars to display
    const barWidth = rect.width / barCount;
    const barGap = barWidth * 0.15;
    const actualBarWidth = barWidth - barGap;

    // Get color from CSS variable
    const styles = getComputedStyle(canvas);
    const barColor = styles.getPropertyValue('--color-active').trim() || '#fff';

    // Draw bars
    for (let i = 0; i < barCount; i++) {
      // Sample frequency data (logarithmic distribution for better visualization)
      const dataIndex = Math.floor((i / barCount) * frequencyData.length * 0.4); // Use lower 40% of frequencies
      const amplitude = frequencyData[dataIndex] / 255; // Normalize to 0-1
      
      // Calculate bar height
      const minHeight = rect.height * 0.05;
      const maxHeight = rect.height * 0.9;
      const barHeight = minHeight + (amplitude * (maxHeight - minHeight));

      // Position bar at bottom
      const x = i * barWidth;
      const y = rect.height - barHeight;

      // Draw bar with gradient
      const gradient = ctx.createLinearGradient(0, y, 0, rect.height);
      gradient.addColorStop(0, barColor);
      gradient.addColorStop(1, barColor + '80'); // Add transparency

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, actualBarWidth, barHeight);
    }
  }, [frequencyData, isPlaying, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="equalizer">
      <canvas ref={canvasRef} className="equalizer__canvas" />
    </div>
  );
};

export default Equalizer;