/**
 * Format time in seconds to MM:SS format
 * 
 * @param seconds - Time in seconds (can be float)
 * @returns Formatted time string (e.g., "3:45" or "12:03")
 * 
 * @example
 * formatTime(125.6) // "2:05"
 * formatTime(65) // "1:05"
 * formatTime(5) // "0:05"
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parse MM:SS time string to seconds
 * 
 * @param timeString - Time string in MM:SS format
 * @returns Time in seconds
 * 
 * @example
 * parseTime("3:45") // 225
 */
export function parseTime(timeString: string): number {
  const [mins, secs] = timeString.split(':').map(Number);
  return (mins * 60) + secs;
}