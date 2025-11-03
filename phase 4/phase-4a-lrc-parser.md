# PHASE 4A: LRC PARSER & UTILITIES

## Claude Code Prompt

```
I'm implementing Phase 4A (LRC Parser & Utilities) for the PRIMEAPE music website.

Please implement:
1. LRC format parser
2. SRT to LRC converter
3. Lyrics data structures and types
4. File loading utilities

Context:
- Phase 1-3 complete
- Need to add lyrics file parsing
- Will be used by lyrics display components in Phase 4B

Follow the detailed instructions below.
```

---

## Overview

**Sub-Phase:** 4A  
**Feature:** LRC Parser & Utilities  
**Complexity:** Simple  
**Time Estimate:** 45 minutes

**What Will Be Built:**
- TypeScript types for lyrics
- LRC file parser
- SRT to LRC converter
- Utility functions for lyrics handling

**Dependencies:**
- Phase 2 complete (types system established)

---

## Files to Create

```
src/utils/lrcParser.ts
src/utils/srtToLrc.ts
```

## Files to Modify

```
src/types/index.ts (add lyrics types - already added in Phase 1)
```

---

## Implementation Instructions

### File: `src/types/index.ts`

**🔍 VERIFY these types already exist from Phase 1:**

```typescript
// ============================================================================
// LYRICS TYPES
// ============================================================================

export interface LyricLine {
  time: number; // timestamp in seconds
  text: string;
}

export type LyricsDisplayState = 'hidden' | 'panel' | 'integrated';
```

**If they don't exist, add them to the file.**

---

### File: `src/utils/lrcParser.ts`

**📁 CREATE NEW FILE:**

```typescript
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
```

---

### File: `src/utils/srtToLrc.ts`

**📁 CREATE NEW FILE:**

```typescript
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
```

---

## Validation Checklist

### LRC Parser:
- [ ] Parses valid LRC file without errors
- [ ] Extracts timestamps correctly (MM:SS.SS)
- [ ] Extracts lyric text correctly
- [ ] Handles metadata tags ([ar:], [ti:], etc.)
- [ ] Sorts lines by timestamp
- [ ] Handles multiple timestamps per line
- [ ] Handles empty lines gracefully
- [ ] Returns ParsedLRC with metadata and lines

### Utility Functions:
- [ ] `getCurrentLineIndex()` returns correct index
- [ ] `getUpcomingLineIndex()` finds next line
- [ ] `formatLyricTimestamp()` formats correctly
- [ ] `hasTimestamps()` detects timestamped vs plain text
- [ ] `loadLRC()` fetches file successfully

### SRT Converter:
- [ ] Converts SRT format to LRC format
- [ ] Handles HH:MM:SS,MS format
- [ ] Converts to MM:SS.SS format
- [ ] Preserves lyric text
- [ ] Handles multi-line subtitles
- [ ] Batch conversion works

### Edge Cases:
- [ ] Malformed LRC file (missing brackets)
- [ ] Missing timestamps
- [ ] Invalid time format
- [ ] Empty file
- [ ] File not found (404)

---

## Testing Instructions

### Test 1: Parse Simple LRC

**Create test file:** `test.lrc`
```
[ar:PRIMEAPE]
[ti:Test Song]
[00:00.50]First line
[00:03.00]Second line
[00:05.50]Third line
```

**Test in browser console:**
```javascript
import { parseLRC } from './utils/lrcParser';

const lrcContent = `[ar:PRIMEAPE]
[ti:Test Song]
[00:00.50]First line
[00:03.00]Second line
[00:05.50]Third line`;

const parsed = parseLRC(lrcContent);
console.log(parsed);
// Should show metadata and 3 lines
```

### Test 2: Get Current Line

```javascript
import { getCurrentLineIndex } from './utils/lrcParser';

const lines = [
  { time: 0.5, text: 'First' },
  { time: 3.0, text: 'Second' },
  { time: 5.5, text: 'Third' },
];

console.log(getCurrentLineIndex(lines, 2.0)); // Should return 0
console.log(getCurrentLineIndex(lines, 4.0)); // Should return 1
console.log(getCurrentLineIndex(lines, 6.0)); // Should return 2
```

### Test 3: Convert SRT to LRC

**Create test file:** `test.srt`
```
1
00:00:12,000 --> 00:00:15,500
First line of lyrics

2
00:00:15,500 --> 00:00:18,200
Second line of lyrics
```

**Test conversion:**
```javascript
import { srtToLrc } from './utils/srtToLrc';

const srtContent = `1
00:00:12,000 --> 00:00:15,500
First line of lyrics

2
00:00:15,500 --> 00:00:18,200
Second line of lyrics`;

const lrc = srtToLrc(srtContent);
console.log(lrc);
// Should output:
// [00:12.00]First line of lyrics
// [00:15.50]Second line of lyrics
```

### Test 4: Load LRC File

**Place file in:** `public/lyrics/test.lrc`

```javascript
import { loadLRC } from './utils/lrcParser';

loadLRC('/lyrics/test.lrc')
  .then(parsed => {
    console.log('Loaded lyrics:', parsed);
  })
  .catch(error => {
    console.error('Failed to load:', error);
  });
```

---

## Known Pitfalls

### Pitfall 1: Timestamp Format Variations
**Problem:** Some LRC files use [MM:SS] instead of [MM:SS.SS]  
**Solution:** Regex handles both (centiseconds optional)

### Pitfall 2: Multiple Timestamps
**Problem:** Some files have [00:10][00:20]Same text  
**Solution:** Parser creates separate lines for each timestamp

### Pitfall 3: UTF-8 Encoding
**Problem:** Lyrics with special characters might not load  
**Solution:** Ensure files saved as UTF-8

### Pitfall 4: Large Files
**Problem:** 500+ line LRC files could slow parsing  
**Solution:** Parser is efficient, but consider lazy loading in Phase 4B

---

## Completion Criteria

Phase 4A is complete when:
- ✅ All files created
- ✅ TypeScript compiles with no errors
- ✅ LRC parser works with test files
- ✅ SRT converter produces valid LRC
- ✅ Utility functions return correct values
- ✅ No console errors

**Next:** Proceed to `phase-4b-lyrics-display.md`

---

# END OF PHASE 4A INSTRUCTIONS
