import type { LyricLine } from '@/types';

/**
 * LRC Metadata (optional tags at start of file)
 */
interface LRCMetadata {
  artist?: string;  // [ar:Artist Name]
  title?: string;   // [ti:Song Title]
  album?: string;   // [al:Album Name]
  author?: string;  // [au:Creator of LRC file]
  length?: string;  // [length:MM:SS]
  by?: string;      // [by:Creator]
  offset?: number;  // [offset:+/- milliseconds]
}

/**
 * Parsed LRC file result
 */
export interface ParsedLRC {
  metadata: LRCMetadata;
  lines: LyricLine[];
}

/**
 * Parse LRC file content into structured data
 * 
 * LRC Format:
 * [MM:SS.SS]Lyric text
 * 
 * Example:
 * [00:12.00]First line
 * [00:15.50]Second line
 * 
 * @param lrcContent - Raw LRC file content as string
 * @returns Parsed metadata and lyric lines
 */
export function parseLRC(lrcContent: string): ParsedLRC {
  const lines: LyricLine[] = [];
  const metadata: LRCMetadata = {};

  // Split into lines and process
  const rawLines = lrcContent.split('\n');

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Check if line contains timestamp [MM:SS.SS]
    const timestampRegex = /\[(\d{2,}):(\d{2})\.(\d{2,3})\]/g;
    const metadataRegex = /\[(\w+):([^\]]+)\]/;

    // Check for metadata tags
    const metadataMatch = trimmed.match(metadataRegex);
    if (metadataMatch && !timestampRegex.test(trimmed)) {
      const [, key, value] = metadataMatch;
      switch (key.toLowerCase()) {
        case 'ar':
          metadata.artist = value;
          break;
        case 'ti':
          metadata.title = value;
          break;
        case 'al':
          metadata.album = value;
          break;
        case 'au':
          metadata.author = value;
          break;
        case 'length':
          metadata.length = value;
          break;
        case 'by':
          metadata.by = value;
          break;
        case 'offset':
          metadata.offset = parseInt(value);
          break;
      }
      continue;
    }

    // Parse timestamped lyrics
    let match;
    const timestamps: number[] = [];
    let text = trimmed;

    // Extract all timestamps (some lines have multiple)
    while ((match = timestampRegex.exec(trimmed)) !== null) {
      const [fullMatch, minutes, seconds, centiseconds] = match;
      const time = 
        parseInt(minutes) * 60 + 
        parseInt(seconds) + 
        parseInt(centiseconds.padEnd(2, '0')) / 100;
      
      timestamps.push(time);
      
      // Remove timestamp from text
      text = text.replace(fullMatch, '').trim();
    }

    // Add lyric line for each timestamp
    for (const timestamp of timestamps) {
      lines.push({
        time: timestamp,
        text: text || '', // Handle empty lines
      });
    }
  }

  // Sort lines by timestamp
  lines.sort((a, b) => a.time - b.time);

  // Apply offset if specified
  if (metadata.offset) {
    const offsetSeconds = metadata.offset / 1000;
    lines.forEach(line => {
      line.time += offsetSeconds;
    });
  }

  return {
    metadata,
    lines,
  };
}

/**
 * Load LRC file from URL
 * 
 * @param url - URL to LRC file
 * @returns Promise<ParsedLRC>
 */
export async function loadLRC(url: string): Promise<ParsedLRC> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load LRC file: ${response.statusText}`);
    }

    const content = await response.text();
    return parseLRC(content);
  } catch (error) {
    console.error('Error loading LRC file:', error);
    throw error;
  }
}

/**
 * Find current lyric line based on playback time
 * 
 * @param lines - Array of lyric lines
 * @param currentTime - Current playback time in seconds
 * @returns Index of current line, or -1 if none
 */
export function getCurrentLineIndex(
  lines: LyricLine[],
  currentTime: number
): number {
  if (lines.length === 0) return -1;

  // Find last line that started before or at currentTime
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].time <= currentTime) {
      return i;
    }
  }

  return -1; // Before first line
}

/**
 * Get upcoming line based on current time
 * 
 * @param lines - Array of lyric lines
 * @param currentTime - Current playback time in seconds
 * @returns Index of next line, or -1 if none
 */
export function getUpcomingLineIndex(
  lines: LyricLine[],
  currentTime: number
): number {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time > currentTime) {
      return i;
    }
  }

  return -1; // No upcoming lines
}

/**
 * Format timestamp to MM:SS format for display
 * 
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatLyricTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check if lyrics have timestamps (vs plain text)
 * 
 * @param lines - Array of lyric lines
 * @returns True if lyrics have valid timestamps
 */
export function hasTimestamps(lines: LyricLine[]): boolean {
  if (lines.length === 0) return false;
  
  // Check if at least 50% of lines have non-zero timestamps
  const nonZeroCount = lines.filter(line => line.time > 0).length;
  return nonZeroCount / lines.length >= 0.5;
}