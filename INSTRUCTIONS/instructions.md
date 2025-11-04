# MOBILE: Reduce Gap Between Header and Album Artwork

## Issue
On mobile, there's excessive white space between the header ("PRIMEAPE | FOUNDATION") and the album artwork. This space should be reduced for a more compact mobile layout.

## Root Cause
The `.player` container has padding and the `.player__main-area` has additional padding that creates too much vertical space on mobile devices.

---

## File to Modify

📁 **src/components/Player/Player.css**

---

## Change: Reduce mobile padding

**FIND:**
```css
@media (max-width: 768px) {
  .player {
    padding: var(--space-md);
  }

  .player__main-area {
    padding: var(--space-md) var(--space-sm); /* Add horizontal padding */
    gap: var(--space-sm); /* Reduce gap on mobile */
  }
```

**REPLACE WITH:**
```css
@media (max-width: 768px) {
  .player {
    padding: var(--space-sm) var(--space-md); /* Reduce top/bottom padding */
  }

  .player__main-area {
    padding: var(--space-sm); /* Reduce all padding */
    gap: var(--space-sm); /* Reduce gap on mobile */
  }
```

---

## Alternative: More Aggressive Reduction (If Needed)

If you want even less space on mobile, use this more aggressive version:

**FIND:**
```css
@media (max-width: 768px) {
  .player {
    padding: var(--space-md);
  }

  .player__main-area {
    padding: var(--space-md) var(--space-sm); /* Add horizontal padding */
    gap: var(--space-sm); /* Reduce gap on mobile */
  }
```

**REPLACE WITH:**
```css
@media (max-width: 768px) {
  .player {
    padding: var(--space-xs) var(--space-md); /* Minimal top/bottom padding */
  }

  .player__main-area {
    padding: 0 var(--space-sm); /* Remove vertical padding, keep horizontal */
    gap: var(--space-xs); /* Minimal gap */
  }
```

---

## CSS Variable Reference

For context, here are the spacing values being used:
- `var(--space-xs)` = 8px
- `var(--space-sm)` = 12px  
- `var(--space-md)` = 16px
- `var(--space-lg)` = 24px
- `var(--space-xl)` = 32px

---

## Testing After Fix

### Mobile (≤768px):
- [ ] Less space between header and album artwork
- [ ] Artwork still properly centered
- [ ] No content touching screen edges
- [ ] Comfortable tap targets maintained
- [ ] Lyrics button and controls not cramped

### Desktop (should be unchanged):
- [ ] No regression in desktop spacing
- [ ] Layout remains as before

---

## Recommendation

**Start with the first approach** (using `var(--space-sm)` for padding). This provides a noticeable reduction while maintaining comfortable spacing. If you want it even tighter, apply the alternative with `var(--space-xs)`.

The key changes:
1. **Player padding**: Reduced top/bottom from 16px to 12px (or 8px)
2. **Main area padding**: Reduced from 16px to 12px (or removed vertical entirely)

This will make the mobile layout feel more compact and efficient without sacrificing usability.