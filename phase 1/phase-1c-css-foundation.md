# PHASE 1C: CSS FOUNDATION & THEME SYSTEM

## Part Overview
Create the complete CSS foundation including reset styles, CSS variables for theming, and global utility classes. This establishes the visual design system for the entire site.

## What Gets Created
- `src/styles/reset.css` - Browser normalization
- `src/styles/variables.css` - CSS custom properties (theme system)
- `src/styles/global.css` - Global styles and utilities

## Design Philosophy

**Theme:** Semi-chromatic greyscale with subtle color accents
- Light mode: Clean whites and dark grays
- Dark mode: Deep blacks and light grays
- Smooth transitions between themes
- High contrast for readability
- System font stack for performance

**Spacing:** 8px grid system for consistency
**Typography:** System fonts with clear hierarchy
**Accessibility:** High contrast, visible focus states, screen reader support

## Step-by-Step Instructions

### Step 1: Create CSS Reset

**File:** `src/styles/reset.css`

This file normalizes browser defaults for consistency:

```css
/* ============================================================================
   CSS RESET - Normalize browser defaults
   ============================================================================ */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  min-height: 100vh;
  line-height: 1.5;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}

a {
  color: inherit;
  text-decoration: none;
}

ul,
ol {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

#root {
  isolation: isolate;
}
```

**Key Reset Features:**
- Universal box-sizing: border-box (easier layout calculations)
- Remove default margins and padding
- Font smoothing for crisp text
- Images are block elements (no inline gaps)
- Buttons inherit font and have cursor pointer
- Remove list styles (we'll add custom ones when needed)

### Step 2: Create CSS Variables (Theme System)

**File:** `src/styles/variables.css`

This file defines all CSS custom properties for theming:

```css
/* ============================================================================
   CSS VARIABLES - Theme System
   ============================================================================ */

:root {
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
  
  /* ===== SPACING SCALE (8px grid system) ===== */
  --space-xs: 0.5rem;   /* 8px */
  --space-sm: 1rem;     /* 16px */
  --space-md: 1.5rem;   /* 24px */
  --space-lg: 2rem;     /* 32px */
  --space-xl: 3rem;     /* 48px */
  --space-2xl: 5rem;    /* 80px */
  
  /* ===== TYPOGRAPHY ===== */
  --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
                      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
                      'Helvetica Neue', sans-serif;
  --font-family-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 
                      'Courier New', monospace;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 2rem;      /* 32px */
  --font-size-4xl: 2.5rem;    /* 40px */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.8;
  
  /* ===== BORDER RADIUS ===== */
  --radius-sm: 0.25rem;   /* 4px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 0.75rem;   /* 12px */
  --radius-xl: 1rem;      /* 16px */
  --radius-full: 9999px;  /* Fully rounded */
  
  /* ===== SHADOWS ===== */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* ===== TRANSITIONS ===== */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
  
  /* ===== Z-INDEX SCALE ===== */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-popover: 400;
  --z-tooltip: 500;
  
  /* ===== BREAKPOINTS (for reference in JS) ===== */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  
  /* ===== PLAYER SPECIFIC ===== */
  --player-max-width: 800px;
  --artwork-size-desktop: 400px;
  --artwork-size-mobile: 280px;
  --controls-height: 80px;
  
  /* ===== DEFAULT THEME (Light) ===== */
  --color-bg: var(--color-bg-light);
  --color-text-primary: var(--color-text-primary-light);
  --color-text-secondary: var(--color-text-secondary-light);
  --color-accent: var(--color-accent-light);
  --color-border: var(--color-border-light);
  --color-hover: var(--color-hover-light);
  --color-active: var(--color-active-light);
}

/* Dark theme override */
[data-theme='dark'] {
  --color-bg: var(--color-bg-dark);
  --color-text-primary: var(--color-text-primary-dark);
  --color-text-secondary: var(--color-text-secondary-dark);
  --color-accent: var(--color-accent-dark);
  --color-border: var(--color-border-dark);
  --color-hover: var(--color-hover-dark);
  --color-active: var(--color-active-dark);
}
```

**Theme System Explained:**
- Light and dark color sets defined separately
- Active theme controlled by `data-theme` attribute on HTML element
- Default theme is light mode
- All components reference the active variables (e.g., `var(--color-bg)`)
- Theme switching will be implemented in Phase 9

**Spacing Scale Rationale:**
- 8px base unit for consistency
- Doubles at larger sizes (8, 16, 24, 32, 48, 80)
- Easy mental math: "I need 3 spaces between elements" = `var(--space-lg)`

**Typography Scale:**
- System font stack (no web fonts = faster load)
- Mobile-first sizing (base is 16px)
- Clear hierarchy with semantic sizes

### Step 3: Create Global Styles

**File:** `src/styles/global.css`

This file imports other CSS files and defines global styles:

```css
/* ============================================================================
   GLOBAL STYLES
   ============================================================================ */

@import './reset.css';
@import './variables.css';

body {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background-color: var(--color-bg);
  transition: background-color var(--transition-normal), 
              color var(--transition-normal);
}

/* ===== SMOOTH SCROLLING ===== */
html {
  scroll-behavior: smooth;
}

/* ===== FOCUS STYLES (Accessibility) ===== */
:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* ===== SELECTION STYLES ===== */
::selection {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

/* ===== SCROLLBAR STYLES ===== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-hover);
}

/* ===== UTILITY CLASSES ===== */

/* Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-md);
  padding-right: var(--space-md);
}

/* Section spacing */
.section {
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-2xl);
}

@media (max-width: 768px) {
  .section {
    padding-top: var(--space-xl);
    padding-bottom: var(--space-xl);
  }
}

/* Typography utilities */
.text-center {
  text-align: center;
}

.text-uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Visually hidden (for accessibility) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Loading spinner (for future use) */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: var(--radius-full);
  width: 24px;
  height: 24px;
  animation: spin 0.6s linear infinite;
}
```

**Global Styles Explained:**
- Imports reset and variables at the top (order matters!)
- Body gets theme-aware colors with smooth transitions
- Focus styles for keyboard navigation (accessibility)
- Custom scrollbar that matches theme
- Utility classes for common patterns
- `.sr-only` class for screen reader only content (accessibility)
- Spinner animation for loading states (will be used in Phase 2+)

## Validation Checklist

After completing Part 1C, verify:

### Files Created
- [ ] `src/styles/reset.css` exists
- [ ] `src/styles/variables.css` exists
- [ ] `src/styles/global.css` exists

### CSS Validation

You can validate the CSS syntax by opening the files in your editor and checking for:
- [ ] No syntax errors highlighted
- [ ] All @import statements at the top of global.css
- [ ] All CSS custom properties start with `--`
- [ ] All color values are valid hex codes

### Test Theme System (Manual)

Once the dev server is running (in Part 1E), you'll be able to test:
1. Open browser DevTools (F12)
2. Go to Elements tab
3. Find the `<html>` element
4. Add `data-theme="dark"` attribute
5. Page should smoothly transition to dark theme

**Expected Light Theme Colors:**
- Background: Light gray (#f5f5f5)
- Text: Dark gray (#1a1a1a)

**Expected Dark Theme Colors:**
- Background: Near black (#0a0a0a)
- Text: Light gray (#e0e0e0)

### CSS Variables Check

When dev server is running, in browser DevTools:
1. Go to Elements tab
2. Select the `<html>` element
3. Go to Computed tab
4. Search for `--color-bg`
5. Should see the resolved color value

## Design System Reference

### Color Palette
```
Light Mode:
- Background: #f5f5f5 (very light gray)
- Primary Text: #1a1a1a (almost black)
- Secondary Text: #4a4a4a (medium dark gray)
- Accent: #666666 (medium gray)
- Border: #d0d0d0 (light gray)

Dark Mode:
- Background: #0a0a0a (almost black)
- Primary Text: #e0e0e0 (light gray)
- Secondary Text: #b0b0b0 (medium light gray)
- Accent: #888888 (medium gray)
- Border: #2a2a2a (dark gray)
```

### Spacing Scale
```
xs:  8px  - Tight spacing (button padding, small gaps)
sm:  16px - Default spacing (form fields, card padding)
md:  24px - Medium spacing (section padding, margins)
lg:  32px - Large spacing (component separation)
xl:  48px - Extra large (major sections)
2xl: 80px - Huge (page sections)
```

### Typography Scale
```
xs:  12px - Small labels, captions
sm:  14px - Secondary text, helper text
base: 16px - Body text, default
lg:  18px - Emphasized text
xl:  20px - Small headings
2xl: 24px - Medium headings
3xl: 32px - Large headings
4xl: 40px - Hero headings
```

## Common Issues & Solutions

### Issue 1: CSS not loading
**Problem:** Styles don't appear in browser
**Solution:** Check that `global.css` is imported in App.tsx (we'll do this in Part 1E)

### Issue 2: CSS variables showing as literal "var(--color-bg)"
**Problem:** Browser doesn't support CSS variables (unlikely) or import order is wrong
**Solution:** Make sure @import statements are at the very top of global.css, before any other CSS rules

### Issue 3: Theme toggle not working
**Expected:** Theme toggle won't work yet - it's implemented in Phase 9
**Current State:** Only light theme is active by default

### Issue 4: Scrollbar styles not showing
**Browser Specific:** Scrollbar styling only works in WebKit browsers (Chrome, Safari, Edge)
**Firefox:** Uses different syntax (we can add this later if needed)

## Next Step
Proceed to **Part 1D: Layout Components** (`phase-1d-layout-components.md`)
