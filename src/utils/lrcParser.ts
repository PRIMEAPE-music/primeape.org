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

  console.log('📄 parseLRC: Starting parse, content length:', lrcContent.length);
  
  // Normalize line endings: remove all \r characters (Windows CRLF → LF)
  const normalizedContent = lrcContent.replace(/\r/g, '');
  
  // Split into lines and process
  const rawLines = normalizedContent.split('\n');
  console.log('📄 parseLRC: Total raw lines:', rawLines.length);

  let matchedLines = 0;
  let skippedLines = 0;

  for (const rawLine of rawLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      skippedLines++;
      continue;
    }
    
    // Skip lines that are only timestamps with no text (malformed LRC)
    // Example: "[00:10.5]" with no lyrics after it
    if (/^\[[\d:.]+\]$/.test(trimmed)) continue;

    // Check if line contains timestamp [MM:SS.SS]
    // Regular expression for LRC timestamps: [mm:ss.x], [mm:ss.xx], or [mm:ss.xxx]
    // Captures 1-3 digit milliseconds to handle various LRC format variations
    const timestampRegex = /\[(\d{2,}):(\d{2})\.(\d{1,3})\]/g;
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
      const [fullMatch, minutes, seconds, millisecondsRaw] = match;
      
      // Normalize milliseconds to 3 digits by padding with zeros
      // Examples: "5" → "500", "75" → "750", "750" → "750"
      // This ensures "75" is interpreted as 750ms (0.75s), not 75ms (0.075s)
      let msString = millisecondsRaw;
      while (msString.length < 3) {
        msString += '0';
      }
      const milliseconds = parseInt(msString, 10);
      
      const time = 
        parseInt(minutes) * 60 + 
        parseInt(seconds) + 
        milliseconds / 1000;
      
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
      matchedLines++;
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

  console.log('📄 parseLRC: Parse complete -', {
    totalRawLines: rawLines.length,
    skippedLines,
    matchedLines,
    finalLinesCount: lines.length
  });

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
  console.log('📄 loadLRC: Fetching from:', url);
  try {
    const response = await fetch(url);
    console.log('📄 loadLRC: Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Failed to load LRC file: ${response.statusText}`);
    }

    const content = await response.text();
    console.log('📄 loadLRC: Content received, length:', content.length);
    
    const parsed = parseLRC(content);
    console.log('📄 loadLRC: Parsed successfully:', {
      linesCount: parsed.lines.length,
      metadata: parsed.metadata
    });
    
    return parsed;
  } catch (error) {
    console.error('❌ loadLRC: Error:', error);
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