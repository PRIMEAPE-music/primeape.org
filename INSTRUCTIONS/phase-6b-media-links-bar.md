# PHASE 6B: CONTENT SECTIONS - MEDIA LINKS BAR

## Sub-Phase Overview

**Phase:** 6B of 6 (Media Links Bar)  
**Estimated Time:** 30-45 minutes  
**Complexity:** Simple  
**Dependencies:** Phase 6A complete

### What Will Be Built
Social and streaming platform links in a horizontal bar with dividers:
- 6 platform links: YouTube | Spotify | Instagram | Bandcamp | Apple Music | TikTok
- Icons (emojis) + text labels
- Vertical dividers between links (but not after last one)
- Responsive layout (horizontal on desktop, vertical on mobile)
- Placeholder URLs (easy to update later)

### Success Criteria
- ✅ MediaLinksBar component renders below player
- ✅ All 6 platforms display with icon + label
- ✅ Dividers appear between links (not after last)
- ✅ Links open in new tabs with proper security attributes
- ✅ Hover effects work
- ✅ Keyboard navigation functional
- ✅ Responsive: horizontal on desktop, vertical on mobile
- ✅ No TypeScript errors

---

## Implementation Instructions

### Step 1: Create MediaLinksBar Component

📁 **File:** `src/components/ContentSections/MediaLinksBar.tsx`

Create this new file:

```typescript
import React from 'react';
import './MediaLinksBar.css';

/**
 * MediaLinksBar Component
 * 
 * Horizontal bar displaying social and streaming platform links.
 * Layout: | YouTube | Spotify | Instagram | Bandcamp | Apple | TikTok |
 * 
 * Phase 6B: Initial implementation with placeholder URLs
 */

interface PlatformLink {
  id: string;
  name: string;
  url: string;
  icon: string; // Unicode emoji or icon
  ariaLabel: string;
}

const PLATFORM_LINKS: PlatformLink[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://youtube.com/@primeape', // Placeholder
    icon: '▶️',
    ariaLabel: 'Visit PRIMEAPE on YouTube'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    url: 'https://open.spotify.com/artist/primeape', // Placeholder
    icon: '🎵',
    ariaLabel: 'Listen to PRIMEAPE on Spotify'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/primeape', // Placeholder
    icon: '📷',
    ariaLabel: 'Follow PRIMEAPE on Instagram'
  },
  {
    id: 'bandcamp',
    name: 'Bandcamp',
    url: 'https://primeape.bandcamp.com', // Placeholder
    icon: '🎧',
    ariaLabel: 'Support PRIMEAPE on Bandcamp'
  },
  {
    id: 'apple',
    name: 'Apple Music',
    url: 'https://music.apple.com/artist/primeape', // Placeholder
    icon: '🍎',
    ariaLabel: 'Listen to PRIMEAPE on Apple Music'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://tiktok.com/@primeape', // Placeholder
    icon: '🎬',
    ariaLabel: 'Follow PRIMEAPE on TikTok'
  }
];

const MediaLinksBar: React.FC = () => {
  return (
    <section className="media-links" aria-label="Social and streaming platforms">
      <div className="media-links__container">
        {PLATFORM_LINKS.map((platform, index) => (
          <React.Fragment key={platform.id}>
            <a
              href={platform.url}
              className="media-links__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform.ariaLabel}
            >
              <span className="media-links__icon" aria-hidden="true">
                {platform.icon}
              </span>
              <span className="media-links__text">{platform.name}</span>
            </a>
            {/* Add divider between links (but not after last one) */}
            {index < PLATFORM_LINKS.length - 1 && (
              <div className="media-links__divider" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default MediaLinksBar;
```

**Implementation Notes:**
- Platform links defined as constant array (easy to update URLs later)
- Uses `React.Fragment` with `key` for list rendering with dividers
- `target="_blank"` opens in new tab
- `rel="noopener noreferrer"` for security
- Icon is `aria-hidden` since aria-label provides full context
- Dividers only between items, not after last

---

### Step 2: Create MediaLinksBar CSS

📁 **File:** `src/components/ContentSections/MediaLinksBar.css`

Create this new file:

```css
/* ============================================================================
   MEDIA LINKS BAR
   ============================================================================ */

.media-links {
  width: 100%;
  padding: var(--space-xl) var(--space-md);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  transition: 
    background-color var(--transition-normal),
    border-color var(--transition-normal);
}

.media-links__container {
  max-width: var(--player-max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

/* Individual platform link */
.media-links__link {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.media-links__link:hover {
  background-color: var(--color-border);
  color: var(--color-active);
  transform: translateY(-2px);
}

.media-links__link:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

.media-links__link:active {
  transform: translateY(0);
}

/* Icon styling */
.media-links__icon {
  font-size: var(--font-size-xl);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Text label */
.media-links__text {
  letter-spacing: 0.02em;
}

/* Vertical divider between links */
.media-links__divider {
  width: 1px;
  height: 24px;
  background-color: var(--color-border);
  flex-shrink: 0;
}

/* ============================================================================
   RESPONSIVE ADJUSTMENTS
   ============================================================================ */

/* Tablet and below - reduce spacing */
@media (max-width: 768px) {
  .media-links {
    padding: var(--space-lg) var(--space-sm);
  }

  .media-links__container {
    gap: var(--space-sm);
  }

  .media-links__link {
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-sm);
  }

  .media-links__icon {
    font-size: var(--font-size-lg);
  }
}

/* Mobile - vertical stack */
@media (max-width: 480px) {
  .media-links__container {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }

  .media-links__link {
    justify-content: center;
    padding: var(--space-md);
    border-bottom: 1px solid var(--color-border);
  }

  .media-links__link:last-child {
    border-bottom: none;
  }

  /* Hide dividers on mobile (using column layout with borders) */
  .media-links__divider {
    display: none;
  }
}
```

**Styling Notes:**
- Flexbox with wrapping for responsive layout
- Hover effects with subtle lift animation (`translateY(-2px)`)
- Focus-visible for keyboard navigation accessibility
- Mobile breakpoint switches to vertical stack below 480px
- Dividers hidden on mobile (replaced with border-bottom on links)
- Uses all existing CSS variables from Phase 1

---

### Step 3: Integrate into ContentSections

📁 **File:** `src/components/ContentSections/ContentSections.tsx`

🔍 **FIND:**
```typescript
import React from 'react';
import './ContentSections.css';

/**
 * ContentSections Component
 * 
 * Wrapper for all content sections below the player.
 * Renders sections in order: Media Links → About → Shows → Contact → Footer
 * 
 * Phase 6A: Basic structure
 * Phase 6B-6E: Individual sections will be added
 */
const ContentSections: React.FC = () => {
  return (
    <div className="content-sections">
      {/* Phase 6B: MediaLinksBar will be added here */}
      {/* Phase 6C: AboutSection will be added here */}
      {/* Phase 6D: ShowsSection will be added here */}
      {/* Phase 6E: ContactSection will be added here */}
      {/* Footer already exists in Layout - will stay there for now */}
    </div>
  );
};

export default ContentSections;
```

✏️ **REPLACE WITH:**
```typescript
import React from 'react';
import MediaLinksBar from './MediaLinksBar';
import './ContentSections.css';

/**
 * ContentSections Component
 * 
 * Wrapper for all content sections below the player.
 * Renders sections in order: Media Links → About → Shows → Contact → Footer
 * 
 * Phase 6A: ✓ Basic structure
 * Phase 6B: ✓ MediaLinksBar
 * Phase 6C-6E: Additional sections to be added
 */
const ContentSections: React.FC = () => {
  return (
    <div className="content-sections">
      <MediaLinksBar />
      {/* Phase 6C: AboutSection will be added here */}
      {/* Phase 6D: ShowsSection will be added here */}
      {/* Phase 6E: ContactSection will be added here */}
      {/* Footer already exists in Layout - will stay there for now */}
    </div>
  );
};

export default ContentSections;
```

**Changes Made:**
- Imported MediaLinksBar component
- Rendered MediaLinksBar at top of content sections
- Updated phase completion comments

---

## Validation Steps

### 1. TypeScript Compilation
```bash
npm run build
```
- ✅ Should compile with no errors
- ✅ No warnings about unused variables

### 2. Development Server
```bash
npm run dev
```
- ✅ Server should start without errors
- ✅ Hot reload should work

### 3. Visual Checks

**Desktop View (>768px):**
- ✅ Media links bar appears below player
- ✅ 6 platform links display horizontally
- ✅ Icons appear to the left of text labels
- ✅ Vertical dividers appear between links (5 dividers total)
- ✅ No divider after TikTok (last link)
- ✅ Links centered in container

**Tablet View (480px-768px):**
- ✅ Links may wrap to multiple rows
- ✅ Smaller text and icons
- ✅ Reduced padding

**Mobile View (<480px):**
- ✅ Links stack vertically
- ✅ Full-width buttons
- ✅ No vertical dividers (replaced with borders)
- ✅ Horizontal lines between links

### 4. Interaction Tests

**Mouse Interactions:**
- ✅ Hover over each link shows background color change
- ✅ Hover shows slight lift animation
- ✅ Click opens link in new tab
- ✅ Clicking doesn't navigate away from music player

**Keyboard Navigation:**
- ✅ Tab moves through links in order (YouTube → Spotify → ... → TikTok)
- ✅ Focus state visible (outline around focused link)
- ✅ Enter key activates link
- ✅ Focus style uses --color-active

**Screen Reader Test (Optional):**
- ✅ Screen reader announces section as "Social and streaming platforms"
- ✅ Each link announces with descriptive label (e.g., "Visit PRIMEAPE on YouTube")
- ✅ Dividers not announced (properly hidden)

### 5. Browser Console Check
- ✅ No errors in console
- ✅ No warnings in console
- ✅ No React key warnings

---

## Common Issues & Solutions

### Issue: Dividers not appearing
**Solution:** Check that conditional rendering logic is correct: `{index < PLATFORM_LINKS.length - 1 && ...}`

### Issue: Links not opening in new tab
**Solution:** Verify `target="_blank"` attribute is present on `<a>` tags.

### Issue: Hover effects not working
**Solution:** Check that MediaLinksBar.css is imported in MediaLinksBar.tsx.

### Issue: Mobile layout not stacking
**Solution:** Verify mobile media query is at `@media (max-width: 480px)` and has `flex-direction: column`.

### Issue: TypeScript error about PLATFORM_LINKS
**Solution:** Ensure `PlatformLink` interface is defined before the constant array.

---

## Updating Platform URLs Later

When you have real platform URLs, update the `PLATFORM_LINKS` array:

```typescript
const PLATFORM_LINKS: PlatformLink[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://youtube.com/@YOUR_REAL_HANDLE', // Replace this
    icon: '▶️',
    ariaLabel: 'Visit PRIMEAPE on YouTube'
  },
  // ... update other URLs
];
```

**Note:** Only the `url` field needs updating. Keep everything else the same.

---

## Optional Enhancement: Custom Icons

If you want to use a proper icon library instead of emojis:

1. Install react-icons: `npm install react-icons`
2. Import specific icons: `import { FaYoutube, FaSpotify, FaInstagram } from 'react-icons/fa'`
3. Update icon rendering in JSX: `<FaYoutube className="media-links__icon" />`
4. Remove emoji from PLATFORM_LINKS array

**For now:** Emojis work fine and require no extra dependencies.

---

## Phase 6B Completion Checklist

- [ ] `MediaLinksBar.tsx` created with component code
- [ ] `MediaLinksBar.css` created with styles
- [ ] MediaLinksBar imported in ContentSections.tsx
- [ ] MediaLinksBar rendered in ContentSections
- [ ] TypeScript compiles without errors
- [ ] Dev server runs without errors
- [ ] Media links bar visible below player
- [ ] All 6 platforms display with icons + text
- [ ] Dividers appear between links (not after last)
- [ ] Hover effects work on all links
- [ ] Links open in new tabs
- [ ] Keyboard navigation works (Tab key)
- [ ] Focus states visible
- [ ] Responsive layout works (desktop/tablet/mobile)
- [ ] No console errors

---

## What's Next?

**Phase 6C:** About Section
- Create AboutSection component with bio and album credits
- Add placeholder content
- Implement grid layout (bio + credits card)

---

**END OF PHASE 6B**

Once this sub-phase is complete and validated, proceed to Phase 6C (About Section).
