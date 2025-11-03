/**
 * SRT (SubRip) Format:
 * 
 * 1
 * 00:00:12,000 --> 00:00:15,500
 * First line of lyrics
 * 
 * 2
 * 00:00:15,500 --> 00:00:18,200
 * Second line of lyrics
 */

/**
 * Convert SRT (SubRip) format to LRC format
 * 
 * Useful for converting subtitles exported from DaVinci Resolve
 * or other video editing software.
 * 
 * @param srtContent - Raw SRT file content
 * @returns LRC formatted string
 */
export function srtToLrc(srtContent: string): string {
  const lines: string[] = [];
  
  // Split into subtitle blocks (separated by blank lines)
  const blocks = srtContent.split(/\n\s*\n/);

  for (const block of blocks) {
    const blockLines = block.trim().split('\n');
    
    if (blockLines.length < 3) continue; // Need at least: number, time, text

    // Parse timestamp line (format: 00:00:12,000 --> 00:00:15,500)
    const timeMatch = blockLines[1].match(
      /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/
    );

    if (!timeMatch) continue;

    // Extract start time (we ignore end time in LRC)
    const [
      ,
      hours,
      minutes,
      seconds,
      milliseconds,
    ] = timeMatch;

    // Convert to LRC timestamp format [MM:SS.SS]
    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    const secs = seconds.padStart(2, '0');
    const centiseconds = milliseconds.substring(0, 2).padEnd(2, '0');

    const lrcTimestamp = `[${totalMinutes.toString().padStart(2, '0')}:${secs}.${centiseconds}]`;

    // Extract text (everything after timestamp line)
    const text = blockLines.slice(2).join(' ').trim();

    lines.push(`${lrcTimestamp}${text}`);
  }

  return lines.join('\n');
}

/**
 * Convert SRT file to LRC and save/return
 * 
 * @param srtContent - Raw SRT content
 * @returns LRC formatted content
 */
export function convertSrtFile(srtContent: string): string {
  try {
    return srtToLrc(srtContent);
  } catch (error) {
    console.error('Error converting SRT to LRC:', error);
    throw new Error('Failed to convert SRT file');
  }
}

/**
 * Batch convert multiple SRT files
 * (useful for converting entire album at once)
 * 
 * @param srtFiles - Map of filename -> SRT content
 * @returns Map of filename -> LRC content
 */
export function batchConvertSrt(
  srtFiles: Record<string, string>
): Record<string, string> {
  const converted: Record<string, string> = {};

  for (const [filename, content] of Object.entries(srtFiles)) {
    try {
      const lrcFilename = filename.replace(/\.srt$/i, '.lrc');
      converted[lrcFilename] = srtToLrc(content);
    } catch (error) {
      console.error(`Failed to convert ${filename}:`, error);
    }
  }

  return converted;
}