# PHASE 1D: LAYOUT COMPONENTS

## Part Overview
Create the main layout components that wrap all page content: Layout wrapper, Header, and Footer. These components provide consistent structure and will be used throughout the entire site.

## What Gets Created
- `src/components/Layout/Layout.tsx` - Main layout wrapper
- `src/components/Layout/Layout.css` - Layout styles
- `src/components/Layout/Header.tsx` - Site header
- `src/components/Layout/Header.css` - Header styles
- `src/components/Layout/Footer.tsx` - Site footer
- `src/components/Layout/Footer.css` - Footer styles

## Component Hierarchy

```
Layout (wrapper)
├── Header (sticky navigation)
├── main (content area - children prop)
└── Footer (copyright, credits)
```

**Layout Philosophy:**
- Sticky header stays at top when scrolling
- Main content area grows to fill available space
- Footer always at bottom
- Responsive design (mobile-first)
- Clean separation of concerns

## Step-by-Step Instructions

### Step 1: Create Layout Wrapper Component

**File:** `src/components/Layout/Layout.tsx`

The Layout component wraps all page content and includes Header and Footer:

```typescript
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout Component
 * 
 * Main layout wrapper that provides consistent structure across the site.
 * Includes Header and Footer, with children rendered in the main content area.
 * 
 * @param children - Page content to be rendered between Header and Footer
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
```

**Component Design Notes:**
- Uses React.FC with explicit LayoutProps interface
- children prop allows any content to be passed in
- Semantic HTML: `<main>` for content area
- Imports component-specific CSS
- JSDoc comments for documentation

**File:** `src/components/Layout/Layout.css`

```css
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
}

.layout__main {
  flex: 1;
  width: 100%;
}
```

**CSS Explanation:**
- Flexbox column layout ensures footer stays at bottom
- `min-height: 100vh` makes layout fill viewport
- `flex: 1` on main makes it grow to fill space
- BEM naming convention: `layout__main` is an element of `layout`

### Step 2: Create Header Component

**File:** `src/components/Layout/Header.tsx`

The Header displays the artist name and album title:

```typescript
import React from 'react';
import './Header.css';

/**
 * Header Component
 * 
 * Site header with artist name and album title.
 * 
 * Phase 1: Simple header with text
 * Phase 9: Will add theme toggle button
 */
const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__logo">
          <span className="header__artist">PRIMEAPE</span>
          <span className="header__divider">|</span>
          <span className="header__album">FOUNDATION</span>
        </h1>
        {/* Theme toggle will be added in Phase 9 */}
      </div>
    </header>
  );
};

export default Header;
```

**Component Design Notes:**
- No props needed in Phase 1 (just static display)
- Semantic `<header>` and `<h1>` tags
- Structured as artist | album
- Comment indicates future enhancement
- Separate spans for different styling

**File:** `src/components/Layout/Header.css`

```css
.header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-normal),
              border-color var(--transition-normal);
}

.header__container {
  max-width: var(--player-max-width);
  margin: 0 auto;
  padding: var(--space-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__logo {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.header__artist {
  text-transform: uppercase;
}

.header__divider {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-normal);
}

.header__album {
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .header__logo {
    font-size: var(--font-size-base);
    gap: var(--space-xs);
  }
}
```

**CSS Explanation:**
- `position: sticky` keeps header at top when scrolling
- `z-index: var(--z-sticky)` ensures header stays above content
- Border bottom for visual separation
- Flexbox for logo layout with gaps
- Artist name is emphasized (uppercase)
- Divider and album name use secondary color
- Responsive: smaller font size on mobile
- Smooth theme transitions

### Step 3: Create Footer Component

**File:** `src/components/Layout/Footer.tsx`

The Footer displays copyright and credits:

```typescript
import React from 'react';
import './Footer.css';

/**
 * Footer Component
 * 
 * Site footer with copyright information and credits.
 * 
 * Phase 1: Basic copyright info
 * Phase 6: Will add social links
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__copyright">
          © {currentYear} PRIMEAPE. All rights reserved.
        </p>
        <p className="footer__credits">
          Website built with React & TypeScript
        </p>
      </div>
    </footer>
  );
};

export default Footer;
```

**Component Design Notes:**
- Dynamically gets current year (no hardcoding 2025)
- Semantic `<footer>` tag
- Two paragraphs: copyright and credits
- Simple and clean
- No props needed

**File:** `src/components/Layout/Footer.css`

```css
.footer {
  background-color: var(--color-bg);
  border-top: 1px solid var(--color-border);
  padding: var(--space-lg) var(--space-md);
  transition: background-color var(--transition-normal),
              border-color var(--transition-normal);
}

.footer__container {
  max-width: var(--player-max-width);
  margin: 0 auto;
  text-align: center;
}

.footer__copyright {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}

.footer__credits {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .footer {
    padding: var(--space-md) var(--space-sm);
  }
}
```

**CSS Explanation:**
- Border top for visual separation
- Centered text layout
- Copyright is slightly larger than credits
- Secondary color for less important info (credits)
- Responsive: less padding on mobile
- Smooth theme transitions

## Component Patterns Used

### Pattern 1: Component File Structure
```typescript
import React from 'react';
import './ComponentName.css';

interface ComponentNameProps {
  // Props with explicit types
}

/**
 * JSDoc comment explaining component
 */
const ComponentName: React.FC<ComponentNameProps> = ({ props }) => {
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Pattern 2: BEM CSS Naming
```css
.block { } /* Component root */
.block__element { } /* Part of component */
.block--modifier { } /* Variant of component */
```

**Examples in this phase:**
- `.layout` (block)
- `.layout__main` (element)
- `.header__container` (element)
- `.footer__copyright` (element)

### Pattern 3: CSS Variable Usage
```css
/* Always use CSS variables, never hardcoded values */
color: var(--color-text-primary);     /* ✓ Correct */
color: #1a1a1a;                       /* ✗ Wrong */

padding: var(--space-md);             /* ✓ Correct */
padding: 24px;                        /* ✗ Wrong */
```

### Pattern 4: Responsive Design
```css
/* Mobile-first: base styles are for mobile */
.element {
  font-size: var(--font-size-base);
}

/* Desktop: use media queries for larger screens */
@media (min-width: 768px) {
  .element {
    font-size: var(--font-size-lg);
  }
}
```

## Validation Checklist

After completing Part 1D, verify:

### Files Created
- [ ] `src/components/Layout/Layout.tsx` exists
- [ ] `src/components/Layout/Layout.css` exists
- [ ] `src/components/Layout/Header.tsx` exists
- [ ] `src/components/Layout/Header.css` exists
- [ ] `src/components/Layout/Footer.tsx` exists
- [ ] `src/components/Layout/Footer.css` exists

### TypeScript Validation
Run this command to check for type errors:
```bash
npx tsc --noEmit
```

Should complete with no errors (may show errors about missing App.tsx - that's fine, we'll create it in Part 1E).

### Code Quality Check
- [ ] All components have JSDoc comments
- [ ] All props interfaces are explicitly typed
- [ ] CSS uses BEM naming convention
- [ ] CSS uses variables (no hardcoded colors/spacing)
- [ ] No `any` types used
- [ ] Imports use correct paths

### Component Structure Check
- [ ] Layout exports Header and Footer
- [ ] Layout has a children prop
- [ ] Header has no props (just renders static content)
- [ ] Footer has no props (generates year dynamically)
- [ ] All components use React.FC type

### CSS Check
- [ ] All CSS files use CSS custom properties
- [ ] Responsive breakpoints included where needed
- [ ] BEM naming is consistent
- [ ] No magic numbers (all spacing uses variables)
- [ ] Theme transitions defined

## Visual Preview

When the dev server runs (Part 1E), you should see:

**Header:**
```
┌─────────────────────────────────┐
│ PRIMEAPE | FOUNDATION          │ ← Sticky at top
└─────────────────────────────────┘
```

**Footer:**
```
┌─────────────────────────────────┐
│   © 2025 PRIMEAPE. All rights  │
│         reserved.               │
│                                 │
│ Website built with React &     │
│        TypeScript               │ ← Always at bottom
└─────────────────────────────────┘
```

**Layout Behavior:**
- Header stays at top when scrolling
- Content area grows to fill space
- Footer stays at bottom (even on short pages)

## Common Issues & Solutions

### Issue 1: Layout not filling viewport height
**Problem:** Footer floats in middle of page
**Solution:** Check that `.layout` has `min-height: 100vh` and `display: flex; flex-direction: column`

### Issue 2: Header not sticky
**Problem:** Header scrolls away with content
**Solution:** Verify `.header` has `position: sticky; top: 0;` and sufficient `z-index`

### Issue 3: TypeScript errors on React.FC
**Problem:** "Cannot find name 'React'" or "FC is not defined"
**Solution:** Make sure `import React from 'react'` is at the top of each component file

### Issue 4: CSS not applying
**Problem:** Styles don't show up in browser
**Solution:** 
1. Check that CSS import path is correct (`'./ComponentName.css'`)
2. CSS file must be in the same directory as component
3. Class names in JSX must exactly match CSS (case-sensitive)

### Issue 5: BEM naming confusion
**Reference:**
- `.layout` = Block (the component itself)
- `.layout__main` = Element (part of the layout component)
- `.layout--modifier` = Modifier (variant of layout - not used in Phase 1)

## Accessibility Notes

These components follow accessibility best practices:

**Semantic HTML:**
- `<header>` for site header
- `<main>` for main content
- `<footer>` for site footer
- `<h1>` for main heading

**Focus Management:**
- All interactive elements will have visible focus states (from global.css)
- Skip to content link can be added later if needed

**Screen Readers:**
- Logical document structure (header → main → footer)
- Text content is readable and logical

## Next Step
Proceed to **Part 1E: App Integration & Validation** (`phase-1e-integration.md`)
