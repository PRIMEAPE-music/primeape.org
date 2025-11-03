# PHASE 4C: AUTO-SCROLL & SYNC

## Claude Code Prompt

```
I'm implementing Phase 4C (Lyrics Auto-Scroll & Sync) for the PRIMEAPE music website.

Please implement:
1. Lyrics sync engine
2. Auto-scroll logic
3. Smooth scroll animations
4. Performance optimizations

Context:
- Phase 4A complete (parser ready)
- Phase 4B complete (display components ready)
- Need to add real-time synchronization

This is the final Phase 4 sub-phase.
```

---

## Overview

**Sub-Phase:** 4C  
**Feature:** Auto-Scroll & Synchronization  
**Complexity:** Moderate  
**Time Estimate:** 1 hour

**What Will Be Built:**
- Lyrics synchronization engine
- Auto-scroll with smooth animations
- Manual scroll detection and pause
- Performance optimizations

**Dependencies:**
- Phase 4A complete (parser)
- Phase 4B complete (display components)

---

## Files to Create

```
src/hooks/useLyricsSync.ts
```

## Files to Modify

```
src/components/Lyrics/LyricsPanel.tsx (add sync logic)
src/components/Lyrics/LyricsBox.tsx (improve auto-scroll)
```

---

## Implementation Instructions

### File: `src/hooks/useLyricsSync.ts`

**📁 CREATE NEW FILE:**

```typescript
import { useState, useEffect, useRef } from 'react';
import type { LyricLine } from '@/types';
import { getCurrentLineIndex, getUpcomingLineIndex } from '@/utils/lrcParser';

interface UseLyricsSyncReturn {
  currentLineIndex: number;
  upcomingLineIndex: number;
  isAutoScrollEnabled: boolean;
  setAutoScrollEnabled: (enabled: boolean) => void;
}

/**
 * useLyricsSync Hook
 * 
 * Manages lyrics synchronization and auto-scroll behavior
 * 
 * @param lines - Array of lyric lines
 * @param currentTime - Current playback time
 * @param isPlaying - Whether audio is playing
 * @returns Current line index and auto-scroll state
 */
export function useLyricsSync(
  lines: LyricLine[],
  currentTime: number,
  isPlaying: boolean
): UseLyricsSyncReturn {
  const [isAutoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const previousLineRef = useRef(-1);
  const userScrollTimerRef = useRef<number | null>(null);

  // Get current and upcoming line indices
  const currentLineIndex = getCurrentLineIndex(lines, currentTime);
  const upcomingLineIndex = getUpcomingLineIndex(lines, currentTime);

  // Re-enable auto-scroll when line changes and enough time has passed
  useEffect(() => {
    if (currentLineIndex !== previousLineRef.current) {
      previousLineRef.current = currentLineIndex;
      
      // Re-enable auto-scroll on line change
      // This allows user to manually scroll but auto-scroll resumes at next line
      if (userScrollTimerRef.current) {
        window.clearTimeout(userScrollTimerRef.current);
        userScrollTimerRef.current = null;
      }
      
      setAutoScrollEnabled(true);
    }
  }, [currentLineIndex]);

  // Disable auto-scroll when user manually scrolls
  const handleUserScroll = () => {
    setAutoScrollEnabled(false);
    
    // Re-enable auto-scroll after 3 seconds of no user scroll
    if (userScrollTimerRef.current) {
      window.clearTimeout(userScrollTimerRef.current);
    }
    
    userScrollTimerRef.current = window.setTimeout(() => {
      setAutoScrollEnabled(true);
    }, 3000);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (userScrollTimerRef.current) {
        window.clearTimeout(userScrollTimerRef.current);
      }
    };
  }, []);

  return {
    currentLineIndex,
    upcomingLineIndex,
    isAutoScrollEnabled,
    setAutoScrollEnabled: (enabled: boolean) => {
      setAutoScrollEnabled(enabled);
      if (userScrollTimerRef.current) {
        window.clearTimeout(userScrollTimerRef.current);
        userScrollTimerRef.current = null;
      }
    },
  };
}

/**
 * Smooth scroll element into view
 * Uses CSS smooth scrolling with fallback
 * 
 * @param element - Element to scroll into view
 * @param container - Container element (optional)
 */
export function smoothScrollToElement(
  element: HTMLElement,
  container?: HTMLElement | null
) {
  // Modern browsers: use smooth scroll
  if ('scrollBehavior' in document.documentElement.style) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  } else {
    // Fallback for older browsers
    element.scrollIntoView({
      block: 'center',
      inline: 'nearest',
    });
  }
}
```

---

### File: `src/components/Lyrics/LyricsPanel.tsx`

**🔍 FIND:**
```typescript
import React, { useRef, useEffect } from 'react';
import type { LyricLine as LyricLineType } from '@/types';
import { getCurrentLineIndex } from '@/utils/lrcParser';
import LyricLine from './LyricLine';
import './LyricsPanel.css';
```

**✏️ REPLACE WITH:**
```typescript
import React, { useRef, useEffect, useState } from 'react';
import type { LyricLine as LyricLineType } from '@/types';
import { useLyricsSync, smoothScrollToElement } from '@/hooks/useLyricsSync';
import LyricLine from './LyricLine';
import './LyricsPanel.css';
```

**🔍 FIND:**
```typescript
interface LyricsPanelProps {
  lines: LyricLineType[];
  currentTime: number;
  isVisible: boolean;
  onClose: () => void;
  onLineClick?: (time: number) => void;
}
```

**✏️ REPLACE WITH:**
```typescript
interface LyricsPanelProps {
  lines: LyricLineType[];
  currentTime: number;
  isPlaying: boolean;
  isVisible: boolean;
  onClose: () => void;
  onLineClick?: (time: number) => void;
}
```

**🔍 FIND:**
```typescript
const LyricsPanel: React.FC<LyricsPanelProps> = ({
  lines,
  currentTime,
  isVisible,
  onClose,
  onLineClick,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const currentLineRef = useRef<HTMLDivElement>(null);

  const currentLineIndex = getCurrentLineIndex(lines, currentTime);

  // Auto-scroll to current line
  useEffect(() => {
    if (!isVisible || currentLineIndex === -1) return;

    const panel = panelRef.current;
    const currentLine = panel?.querySelector('.lyric-line--current');

    if (panel && currentLine) {
      // Scroll current line into view (centered)
      currentLine.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLineIndex, isVisible]);
```

**✏️ REPLACE WITH:**
```typescript
const LyricsPanel: React.FC<LyricsPanelProps> = ({
  lines,
  currentTime,
  isPlaying,
  isVisible,
  onClose,
  onLineClick,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Use sync hook
  const {
    currentLineIndex,
    upcomingLineIndex,
    isAutoScrollEnabled,
    setAutoScrollEnabled,
  } = useLyricsSync(lines, currentTime, isPlaying);

  // Detect user scroll
  const handleScroll = () => {
    isUserScrollingRef.current = true;
    setAutoScrollEnabled(false);

    // Re-enable auto-scroll after 3 seconds of no scrolling
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      isUserScrollingRef.current = false;
      setAutoScrollEnabled(true);
    }, 3000);
  };

  // Auto-scroll to current line
  useEffect(() => {
    if (!isVisible || currentLineIndex === -1 || !isAutoScrollEnabled) return;

    const panel = panelRef.current;
    const currentLine = panel?.querySelector('.lyric-line--current') as HTMLElement;

    if (panel && currentLine && !isUserScrollingRef.current) {
      smoothScrollToElement(currentLine, panel);
    }
  }, [currentLineIndex, isVisible, isAutoScrollEnabled]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
```

**🔍 FIND:**
```typescript
        {/* Lyrics content */}
        <div className="lyrics-panel__content">
```

**✏️ REPLACE WITH:**
```typescript
        {/* Lyrics content */}
        <div className="lyrics-panel__content" onScroll={handleScroll}>
```

**🔍 FIND:**
```typescript
            lines.map((line, index) => (
              <LyricLine
                key={index}
                line={line}
                isCurrent={index === currentLineIndex}
                isUpcoming={index === currentLineIndex + 1}
                onClick={() => onLineClick?.(line.time)}
              />
            ))
```

**✏️ REPLACE WITH:**
```typescript
            lines.map((line, index) => (
              <LyricLine
                key={index}
                line={line}
                isCurrent={index === currentLineIndex}
                isUpcoming={index === upcomingLineIndex}
                onClick={() => onLineClick?.(line.time)}
              />
            ))
```

---

### File: `src/components/Lyrics/LyricsBox.tsx`

**🔍 FIND:**
```typescript
import React, { useRef, useEffect } from 'react';
import type { LyricLine as LyricLineType } from '@/types';
import { getCurrentLineIndex } from '@/utils/lrcParser';
import './LyricsBox.css';
```

**✏️ REPLACE WITH:**
```typescript
import React, { useRef, useEffect } from 'react';
import type { LyricLine as LyricLineType } from '@/types';
import { useLyricsSync, smoothScrollToElement } from '@/hooks/useLyricsSync';
import './LyricsBox.css';
```

**🔍 FIND:**
```typescript
interface LyricsBoxProps {
  lines: LyricLineType[];
  currentTime: number;
  isVisible: boolean;
}
```

**✏️ REPLACE WITH:**
```typescript
interface LyricsBoxProps {
  lines: LyricLineType[];
  currentTime: number;
  isPlaying: boolean;
  isVisible: boolean;
}
```

**🔍 FIND:**
```typescript
const LyricsBox: React.FC<LyricsBoxProps> = ({
  lines,
  currentTime,
  isVisible,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);

  const currentLineIndex = getCurrentLineIndex(lines, currentTime);

  // Auto-scroll to keep current line centered
  useEffect(() => {
    if (!isVisible || currentLineIndex === -1) return;

    const box = boxRef.current;
    const currentLine = box?.querySelector('.lyrics-box__line--current');

    if (box && currentLine) {
      currentLine.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLineIndex, isVisible]);
```

**✏️ REPLACE WITH:**
```typescript
const LyricsBox: React.FC<LyricsBoxProps> = ({
  lines,
  currentTime,
  isPlaying,
  isVisible,
}) => {
  const boxRef = useRef<HTMLDivElement>(null);

  // Use sync hook (auto-scroll always enabled for box)
  const { currentLineIndex } = useLyricsSync(lines, currentTime, isPlaying);

  // Auto-scroll to keep current line centered
  useEffect(() => {
    if (!isVisible || currentLineIndex === -1) return;

    const box = boxRef.current;
    const currentLine = box?.querySelector('.lyrics-box__line--current') as HTMLElement;

    if (box && currentLine) {
      smoothScrollToElement(currentLine, box);
    }
  }, [currentLineIndex, isVisible]);
```

---

### File: `src/components/Player/Player.tsx`

**🔍 FIND:**
```typescript
      {/* Integrated Lyrics Box */}
      {lyrics && (
        <LyricsBox
          lines={lyrics.lines}
          currentTime={currentTime}
          isVisible={lyricsDisplayState === 'integrated'}
        />
      )}
```

**✏️ REPLACE WITH:**
```typescript
      {/* Integrated Lyrics Box */}
      {lyrics && (
        <LyricsBox
          lines={lyrics.lines}
          currentTime={currentTime}
          isPlaying={isPlaying}
          isVisible={lyricsDisplayState === 'integrated'}
        />
      )}
```

**🔍 FIND:**
```typescript
      {/* Lyrics Panel */}
      {lyrics && (
        <LyricsPanel
          lines={lyrics.lines}
          currentTime={currentTime}
          isVisible={lyricsDisplayState === 'panel'}
          onClose={toggleLyrics}
          onLineClick={(time) => seek(time)}
        />
      )}
```

**✏️ REPLACE WITH:**
```typescript
      {/* Lyrics Panel */}
      {lyrics && (
        <LyricsPanel
          lines={lyrics.lines}
          currentTime={currentTime}
          isPlaying={isPlaying}
          isVisible={lyricsDisplayState === 'panel'}
          onClose={toggleLyrics}
          onLineClick={(time) => seek(time)}
        />
      )}
```

---

## Validation Checklist

### Auto-Scroll:
- [ ] Current line stays centered in panel
- [ ] Current line stays centered in box
- [ ] Smooth transitions (no jerky jumps)
- [ ] Works while playing
- [ ] Stops when paused (optional)

### User Interaction:
- [ ] Manual scroll pauses auto-scroll
- [ ] Auto-scroll resumes after 3 seconds
- [ ] Auto-scroll resumes on next line change
- [ ] Click line to seek works
- [ ] Seeking to clicked line highlights correctly

### Performance:
- [ ] No lag or stuttering
- [ ] Smooth 60fps scrolling
- [ ] No memory leaks
- [ ] Works with 100+ line lyrics files

### Sync Accuracy:
- [ ] Current line highlights at correct time
- [ ] Highlights within 100ms of timestamp
- [ ] Handles rapid line changes (< 1s apart)
- [ ] No flickering or double highlights

---

## Testing Instructions

### Test 1: Basic Sync
1. Play track with timestamped lyrics
2. Watch current line highlight
3. Verify it changes at correct timestamps
4. Check that scroll follows current line

### Test 2: Manual Scroll Override
1. Open lyrics panel
2. Play track
3. Manually scroll to different position
4. Verify auto-scroll pauses
5. Wait 3 seconds
6. Verify auto-scroll resumes

### Test 3: Rapid Line Changes
Create LRC file with rapid changes:
```
[00:10.00]Line one
[00:10.50]Line two (0.5s later)
[00:11.00]Line three (0.5s later)
```
Verify highlights update correctly without flickering.

### Test 4: Seek via Click
1. Open lyrics panel
2. Click line in middle of song
3. Verify audio seeks to that timestamp
4. Verify that line highlights

### Test 5: Long Lyrics File
1. Create LRC with 100+ lines
2. Play through song
3. Verify no performance issues
4. Scroll should remain smooth

---

## Performance Optimizations

### Implemented Optimizations:
- ✅ Debounced scroll detection (3s timeout)
- ✅ Smooth CSS animations (GPU accelerated)
- ✅ Minimal re-renders (React.memo on LyricLine)
- ✅ Efficient line index calculation
- ✅ Cleanup timers on unmount

### Optional Further Optimizations:
- Virtual scrolling for 500+ line files
- IntersectionObserver for visibility
- RequestAnimationFrame for scroll updates

---

## Known Issues & Solutions

### Issue 1: Scroll Fights User
**Problem:** Auto-scroll interrupts user scrolling  
**Solution:** Detect user scroll and pause for 3 seconds

### Issue 2: Highlights Flicker
**Problem:** Rapid line changes cause flickering  
**Solution:** Use CSS transitions, React.memo

### Issue 3: Scroll Too Aggressive
**Problem:** Box scrolls on every tiny change  
**Solution:** Only scroll when line actually changes

### Issue 4: Memory Leak
**Problem:** Timers not cleared  
**Solution:** Cleanup in useEffect return

---

## Completion Criteria

Phase 4C (and all of Phase 4) is complete when:
- ✅ Auto-scroll works smoothly
- ✅ Manual scroll override works
- ✅ Sync accuracy within 100ms
- ✅ No performance issues
- ✅ All 3 display states functional
- ✅ Works on desktop and mobile
- ✅ No TypeScript errors
- ✅ No console warnings

---

## Phase 4 Complete! 🎉

You've now implemented:
- ✅ LRC file parsing
- ✅ SRT to LRC conversion
- ✅ 3-state lyrics display (hidden/panel/box)
- ✅ Auto-scrolling with sync
- ✅ Current line highlighting
- ✅ Mobile-responsive design

**Your lyrics system now:**
- Parses timestamped LRC files
- Displays lyrics in 3 different modes
- Auto-scrolls smoothly
- Highlights current line in real-time
- Handles user interaction intelligently
- Works perfectly on mobile and desktop

**Next:** Phase 5 - Tracklist & Navigation

---

# END OF PHASE 4C INSTRUCTIONS

## Summary

Phase 4 gave you a complete, professional lyrics system:

| Sub-Phase | What You Built | Time |
|-----------|----------------|------|
| 4A | LRC Parser & Utilities | 45min |
| 4B | Display Components | 1.5hr |
| 4C | Auto-Scroll & Sync | 1hr |

**Total Time:** 3-4 hours  
**Total Features:** Complete synchronized lyrics system

Great work! 🎵📝
