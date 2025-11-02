import { useState, useEffect } from 'react';
import { generateWaveform } from '@/utils/generateWaveform';

/**
 * useWaveform Hook
 * 
 * Generates and manages waveform data for an audio track.
 * 
 * @param audioUrl - URL to audio file
 * @param samples - Number of waveform bars
 * @returns Object with waveform data and loading state
 */
export function useWaveform(audioUrl: string | null, samples: number = 100) {
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioUrl) {
      setWaveformData([]);
      return;
    }

    let cancelled = false;

    const loadWaveform = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await generateWaveform(audioUrl, samples);
        
        if (!cancelled) {
          setWaveformData(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load waveform');
          setIsLoading(false);
          // Use flat waveform as fallback
          setWaveformData(new Array(samples).fill(0.5));
        }
      }
    };

    loadWaveform();

    return () => {
      cancelled = true;
    };
  }, [audioUrl, samples]);

  return {
    waveformData,
    isLoading,
    error,
  };
}