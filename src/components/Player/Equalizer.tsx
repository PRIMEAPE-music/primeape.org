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
    const barCount = 288; // Number of bars radiating (increased for smoother circle)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Use full diagonal distance for corners to extend properly
    const maxDimension = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
    const outerRadius = maxDimension * 0.98; // Maximum extension (reaches corners)
    const maxBarLength = maxDimension * 0.32; // Longer bars for better visibility
    // Get color from CSS variable
    const styles = getComputedStyle(canvas);
    const barColor = styles.getPropertyValue('--color-active').trim() || '#fff';

    // Draw inverted radial bars
    for (let i = 0; i < barCount; i++) {
      // Calculate angle for this bar (in radians)
      // Start at bottom (π/2 = 90° in canvas coordinates where Y increases downward)
      // This positions bass frequencies at the bottom
      const angleOffset = Math.PI / 2; // Start at bottom (90° in canvas Y-down coordinates)
      const angle = angleOffset + (i / barCount) * Math.PI * 2;

      // Create mirrored frequency distribution for symmetry
      // Map bars to frequency spectrum with mirroring around vertical axis
      
      // Normalize bar position to 0-1 (where we are in the circle)
      const normalizedPosition = i / barCount;
      
      // Create symmetrical distribution:
      // - Bottom (0.0) = Bass (low frequencies)
      // - Sides (0.25, 0.75) = Mids (medium frequencies)
      // - Top (0.5) = Highs (high frequencies)
      // - Mirror left and right sides for balance
      
      let frequencyPosition;
      if (normalizedPosition <= 0.5) {
        // First half: bottom → top (0 to 0.5)
        // Maps to frequencies: bass → highs
        // Use logarithmic scale for better frequency separation
        frequencyPosition = Math.pow(normalizedPosition * 2, 1.5); // Emphasize bass
      } else {
        // Second half: top → bottom (0.5 to 1.0)
        // Mirror the first half for symmetry
        frequencyPosition = Math.pow((1.0 - normalizedPosition) * 2, 1.5);
      }
      
      // Map to frequency array (use lower 50% of spectrum for better visualization)
      const dataIndex = Math.floor(frequencyPosition * frequencyData.length * 0.5);
      let amplitude = frequencyData[dataIndex] / 255; // Normalize to 0-1
      
      // Amplify high frequencies for better visibility
      // High frequencies (top of circle) naturally have lower amplitude than bass
      // Apply frequency-dependent gain to make them visible
      const frequencyGain = 1.0 + (frequencyPosition * 2.5); // 1x at bass, 3.5x at highs
      amplitude = Math.min(1.0, amplitude * frequencyGain); // Clamp to 1.0 max
      
      // Calculate bar length based on amplitude
      // Bars extend INWARD from outer edge
      // Calculate frequency-dependent minimum length
      // Bass can disappear fully when silent, highs stay more visible
      const frequencyMinMultiplier = 0.15 + (frequencyPosition * 0.10); // 15% bass, 25% highs
      const minLength = maxBarLength * frequencyMinMultiplier;
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