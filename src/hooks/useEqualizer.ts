import { useEffect, useRef, useState } from 'react';

interface UseEqualizerOptions {
  fftSize?: number; // Must be power of 2 (512, 1024, 2048)
  smoothingTimeConstant?: number; // 0-1
}

/**
 * useEqualizer Hook
 * 
 * Analyzes audio frequencies in real-time for visualization.
 * 
 * @param audioContext - Web Audio API AudioContext
 * @param sourceNode - MediaElementSourceNode connected to audio element
 * @param isPlaying - Whether audio is currently playing
 * @param options - Configuration options
 * @returns Frequency data array and analyser node
 */
export function useEqualizer(
  audioContext: AudioContext | null,
  sourceNode: MediaElementAudioSourceNode | null,
  isPlaying: boolean,
  options: UseEqualizerOptions = {}
) {
  const {
    fftSize = 512,
    smoothingTimeConstant = 0.8,
  } = options;

  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(0));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Create analyser node
  useEffect(() => {
    if (!audioContext || !sourceNode) return;

    // Create analyser if it doesn't exist
    if (!analyserRef.current) {
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = smoothingTimeConstant;
      
      // Connect: source -> analyser -> destination
      // (destination already connected in useAudioPlayer)
      sourceNode.connect(analyser);
      
      analyserRef.current = analyser;
      
      // Initialize frequency data array
      const bufferLength = analyser.frequencyBinCount;
      setFrequencyData(new Uint8Array(bufferLength));
    }

    return () => {
      // Don't disconnect - we want analyser to persist
      // Will be cleaned up when audio context is closed
    };
  }, [audioContext, sourceNode, fftSize, smoothingTimeConstant]);

  // Update frequency data on animation frame
  useEffect(() => {
    if (!isPlaying || !analyserRef.current) {
      // Cancel animation frame if not playing
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const updateFrequencyData = () => {
      if (analyserRef.current) {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        setFrequencyData(dataArray);
      }

      animationFrameRef.current = requestAnimationFrame(updateFrequencyData);
    };

    animationFrameRef.current = requestAnimationFrame(updateFrequencyData);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  return {
    frequencyData,
    analyserNode: analyserRef.current,
  };
}