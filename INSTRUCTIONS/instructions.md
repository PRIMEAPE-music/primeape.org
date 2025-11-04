# CORRECTION: Mobile Auto-Scroll Box Not Appearing After Panel Close

## Issue
On mobile, after opening and closing the full-screen lyrics panel with the X button, the auto-scroll lyrics box no longer appears. This is because the panel close sets state to 'hidden', and the integrated box checks for the 'integrated' state.

## Root Cause
The mobile lyrics panel's `onClose` handler calls `toggleLyrics`, which cycles the state to 'hidden' on mobile. However, the auto-scroll box (LyricsBox component) only shows when `lyricsDisplayState === 'integrated'`, so once the state is 'hidden', the box won't appear.

## Solution
The auto-scroll box should be independent of the panel state on mobile. On mobile, we want:
- Panel toggles between 'hidden' and 'panel' 
- Auto-scroll box (integrated) should still be accessible separately

We need to decouple the mobile panel visibility from the integrated lyrics box state.

---

## File to Modify

📁 **src/hooks/useLyrics.ts**

---

## Change: Update toggle logic to allow integrated state on mobile

**FIND:**
```typescript
  // Toggle display state
  // Desktop (≥1100px): panel → integrated → panel (no hidden state)
  // Mobile (<1100px): hidden → panel → hidden (no integrated state)
  const toggleDisplayState = () => {
    setDisplayState(prev => {
      let next: LyricsDisplayState;
      
      // Check if we're on desktop or mobile
      const isDesktop = window.innerWidth >= 1100;
      
      if (isDesktop) {
        // Desktop: toggle between panel and integrated (no hidden)
        if (prev === 'panel') {
          next = 'integrated';
        } else {
          next = 'panel';
        }
      } else {
        // Mobile: toggle between hidden and panel (no integrated)
        if (prev === 'hidden') {
          next = 'panel';
        } else {
          next = 'hidden';
        }
      }

      // Save to localStorage
      localStorage.setItem('primeape_lyrics_display', next);
      
      return next;
    });
  };
```

**REPLACE WITH:**
```typescript
  // Toggle display state
  // Desktop (≥1100px): panel → integrated → panel (no hidden state)
  // Mobile (<1100px): hidden → panel → integrated → hidden
  const toggleDisplayState = () => {
    setDisplayState(prev => {
      let next: LyricsDisplayState;
      
      // Check if we're on desktop or mobile
      const isDesktop = window.innerWidth >= 1100;
      
      if (isDesktop) {
        // Desktop: toggle between panel and integrated (no hidden)
        if (prev === 'panel') {
          next = 'integrated';
        } else {
          next = 'panel';
        }
      } else {
        // Mobile: cycle through all three states
        if (prev === 'hidden') {
          next = 'panel';
        } else if (prev === 'panel') {
          next = 'integrated';
        } else {
          next = 'hidden';
        }
      }

      // Save to localStorage
      localStorage.setItem('primeape_lyrics_display', next);
      
      return next;
    });
  };
```

---

## Updated Mobile Behavior

After this fix, mobile will work as follows:

1. **First tap of lyrics button**: Shows full-screen panel (state: 'panel')
2. **Tap X button**: Closes full-screen panel (state: 'integrated')
3. **Auto-scroll box now visible**: The integrated lyrics box appears over waveform
4. **Second tap of lyrics button**: Hides auto-scroll box (state: 'hidden')
5. **Third tap**: Back to full-screen panel (state: 'panel')

This gives mobile users access to both:
- Full-screen lyrics panel for focused reading
- Compact auto-scroll box for glanceable lyrics while controlling playback

---

## Alternative Approach (If You Want Different Behavior)

If you prefer the mobile panel's X button to set state to 'integrated' instead of toggling through states, we can modify the Player component instead:

### Option B: Make X button set state to 'integrated' directly

**File:** `src/components/Player/Player.tsx`

**FIND:**
```typescript
      {/* Mobile/Tablet Lyrics Panel (< 1100px) */}
      <div className="player__mobile-lyrics-panel">
        {lyrics && lyricsDisplayState === 'panel' && (
          <LyricsPanel
            lines={lyrics.lines}
            currentTime={currentTime}
            isPlaying={isPlaying}
            isVisible={true}
            onClose={toggleLyrics}
            onLineClick={(time) => seek(time)}
            isMobile={true}
            onPlayPause={togglePlayPause}
            onPrevious={prevTrack}
            onNext={nextTrack}
            playbackState={playbackState}
          />
        )}
      </div>
```

**REPLACE WITH:**
```typescript
      {/* Mobile/Tablet Lyrics Panel (< 1100px) */}
      <div className="player__mobile-lyrics-panel">
        {lyrics && lyricsDisplayState === 'panel' && (
          <LyricsPanel
            lines={lyrics.lines}
            currentTime={currentTime}
            isPlaying={isPlaying}
            isVisible={true}
            onClose={() => {
              // On mobile, closing panel should show integrated box instead of hiding
              const isDesktop = window.innerWidth >= 1100;
              if (!isDesktop) {
                // Manually set to integrated state
                localStorage.setItem('primeape_lyrics_display', 'integrated');
                toggleLyrics(); // This will trigger re-render with new state
              } else {
                toggleLyrics();
              }
            }}
            onLineClick={(time) => seek(time)}
            isMobile={true}
            onPlayPause={togglePlayPause}
            onPrevious={prevTrack}
            onNext={nextTrack}
            playbackState={playbackState}
          />
        )}
      </div>
```

---

## Recommendation

**Use the first approach** (modifying `useLyrics.ts`) as it's cleaner and maintains consistency with how the toggle button works. This gives users a predictable cycle:

Button tap 1 → Full panel  
Button tap 2 → Auto-scroll box  
Button tap 3 → Hidden  
Button tap 4 → Full panel (cycle repeats)

---

## Testing After Fix

### Mobile Behavior:
- [ ] Tap lyrics button → Full-screen panel appears
- [ ] Tap X button → Panel closes, auto-scroll box appears
- [ ] Tap lyrics button again → Auto-scroll box disappears
- [ ] Tap lyrics button again → Full-screen panel reappears
- [ ] All three states cycle properly

### Desktop Behavior (should be unchanged):
- [ ] Panel always visible on right side
- [ ] Button toggles auto-scroll box only
- [ ] No regression in desktop functionality