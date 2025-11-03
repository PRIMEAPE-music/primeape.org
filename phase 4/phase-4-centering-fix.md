# PHASE 4 - FLOATING BOX CENTERING FIX

## Issue
- Album artwork not centered by default
- Lyrics box appears but layout not quite centered
- Tracks placeholder (invisible) is affecting layout

## Quick Fix Instructions

### File: `src/components/Player/Player.css`

**🔍 FIND:**
```css
  /* Placeholder for tracks box - invisible but maintains layout */
  .player__floating-box--tracks {
    width: 320px;
    height: 750px;
    visibility: hidden; /* Hidden but takes up space */
  }
```

**✏️ REPLACE WITH:**
```css
  /* Placeholder for tracks box - completely hidden until Phase 5 */
  .player__floating-box--tracks {
    display: none; /* Completely hidden, no space taken */
  }
```

**🔍 FIND:**
```css
.player__main-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl); /* 32px between boxes and artwork */
  padding: var(--space-xl) 0;
  position: relative;
  min-height: 800px;
}
```

**✏️ REPLACE WITH:**
```css
.player__main-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl); /* 32px between boxes and artwork */
  padding: var(--space-xl) 0;
  position: relative;
  min-height: 800px;
  width: 100%;
}

/* When no lyrics showing - center artwork */
.player__main-area:not(:has(.player__floating-box--lyrics)) {
  justify-content: center;
}

/* When lyrics showing - adjust to keep visual balance */
.player__main-area:has(.player__floating-box--lyrics) {
  justify-content: center;
  padding-left: 160px; /* Half of lyrics box width to balance */
}
```

---

## Alternative Fix (If Above Doesn't Work)

If the `:has()` selector doesn't work in your browser, use this approach instead:

### File: `src/components/Player/Player.tsx`

**🔍 FIND:**
```typescript
      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
```

**✏️ REPLACE WITH:**
```typescript
      {/* Player Main Area with Floating Boxes */}
      <div className={`player__main-area ${lyrics && lyricsDisplayState === 'panel' ? 'player__main-area--with-lyrics' : ''}`}>
```

### Then in `src/components/Player/Player.css`

**🔍 FIND:**
```css
.player__main-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl);
  padding: var(--space-xl) 0;
  position: relative;
  min-height: 800px;
}
```

**✏️ REPLACE WITH:**
```css
.player__main-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl);
  padding: var(--space-xl) 0;
  position: relative;
  min-height: 800px;
  width: 100%;
}

/* Default: Artwork centered */
.player__main-area .artwork {
  margin: 0 auto;
}

/* When lyrics visible: Offset to keep artwork optically centered */
.player__main-area--with-lyrics {
  padding-left: 176px; /* (320px box + 32px gap) / 2 */
}

.player__main-area--with-lyrics .artwork {
  margin: 0;
}
```

---

## Even Simpler Fix (Recommended)

Just remove the placeholder entirely until Phase 5:

### File: `src/components/Player/Player.tsx`

**🔍 FIND:**
```typescript
      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
        {/* Placeholder for Tracks Box (Phase 5) */}
        <div className="player__floating-box player__floating-box--tracks">
          {/* Tracks box will go here in Phase 5 */}
        </div>

        {/* Album Artwork with Equalizer */}
        <Artwork 
```

**✏️ REPLACE WITH:**
```typescript
      {/* Player Main Area with Floating Boxes */}
      <div className="player__main-area">
        {/* Album Artwork with Equalizer */}
        <Artwork 
```

**🔍 FIND (remove the order styles):**
```css
  .player__floating-box--tracks {
    order: 1; /* Left side */
  }

  .player__floating-box--lyrics {
    order: 3; /* Right side */
  }

  /* Artwork in center */
  .player__main-area .artwork {
    order: 2;
    align-self: center;
  }
```

**✏️ REPLACE WITH:**
```css
  .player__floating-box--lyrics {
    /* No order needed - just flexbox natural flow */
  }

  /* Artwork naturally centers */
  .player__main-area .artwork {
    align-self: center;
  }
```

---

## Testing After Fix

1. **No lyrics showing:**
   - [ ] Artwork perfectly centered on screen
   
2. **Lyrics showing:**
   - [ ] Artwork still looks centered (or slightly left of center)
   - [ ] Lyrics box to the right
   - [ ] Overall composition feels balanced

3. **Toggle lyrics off:**
   - [ ] Artwork returns to perfect center

---

## Why This Happened

The invisible placeholder was taking up 320px of space on the left, which pushed everything to the right. By either:
1. Hiding it completely (`display: none`)
2. Adding offset padding to compensate
3. Removing it entirely (recommended)

The layout will be properly centered.

**Recommendation:** Use the "Even Simpler Fix" - just remove the placeholder entirely. We'll add the tracks box properly in Phase 5.
