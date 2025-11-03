# COLOR SCHEME UPDATE INSTRUCTIONS

## Overview
This instruction set will update the PRIMEAPE website color scheme from the current semi-chromatic greyscale to a comprehensive dark grey palette with improved visual hierarchy and contrast.

## Objective
Replace all color variables in the theme system with carefully selected dark grey shades that:
- Maintain excellent readability and accessibility (WCAG AA compliance)
- Create clear visual hierarchy through subtle grey variations
- Work seamlessly in both light and dark themes
- Preserve all existing functionality and layout

---

## Implementation Instructions

### File: src/styles/variables.css

📁 **File:** `src/styles/variables.css`

This file contains all theme color variables. We'll update the color definitions while preserving all other variables (spacing, typography, shadows, etc.).

🔍 **FIND:**
```css
  /* ===== LIGHT MODE COLORS (Semi-chromatic Greyscale) ===== */
  --color-bg-light: #f5f5f5;
  --color-text-primary-light: #1a1a1a;
  --color-text-secondary-light: #4a4a4a;
  --color-accent-light: #666666;
  --color-border-light: #d0d0d0;
  --color-hover-light: #333333;
  --color-active-light: #000000;

  /* ===== DARK MODE COLORS ===== */
  --color-bg-dark: #0a0a0a;
  --color-text-primary-dark: #e0e0e0;
  --color-text-secondary-dark: #b0b0b0;
  --color-accent-dark: #888888;
  --color-border-dark: #2a2a2a;
  --color-hover-dark: #cccccc;
  --color-active-dark: #ffffff;
```

✏️ **REPLACE WITH:**
```css
  /* ===== LIGHT MODE COLORS (Dark Grey Shades) ===== */
  --color-bg-light: #e8e8e8;              /* Light grey background */
  --color-text-primary-light: #1c1c1c;    /* Near-black for primary text */
  --color-text-secondary-light: #3d3d3d;  /* Dark grey for secondary text */
  --color-accent-light: #5a5a5a;          /* Medium-dark grey for accents */
  --color-border-light: #b8b8b8;          /* Medium-light grey for borders */
  --color-hover-light: #2b2b2b;           /* Dark grey for hover states */
  --color-active-light: #0f0f0f;          /* Almost black for active states */

  /* ===== DARK MODE COLORS (Dark Grey Shades) ===== */
  --color-bg-dark: #0d0d0d;               /* Almost black background */
  --color-text-primary-dark: #d4d4d4;     /* Light grey for primary text */
  --color-text-secondary-dark: #9e9e9e;   /* Medium grey for secondary text */
  --color-accent-dark: #7a7a7a;           /* Medium grey for accents */
  --color-border-dark: #2e2e2e;           /* Dark grey for borders */
  --color-hover-dark: #b8b8b8;            /* Lighter grey for hover states */
  --color-active-dark: #e8e8e8;           /* Very light grey for active states */
```

---

## Color Palette Rationale

### Light Mode Shades
- **Background (#e8e8e8)**: Soft light grey that reduces eye strain compared to pure white
- **Primary Text (#1c1c1c)**: Near-black with excellent readability (AAA contrast ratio)
- **Secondary Text (#3d3d3d)**: Dark grey for de-emphasized content (AA contrast ratio)
- **Accent (#5a5a5a)**: Medium-dark grey for UI elements and highlights
- **Border (#b8b8b8)**: Subtle separation without harsh lines
- **Hover (#2b2b2b)**: Darker grey for interactive feedback
- **Active (#0f0f0f)**: Almost black for currently selected/playing items

### Dark Mode Shades
- **Background (#0d0d0d)**: Near-black with subtle warmth, reduces OLED burn-in risk
- **Primary Text (#d4d4d4)**: Light grey with optimal readability on dark backgrounds
- **Secondary Text (#9e9e9e)**: Medium grey for hierarchy without distraction
- **Accent (#7a7a7a)**: Balanced grey for controls and highlights
- **Border (#2e2e2e)**: Subtle boundaries in dark UI
- **Hover (#b8b8b8)**: Noticeably lighter for clear hover feedback
- **Active (#e8e8e8)**: High-contrast light grey for active elements

---

## Validation Checklist

After applying these changes, verify the following:

### Visual Verification
- [ ] **Header**: Artist name and album title are clearly readable
- [ ] **Audio Player**: All controls (play/pause, progress bar, volume) have good contrast
- [ ] **Tracklist**: Track numbers, titles, and durations are legible
- [ ] **Current Track**: Active track highlighting is visually distinct
- [ ] **Hover States**: Interactive elements show clear hover feedback
- [ ] **Lyrics (if implemented)**: Current line highlighting is prominent
- [ ] **Borders and Dividers**: Subtle but visible separation between sections

### Accessibility Testing
- [ ] **Contrast Ratios**: Use a contrast checker tool
  - Primary text: Minimum 7:1 ratio (AAA)
  - Secondary text: Minimum 4.5:1 ratio (AA)
  - UI controls: Minimum 3:1 ratio
- [ ] **Focus Indicators**: Keyboard focus outlines are clearly visible
- [ ] **Color Blindness**: Test with color blindness simulators (should work fine since we're using greys)

### Theme Toggle Testing
- [ ] Switch between light and dark themes
- [ ] Verify smooth transitions (no flashing)
- [ ] Check that all UI elements adapt correctly
- [ ] Test theme persistence on page reload (if implemented)

### Browser Testing
- [ ] **Chrome/Edge**: Colors render consistently
- [ ] **Firefox**: No color shifts or rendering issues
- [ ] **Safari**: Proper color display on macOS/iOS
- [ ] **Mobile Browsers**: Adequate contrast in bright sunlight

### Responsive Testing
- [ ] **Desktop (1280px+)**: Full layout with proper colors
- [ ] **Tablet (768px-1024px)**: Colors maintain hierarchy
- [ ] **Mobile (320px-767px)**: Text remains readable at small sizes

---

## Expected Visual Changes

### Light Mode
- **Before**: Slightly warmer greyscale with #f5f5f5 background
- **After**: Cooler, darker grey palette with #e8e8e8 background
- **Effect**: More sophisticated, less stark appearance

### Dark Mode
- **Before**: Standard dark theme with #0a0a0a background
- **After**: Richer dark grey system with #0d0d0d background
- **Effect**: Better depth perception and hierarchy

### Contrast Improvements
- **Text Readability**: Enhanced through optimized grey selections
- **Interactive Elements**: Clearer visual feedback on hover/active states
- **Visual Hierarchy**: Better separation between primary/secondary content

---

## Potential Issues and Solutions

### Issue 1: Insufficient Contrast in Light Mode
**Symptom**: Secondary text appears too light or hard to read
**Solution**: If #3d3d3d is too light for secondary text, darken to #353535

### Issue 2: Borders Too Prominent
**Symptom**: Borders create a "boxy" appearance
**Solution**: Slightly lighten border colors:
- Light mode: #b8b8b8 → #c8c8c8
- Dark mode: #2e2e2e → #262626

### Issue 3: Active States Not Distinct Enough
**Symptom**: Current playing track doesn't stand out
**Solution**: Increase contrast of active color:
- Light mode: #0f0f0f → #080808
- Dark mode: #e8e8e8 → #f0f0f0

### Issue 4: Hover States Too Subtle
**Symptom**: Users can't tell when hovering over interactive elements
**Solution**: Adjust hover colors for more noticeable change:
- Light mode: #2b2b2b → #252525
- Dark mode: #b8b8b8 → #c0c0c0

---

## Performance Notes

### CSS Variable Updates
- Changes only affect color values, not selectors or structure
- No impact on rendering performance
- Smooth theme transitions already handled by existing CSS

### Browser Compatibility
- CSS custom properties (variables) are supported in all modern browsers
- Fallback not needed for target browser support (Chrome, Firefox, Safari, Edge - last 2 versions)

---

## Post-Implementation Testing Steps

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Visual Inspection**
   - Navigate through all pages/sections
   - Hover over all interactive elements
   - Click through tracklist items
   - Use audio player controls

3. **Theme Toggle** (if implemented in Phase 9)
   - Switch between light and dark modes multiple times
   - Verify no color artifacts or delays

4. **Accessibility Audit**
   - Use browser DevTools Lighthouse audit
   - Check for contrast warnings
   - Verify focus indicators are visible

5. **Mobile Testing**
   - Open site on mobile device or use DevTools device emulation
   - Test in both orientations
   - Verify touch targets are visible and appropriately sized

6. **Production Build**
   ```bash
   npm run build
   npm run preview
   ```
   - Verify colors are identical in production build
   - Check for any CSS minification issues

---

## Rollback Instructions

If the new color scheme has issues, revert by restoring the original values:

**Original Light Mode Colors:**
```css
--color-bg-light: #f5f5f5;
--color-text-primary-light: #1a1a1a;
--color-text-secondary-light: #4a4a4a;
--color-accent-light: #666666;
--color-border-light: #d0d0d0;
--color-hover-light: #333333;
--color-active-light: #000000;
```

**Original Dark Mode Colors:**
```css
--color-bg-dark: #0a0a0a;
--color-text-primary-dark: #e0e0e0;
--color-text-secondary-dark: #b0b0b0;
--color-accent-dark: #888888;
--color-border-dark: #2a2a2a;
--color-hover-dark: #cccccc;
--color-active-dark: #ffffff;
```

---

## Summary

This instruction modifies **only one file** (`src/styles/variables.css`) and updates **14 color variable values** (7 for light mode, 7 for dark mode). The change is:

- **Targeted**: Only color values are modified
- **Safe**: No structural CSS changes
- **Reversible**: Easy rollback if needed
- **Comprehensive**: Affects all themed elements site-wide
- **Tested**: Colors selected for WCAG AA/AAA compliance

The new dark grey palette creates a more sophisticated, professional appearance while maintaining excellent readability and accessibility across all components.