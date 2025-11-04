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

  // Render inverted radial equalizer (bars extend inward)
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
    const barCount = 144; // Number of bars radiating (increased for smoother circle)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Use full diagonal distance for corners to extend properly
    const maxDimension = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
    const outerRadius = maxDimension * 0.68; // Start from outer edge (including corners)
    const maxBarLength = Math.min(rect.width, rect.height) * 0.22; // How far bars extend inward (reduced)
    // Get color from CSS variable
    const styles = getComputedStyle(canvas);
    const barColor = styles.getPropertyValue('--color-active').trim() || '#fff';

    // Draw inverted radial bars
    for (let i = 0; i < barCount; i++) {
      // Calculate angle for this bar (in radians)
      // Start at bottom (270° = -π/2) and rotate clockwise
      // This positions bass frequencies at the bottom
      const angleOffset = -Math.PI / 2; // Start at bottom (270° = -90°)
      const angle = angleOffset + (i / barCount) * Math.PI * 2;

      // Map frequency data with bass at bottom
      // Lower indices = bass, higher indices = treble
      // Distribute across full frequency spectrum
      const dataIndex = Math.floor((i / barCount) * frequencyData.length * 0.6);
      const amplitude = frequencyData[dataIndex] / 255; // Normalize to 0-1
      
      // Calculate bar length based on amplitude
      // Bars extend INWARD from outer edge
      const minLength = maxBarLength * 0.15; // Minimum visible length
      const barLength = minLength + (amplitude * (maxBarLength - minLength));
      
      // Calculate bar endpoints (FROM outer radius TOWARD center)
      const startX = centerX + Math.cos(angle) * outerRadius;
      const startY = centerY + Math.sin(angle) * outerRadius;
      const endX = centerX + Math.cos(angle) * (outerRadius - barLength);
      const endY = centerY + Math.sin(angle) * (outerRadius - barLength);

      // Draw bar with gradient (from outer edge toward center)
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, barColor + '80'); // More transparent at outer edge
      gradient.addColorStop(1, barColor); // Solid at inner edge (near artwork)

      ctx.strokeStyle = gradient;
      ctx.lineWidth = Math.max(2.5, (Math.PI * 2 * outerRadius) / barCount * 0.65); // Bar width
      ctx.lineCap = 'round'; // Rounded bar ends

      // Draw the bar
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Optional: Draw subtle outer ring for visual frame
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = barColor + '20'; // Very subtle
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [frequencyData, isPlaying, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="equalizer">
      <canvas ref={canvasRef} className="equalizer__canvas" />
    </div>
  );
};

export default Equalizer;