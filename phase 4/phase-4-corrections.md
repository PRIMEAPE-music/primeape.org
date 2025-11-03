# FIX: LRC Parser Line Ending Issue

## Root Cause
The LRC file has Windows line endings (`\r\n` - CRLF) which leaves a `\r` character at the end of each line after splitting by `\n`. This interferes with the regex matching.

**Evidence:**
```
First 3 lines: [ "[00:10.333] im the greatest...\r", "[00:12.791] bring...\r" ]
```

The `\r` at the end causes the regex to fail because it expects the line to end after the lyric text, but instead finds `\r`.

## Solution
Normalize line endings by removing all `\r` characters before processing.

---

## Implementation

📁 **File:** `src/utils/lrcParser.ts`

### Fix: Normalize Line Endings

🔍 **FIND** (at the very beginning of the parseLRC function, around line 36-42):

```typescript
export function parseLRC(lrcContent: string): ParsedLRC {
  const lines: LyricLine[] = [];
  const metadata: LRCMetadata = {};

  console.log('📄 parseLRC: Starting parse, content length:', lrcContent.length);
  
  // Split into lines and process
  const rawLines = lrcContent.split('\n');
```

✏️ **REPLACE WITH:**

```typescript
export function parseLRC(lrcContent: string): ParsedLRC {
  const lines: LyricLine[] = [];
  const metadata: LRCMetadata = {};

  console.log('📄 parseLRC: Starting parse, content length:', lrcContent.length);
  
  // Normalize line endings: remove all \r characters (Windows CRLF → LF)
  const normalizedContent = lrcContent.replace(/\r/g, '');
  
  // Split into lines and process
  const rawLines = normalizedContent.split('\n');
```

**That's it!** Just one line added: `const normalizedContent = lrcContent.replace(/\r/g, '');`

And change `lrcContent.split('\n')` to `normalizedContent.split('\n')`.

---

## Alternative: More Robust Splitting

If you want to be extra safe, you can also change the split method:

🔍 **FIND:**
```typescript
  // Normalize line endings: remove all \r characters (Windows CRLF → LF)
  const normalizedContent = lrcContent.replace(/\r/g, '');
  
  // Split into lines and process
  const rawLines = normalizedContent.split('\n');
```

✏️ **REPLACE WITH:**
```typescript
  // Normalize line endings and split (handles \r\n, \n, and \r)
  const rawLines = lrcContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
```

This handles all three line ending formats:
- Windows: `\r\n` (CRLF)
- Unix/Mac: `\n` (LF)  
- Old Mac: `\r` (CR)

---

## Testing

1. **Apply the fix** (add the normalization line)
2. **Save the file**
3. **Reload the page** (Ctrl+Shift+R)
4. **Play track 14**
5. **Check console** - you should now see:

```
📄 loadLRC: Parsed successfully: { linesCount: 45, metadata: {} }
🎵 useLyrics: Loaded lyrics: { linesCount: 45, ... }
🎵 Player Component State: { hasLyrics: true, linesCount: 45, displayState: "panel", shouldShowPanel: true }
```

6. **Check for lyrics panel**: `document.querySelector('.lyrics-panel')` should return an element

---

## Expected Result

After this fix:
- ✅ Parser will successfully extract all 45 lyric lines
- ✅ `lyrics.lines` will be populated
- ✅ LyricsPanel component will render
- ✅ Lyrics will display and auto-scroll

---

## Why This Happened

Your LRC file was likely created or edited on Windows, which uses CRLF (`\r\n`) line endings. When we split by `\n` only, each line still had the `\r` at the end, which prevented the regex from matching properly because it was looking for patterns like:

```
[00:10.333] text
```

But was actually seeing:

```
[00:10.333] text\r
```

The `\r` at the end broke the regex match.

---

## Complete Fixed Function (for reference)

Here's what the beginning of parseLRC should look like after the fix:

```typescript
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
    if (/^\[[\d:.]+\]$/.test(trimmed)) continue;

    // Check if line contains timestamp [MM:SS.SS]
    const timestampRegex = /\[(\d{2,}):(\d{2})\.(\d{1,3})\]/g;
    // ... rest of function
```

The key change is just these two lines:
```typescript
const normalizedContent = lrcContent.replace(/\r/g, '');
const rawLines = normalizedContent.split('\n');
```
