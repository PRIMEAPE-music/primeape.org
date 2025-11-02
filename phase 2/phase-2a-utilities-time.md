# PHASE 2A: UTILITIES & TIME TRACKING HOOK

## Part Overview
Create utility functions for time formatting and a custom hook for smooth time tracking. These are the foundation for displaying current playback time and track duration.

## What Gets Created
- `src/utils/formatTime.ts` - Time formatting utilities
- `src/hooks/useAudioTime.ts` - Custom hook for time tracking with requestAnimationFrame

## Why These First?
These utilities are dependencies for all player components. By creating them first, we can use them immediately when building the UI components.

## Step-by-Step Instructions

### Step 1: Create Time Formatting Utilities

**File:** `src/utils/formatTime.ts`

This file contains pure functions for time conversion:

```typescript
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
```

**Function Explanations:**

**formatTime:**
- Takes seconds (can include decimals like 45.6)
- Returns formatted string like "3:45"
- Handles edge cases: NaN, negative numbers, Infinity
- Uses `Math.floor()` to avoid showing decimals in display
- `padStart(2, '0')` ensures seconds always show 2 digits (e.g., "0:05" not "0:5")

**parseTime:**
- Inverse of formatTime
- Converts "3:45" back to 225 seconds
- Useful for future features (like timeline markers)

**Edge Case Handling:**
```typescript
formatTime(NaN)       // "0:00"
formatTime(-10)       // "0:00"
formatTime(Infinity)  // "0:00"
formatTime(125.9)     // "2:05" (rounds down)
formatTime(0)         // "0:00"
formatTime(3599)      // "59:59"
formatTime(3600)      // "60:00" (handles hours as "60:00", not "1:00:00")
```

### Step 2: Create Time Tracking Hook

**File:** `src/hooks/useAudioTime.ts`

This custom hook provides smooth time updates using requestAnimationFrame:

```typescript
import { useState, useEffect, useRef } from 'react';

/**
 * useAudioTime Hook
 * 
 * Tracks audio currentTime with high-frequency updates using requestAnimationFrame.
 * More accurate than relying solely on 'timeupdate' events (which fire ~4x per second).
 * 
 * @param audioElement - HTMLAudioElement to track
 * @param isPlaying - Whether audio is currently playing
 * @returns Current time in seconds
 */
export function useAudioTime(
  audioElement: HTMLAudioElement | null,
  isPlaying: boolean
): number {
  const [currentTime, setCurrentTime] = useState(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement || !isPlaying) {
      // Cancel animation frame if not playing
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    // Update time on every frame while playing
    const updateTime = () => {
      if (audioElement && !audioElement.paused) {
        setCurrentTime(audioElement.currentTime);
        rafIdRef.current = requestAnimationFrame(updateTime);
      }
    };

    rafIdRef.current = requestAnimationFrame(updateTime);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [audioElement, isPlaying]);

  return currentTime;
}
```

**Hook Explanation:**

**Why requestAnimationFrame?**
- Browser's `timeupdate` event only fires ~4 times per second
- requestAnimationFrame runs at 60fps (60 times per second)
- Result: Smooth progress bar animation, no jittery updates

**How It Works:**
1. When `isPlaying` becomes true, starts animation loop
2. Every frame (~16ms), reads `audioElement.currentTime`
3. Updates state, triggering component re-render
4. Schedules next frame update
5. When `isPlaying` becomes false, cancels animation loop

**Memory Management:**
- `rafIdRef` stores the animation frame ID
- Cleanup function cancels animation on unmount
- Prevents memory leaks from orphaned animation frames

**Performance Note:**
This hook causes frequent re-renders (60fps) but ONLY updates the component using it (not entire tree). React's reconciliation is fast enough to handle this.

**Usage Example (for your reference):**
```typescript
// In a component:
const audioElement = useRef<HTMLAudioElement>(null);
const [isPlaying, setIsPlaying] = useState(false);
const currentTime = useAudioTime(audioElement.current, isPlaying);

// currentTime updates ~60 times per second while playing
```

## Code Patterns Used

### Pattern 1: Pure Utility Functions
```typescript
// No side effects, no state, just input → output
export function formatTime(seconds: number): string {
  // Pure transformation
}
```

**Benefits:**
- Easy to test
- Predictable behavior
- Can be used anywhere
- No dependencies

### Pattern 2: Ref for Non-State Values
```typescript
const rafIdRef = useRef<number | null>(null);
```

**Why useRef instead of useState?**
- Animation frame ID doesn't need to trigger re-renders
- Changing it shouldn't cause component updates
- useRef persists between renders without triggering re-render

### Pattern 3: Animation Loop with Cleanup
```typescript
useEffect(() => {
  const animate = () => {
    // Do work
    rafId.current = requestAnimationFrame(animate);
  };
  
  rafId.current = requestAnimationFrame(animate);
  
  return () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
  };
}, [dependencies]);
```

**This pattern:**
- Starts animation loop
- Cleans up on unmount
- Restarts if dependencies change
- Prevents memory leaks

## Validation Checklist

After completing Part 2A, verify:

### Files Created
- [ ] `src/utils/formatTime.ts` exists
- [ ] `src/hooks/useAudioTime.ts` exists

### TypeScript Validation
Run to check for type errors:
```bash
npx tsc --noEmit
```

Should complete with no errors.

### Unit Testing (Manual)

**Test formatTime in browser console:**
```javascript
import { formatTime } from './src/utils/formatTime.ts';

console.log(formatTime(0));      // "0:00"
console.log(formatTime(5));      // "0:05"
console.log(formatTime(65));     // "1:05"
console.log(formatTime(125.6));  // "2:05"
console.log(formatTime(3599));   // "59:59"
console.log(formatTime(NaN));    // "0:00"
console.log(formatTime(-10));    // "0:00"
```

**Expected Results:**
- All outputs match comments
- No errors thrown
- Seconds always have 2 digits

### Code Quality Check
- [ ] Both files use explicit TypeScript types
- [ ] JSDoc comments present
- [ ] No `any` types
- [ ] Proper edge case handling
- [ ] Cleanup function in useEffect

### Import/Export Check
- [ ] formatTime is exported
- [ ] parseTime is exported
- [ ] useAudioTime is exported
- [ ] All imports are from 'react'

## Common Issues & Solutions

### Issue 1: TypeScript error on useRef
**Problem:** "Type 'number | null' is not assignable to type 'number'"
**Solution:** Use `useRef<number | null>(null)` with explicit type

### Issue 2: Animation doesn't stop
**Problem:** Animation continues after component unmounts
**Solution:** Verify cleanup function calls `cancelAnimationFrame(rafIdRef.current)`

### Issue 3: formatTime shows decimals
**Problem:** Output like "2:05.5"
**Solution:** Ensure `Math.floor()` is used on both minutes and seconds

### Issue 4: padStart not working
**Problem:** Shows "0:5" instead of "0:05"
**Solution:** Call `.toString()` before `.padStart()`: `secs.toString().padStart(2, '0')`

### Issue 5: parseTime returns NaN
**Problem:** Invalid input breaks parsing
**Solution:** Add error handling:
```typescript
export function parseTime(timeString: string): number {
  if (!timeString || !timeString.includes(':')) return 0;
  const [mins, secs] = timeString.split(':').map(Number);
  if (isNaN(mins) || isNaN(secs)) return 0;
  return (mins * 60) + secs;
}
```

## Testing the Hook (Preview)

You won't be able to fully test useAudioTime until Part 2B (when we create the audio element), but you can verify:

1. **No TypeScript errors** - Hook compiles successfully
2. **Imports work** - No missing dependencies
3. **Pattern is correct** - useEffect cleanup is present

## Why This Order?

Building utilities first means:
- ✅ No circular dependencies
- ✅ Easy to test in isolation
- ✅ Can use immediately in components
- ✅ Pure functions don't depend on anything else

## What's Next?

With formatTime and useAudioTime ready, we can now:
- Display time in MM:SS format
- Track playback position smoothly
- Build the audio player hook (Part 2B)

## Performance Notes

**formatTime:** 
- Very fast (simple math operations)
- No allocations (string concatenation)
- Safe to call 60 times per second

**useAudioTime:**
- Runs at 60fps while playing
- Minimal overhead (one property read per frame)
- Properly cleaned up (no memory leaks)

## Accessibility Notes

**Time Display:**
- Always show 2-digit seconds for consistency
- Screen readers will read "3:45" as "three forty-five"
- Consider adding ARIA labels in components: `aria-label="3 minutes 45 seconds"`

## Next Step

Proceed to **Part 2B: Core Audio Player Hook** (`phase-2b-audio-hook.md`)

In Part 2B, we'll create the main audio player hook that:
- Manages HTMLAudioElement
- Sets up Web Audio API context
- Handles play/pause/seek
- Manages track loading
- Handles all audio events

Part 2B is the most complex part of Phase 2, but with these utilities ready, it will be much cleaner!
