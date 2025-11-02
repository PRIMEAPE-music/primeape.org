/**
 * Generate waveform data from audio file
 * 
 * @param audioUrl - URL to audio file
 * @param samples - Number of waveform bars (default 100)
 * @returns Promise<number[]> - Array of normalized amplitudes (0-1)
 */
export async function generateWaveform(
  audioUrl: string,
  samples: number = 100
): Promise<number[]> {
  try {
    // Fetch audio file
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Create audio context
    const audioContext = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    
    // Decode audio data
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    // Get raw audio data (use first channel)
    const rawData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / samples);
    const waveformData: number[] = [];

    // Downsample to desired number of samples
    for (let i = 0; i < samples; i++) {
      const start = i * blockSize;
      let sum = 0;

      // Get average amplitude for this block
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(rawData[start + j]);
      }

      const amplitude = sum / blockSize;
      waveformData.push(amplitude);
    }

    // Normalize to 0-1 range
    const max = Math.max(...waveformData);
    const normalized = waveformData.map(val => val / max);

    // Close audio context to free resources
    audioContext.close();

    return normalized;
  } catch (error) {
    console.error('Error generating waveform:', error);
    // Return flat line on error
    return new Array(samples).fill(0.5);
  }
}

/**
 * Sample waveform data for testing (when audio files not available)
 * Generates a realistic-looking waveform pattern
 */
export function generateSampleWaveform(samples: number = 100): number[] {
  const waveform: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    // Create varied amplitudes that look like music
    const base = Math.sin(i / 10) * 0.3 + 0.5;
    const variation = Math.random() * 0.4;
    const value = Math.max(0.1, Math.min(1, base + variation));
    waveform.push(value);
  }
  
  return waveform;
}