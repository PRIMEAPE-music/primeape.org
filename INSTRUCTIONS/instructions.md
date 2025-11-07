I'll help you resize the merch cards to fit in a single row. Let me first check the current implementation to see what we're working with.Let me search the project knowledge for merch-related files and implementation details.Now let me check the ProductCard component to see its current dimensions:Perfect! I can see the current implementation. The merch cards currently use a 2-column grid on desktop with an `aspect-ratio: 1 / 2` for the images. To fit 4 cards in a single row with approximately **1/3 the width** and **1/8 the height**, I'll need to modify the grid layout and significantly reduce the card dimensions.

Here are the CSS modifications:

---

📁 **File: src/components/Merch/MerchSection.css**

🔍 **FIND:**
```css
/* ============================================================================
   DESKTOP GRID (≥768px)
   ============================================================================ */

.merch-section__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl);
}
```

✏️ **REPLACE WITH:**
```css
/* ============================================================================
   DESKTOP GRID (≥768px)
   ============================================================================ */

.merch-section__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 columns for single-row layout */
  gap: var(--space-md); /* Reduced gap for tighter layout */
}
```

---

📁 **File: src/components/Merch/ProductCard.css**

🔍 **FIND:**
```css
.product-card__image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 2; /* Match 1:2 ratio of product images */
  overflow: hidden;
  background-color: var(--color-bg);
}
```

✏️ **REPLACE WITH:**
```css
.product-card__image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 1; /* Much wider ratio for compact single-row layout */
  overflow: hidden;
  background-color: var(--color-bg);
}
```

---

🔍 **FIND:**
```css
.product-card__info {
  padding: var(--space-md);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
```

✏️ **REPLACE WITH:**
```css
.product-card__info {
  padding: var(--space-sm); /* Reduced padding for compact layout */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs); /* Tighter gap between name and price */
}
```

---

🔍 **FIND:**
```css
.product-card__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
}
```

✏️ **REPLACE WITH:**
```css
.product-card__name {
  font-size: var(--font-size-sm); /* Smaller text for compact cards */
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
}
```

---

🔍 **FIND:**
```css
.product-card__price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  margin: 0;
}
```

✏️ **REPLACE WITH:**
```css
.product-card__price {
  font-size: var(--font-size-base); /* Smaller price text */
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  margin: 0;
}
```

---

🔍 **FIND:**
```css
.product-card__category {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  z-index: 2;
  padding: var(--space-xs) var(--space-sm);
  background-color: rgba(0, 0, 0, 0.8);
  color: var(--color-accent);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
}
```

✏️ **REPLACE WITH:**
```css
.product-card__category {
  position: absolute;
  top: var(--space-xs); /* Adjusted for smaller cards */
  right: var(--space-xs);
  z-index: 2;
  padding: var(--space-2xs) var(--space-xs); /* Smaller padding */
  background-color: rgba(0, 0, 0, 0.8);
  color: var(--color-accent);
  font-size: 10px; /* Smaller font for compact badge */
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
}
```

---

➕ **ADD AFTER:** the tablet breakpoint section (around line 140 in MerchSection.css)

```css
/* Large desktop: Ensure 4-column layout stays readable */
@media (min-width: 1600px) {
  .merch-section__grid {
    max-width: 1400px; /* Cap maximum width for very large screens */
    margin: 0 auto;
  }
}
```

---

## Summary of Changes

These modifications will:

1. **Change the grid from 2 columns to 4 columns** - displaying all products in a single row on desktop
2. **Dramatically reduce the image height** - changing aspect ratio from `1:2` (tall) to `4:1` (wide/short)
3. **Reduce all padding and spacing** - tighter gaps between cards and less internal padding
4. **Scale down text sizes** - smaller product names, prices, and category badges
5. **Maintain responsive behavior** - mobile carousel remains unchanged

The result will be **compact, horizontal cards** that display approximately:
- **~1/3 the original width** (due to 4 columns vs 2)
- **~1/8 the original height** (due to 4:1 aspect ratio vs 1:2, plus reduced padding)

This creates a more "gallery strip" appearance perfect for a single-row merchandise showcase!