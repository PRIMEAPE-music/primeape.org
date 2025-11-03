# MAKE WAVEFORM PROGRESS BAR 50% WIDER

## Objective
Increase the waveform progress bar width by 50% (from 400px to 600px).

---

## File: src/components/Player/WaveformBar.css

📁 **File:** `src/components/Player/WaveformBar.css`

🔍 **FIND:**
```css
.waveform-bar {
  position: relative;
  width: 100%;
  max-width: 400px; /* ADDED to match artwork width */
  height: 60px;
  margin: 0 auto; /* ADDED for centering */
  cursor: pointer;
  user-select: none;
  touch-action: none;
  border-radius: var(--radius-sm);
  overflow: hidden;
}
```

✏️ **REPLACE WITH:**
```css
.waveform-bar {
  position: relative;
  width: 100%;
  max-width: 600px; /* Increased from 400px (50% wider) */
  height: 60px;
  margin: 0 auto; /* ADDED for centering */
  cursor: pointer;
  user-select: none;
  touch-action: none;
  border-radius: var(--radius-sm);
  overflow: hidden;
}
```

---

## Additional Check: Parent Container Width

If the waveform STILL doesn't get wider after this change, we need to also check the parent Player container. The Player component might have a `max-width` that's constraining everything inside it.

### File: src/components/Player/Player.css

Search for:
- `.player` class with `max-width` property
- Any container that wraps the waveform

If you find something like:
```css
.player {
  max-width: 800px;
}
```

You may need to increase that as well to accommodate the wider waveform.

---

## Validation Checklist

After applying:
- [ ] Waveform bar is visibly wider than before
- [ ] Waveform is still centered in the player
- [ ] Waveform doesn't overflow the viewport on desktop
- [ ] Mobile view still shows 100% width (responsive)
- [ ] Click/drag seeking still works across the full width
- [ ] Waveform bars render properly across the new width

---

## If Still Not Working

If the waveform STILL doesn't change width after applying the above, please:

1. **Inspect the element** in browser DevTools
2. Look at the computed width value
3. Check which CSS rule is setting the actual width
4. Share a screenshot or the computed styles

The issue is likely a **parent container** also constraining the width. Common culprits:
- `.player` component wrapper
- `.player-section__container`
- Any max-width on a parent element

Let me know if you need help tracking down the parent constraint!