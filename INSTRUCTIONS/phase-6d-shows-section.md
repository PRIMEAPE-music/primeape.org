# PHASE 6D: CONTENT SECTIONS - SHOWS SECTION

## Sub-Phase Overview

**Phase:** 6D of 6 (Shows Section)  
**Estimated Time:** 45 minutes  
**Complexity:** Simple-Moderate  
**Dependencies:** Phase 6C complete

### What Will Be Built
Shows section with booking call-to-action:
- List view of 3 placeholder shows
- Show details: date, venue, city/state
- "Book Me" button that scrolls to contact form
- Ref setup in ContentSections for scroll targeting
- Smooth scroll behavior

### Success Criteria
- ✅ ShowsSection renders below AboutSection
- ✅ 3 placeholder shows display in list format
- ✅ Dates format correctly (e.g., "Fri, Dec 15, 2025")
- ✅ "Book Me" button displays with prominent styling
- ✅ Clicking "Book Me" smoothly scrolls to contact section
- ✅ Show cards have hover effects
- ✅ Responsive layout (desktop and mobile)
- ✅ No TypeScript errors

---

## Implementation Instructions

### Step 1: Create ShowsSection Component

📁 **File:** `src/components/ContentSections/ShowsSection.tsx`

Create this new file:

```typescript
import React from 'react';
import './ShowsSection.css';

/**
 * ShowsSection Component
 * 
 * Displays upcoming shows in a list view.
 * "Book Me" button triggers scroll to contact form + switches to booking tab.
 * 
 * Phase 6D: Placeholder shows with scroll functionality
 * Future: Can be made dynamic with real show data
 */

interface ShowsSectionProps {
  onBookMeClick: () => void;
}

const ShowsSection: React.FC<ShowsSectionProps> = ({ onBookMeClick }) => {
  // Placeholder show data
  const placeholderShows = [
    {
      id: 'show-1',
      date: '2025-12-15',
      venue: 'The Underground',
      city: 'Los Angeles',
      state: 'CA'
    },
    {
      id: 'show-2',
      date: '2025-12-22',
      venue: 'Echo Chamber',
      city: 'San Francisco',
      state: 'CA'
    },
    {
      id: 'show-3',
      date: '2026-01-10',
      venue: 'Sound Garden',
      city: 'Seattle',
      state: 'WA'
    }
  ];

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="shows-section" aria-labelledby="shows-heading">
      <div className="shows-section__container">
        <h2 id="shows-heading" className="shows-section__title">
          Shows
        </h2>

        <div className="shows-section__content">
          <ul className="shows-section__list">
            {placeholderShows.map((show) => (
              <li key={show.id} className="shows-section__item">
                <div className="shows-section__date">
                  <time dateTime={show.date}>{formatDate(show.date)}</time>
                </div>
                <div className="shows-section__details">
                  <div className="shows-section__venue">{show.venue}</div>
                  <div className="shows-section__location">
                    {show.city}, {show.state}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="shows-section__cta">
            <p className="shows-section__cta-text">
              Interested in booking PRIMEAPE for your venue or event?
            </p>
            <button
              type="button"
              className="shows-section__book-btn"
              onClick={onBookMeClick}
              aria-label="Book PRIMEAPE - go to booking form"
            >
              Book Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowsSection;
```

**Implementation Notes:**
- Accepts `onBookMeClick` prop (callback from parent)
- Placeholder shows hardcoded as array
- `formatDate` helper formats ISO dates to readable format
- Semantic HTML: `<ul>`, `<li>`, `<time>` with `dateTime` attribute
- Button has descriptive `aria-label`
- Clear CTA text explaining purpose

---

### Step 2: Create ShowsSection CSS

📁 **File:** `src/components/ContentSections/ShowsSection.css`

Create this new file:

```css
/* ============================================================================
   SHOWS SECTION
   ============================================================================ */

.shows-section {
  width: 100%;
  padding: var(--space-2xl) var(--space-md);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  transition: 
    background-color var(--transition-normal),
    border-color var(--transition-normal);
}

.shows-section__container {
  max-width: var(--player-max-width);
  margin: 0 auto;
}

.shows-section__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-xl);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.shows-section__content {
  max-width: 700px;
  margin: 0 auto;
}

/* Shows list */
.shows-section__list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-2xl) 0;
}

.shows-section__item {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-lg);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
  transition: 
    background-color var(--transition-normal),
    border-color var(--transition-normal),
    transform var(--transition-fast);
}

.shows-section__item:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.shows-section__item:last-child {
  margin-bottom: 0;
}

/* Date column */
.shows-section__date {
  flex-shrink: 0;
  min-width: 120px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-active);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Details column */
.shows-section__details {
  flex: 1;
}

.shows-section__venue {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-xs);
}

.shows-section__location {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Call-to-action area */
.shows-section__cta {
  text-align: center;
  padding: var(--space-xl);
  background-color: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  transition: 
    background-color var(--transition-normal),
    border-color var(--transition-normal);
}

.shows-section__cta-text {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-lg);
  line-height: 1.6;
}

.shows-section__book-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md) var(--space-2xl);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-bg);
  background-color: var(--color-active);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all var(--transition-fast);
}

.shows-section__book-btn:hover {
  background-color: var(--color-active-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.shows-section__book-btn:active {
  transform: translateY(0);
}

.shows-section__book-btn:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 4px;
}

/* ============================================================================
   RESPONSIVE ADJUSTMENTS
   ============================================================================ */

/* Mobile */
@media (max-width: 640px) {
  .shows-section {
    padding: var(--space-xl) var(--space-sm);
  }

  .shows-section__title {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-lg);
  }

  .shows-section__item {
    flex-direction: column;
    gap: var(--space-sm);
    padding: var(--space-md);
  }

  .shows-section__date {
    min-width: auto;
  }

  .shows-section__cta {
    padding: var(--space-lg);
  }

  .shows-section__book-btn {
    width: 100%;
    padding: var(--space-md);
  }
}
```

**Styling Notes:**
- Show items styled as cards with hover lift effect
- Date and details in flex layout (stacks on mobile)
- CTA section uses dashed border to stand out
- Button has prominent styling with hover effects
- Mobile: full-width button, stacked show info

---

### Step 3: Update ContentSections with Ref and Callback

📁 **File:** `src/components/ContentSections/ContentSections.tsx`

🔍 **FIND:**
```typescript
import React from 'react';
import MediaLinksBar from './MediaLinksBar';
import AboutSection from './AboutSection';
import './ContentSections.css';

/**
 * ContentSections Component
 * 
 * Wrapper for all content sections below the player.
 * Renders sections in order: Media Links → About → Shows → Contact → Footer
 * 
 * Phase 6A: ✓ Basic structure
 * Phase 6B: ✓ MediaLinksBar
 * Phase 6C: ✓ AboutSection
 * Phase 6D-6E: Additional sections to be added
 */
const ContentSections: React.FC = () => {
  return (
    <div className="content-sections">
      <MediaLinksBar />
      <AboutSection />
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
import AboutSection from './AboutSection';
import ShowsSection from './ShowsSection';
import './ContentSections.css';

/**
 * ContentSections Component
 * 
 * Wrapper for all content sections below the player.
 * Renders sections in order: Media Links → About → Shows → Contact → Footer
 * 
 * Phase 6A: ✓ Basic structure
 * Phase 6B: ✓ MediaLinksBar
 * Phase 6C: ✓ AboutSection
 * Phase 6D: ✓ ShowsSection with scroll-to-contact
 * Phase 6E: ContactSection to be added
 */
const ContentSections: React.FC = () => {
  // Ref for scroll target (contact section - will be added in Phase 6E)
  const contactRef = React.useRef<HTMLElement>(null);

  // Handler passed to ShowsSection for "Book Me" button
  const handleBookMeClick = () => {
    // Scroll to contact section
    // Note: contactRef.current will be null until Phase 6E adds ContactSection
    contactRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  return (
    <div className="content-sections">
      <MediaLinksBar />
      <AboutSection />
      <ShowsSection onBookMeClick={handleBookMeClick} />
      {/* Phase 6E: ContactSection will be added here with ref={contactRef} */}
      {/* Footer already exists in Layout - will stay there for now */}
    </div>
  );
};

export default ContentSections;
```

**Changes Made:**
- Imported ShowsSection component
- Created `contactRef` using `React.useRef<HTMLElement>(null)`
- Created `handleBookMeClick` callback that scrolls to contact section
- Passed `onBookMeClick={handleBookMeClick}` to ShowsSection
- Added note that ref will connect in Phase 6E

**Important Note:**
The scroll functionality won't work yet because ContactSection doesn't exist. That's expected! In Phase 6E, we'll add ContactSection with the ref, and then clicking "Book Me" will scroll to it.

---

## Validation Steps

### 1. TypeScript Compilation
```bash
npm run build
```
- ✅ Should compile with no errors
- ✅ No warnings about unused ref (it's used, just target doesn't exist yet)

### 2. Development Server
```bash
npm run dev
```
- ✅ Server should start without errors

### 3. Visual Checks

**Desktop View (>640px):**
- ✅ Shows section appears below AboutSection
- ✅ "Shows" heading centered and uppercase
- ✅ 3 show cards display in list
- ✅ Each card shows date on left, venue/location on right
- ✅ Dates format correctly (e.g., "Mon, Dec 15, 2025")
- ✅ CTA section with dashed border
- ✅ "Book Me" button prominent and centered

**Mobile View (<640px):**
- ✅ Show cards stack date above venue/location
- ✅ "Book Me" button full-width
- ✅ Smaller text sizes
- ✅ Reduced padding

### 4. Interaction Tests

**Hover Effects:**
- ✅ Hovering over show cards changes border color and lifts slightly
- ✅ Hovering over "Book Me" button shows hover state

**"Book Me" Button:**
- ✅ Button is clickable (cursor: pointer)
- ✅ Clicking button doesn't cause errors (scroll won't work yet)
- ✅ No console errors when clicked
- ⚠️ Nothing happens when clicked (expected - ContactSection doesn't exist yet)

**Keyboard Navigation:**
- ✅ Tab key can reach "Book Me" button
- ✅ Focus state visible on button
- ✅ Enter key activates button (safe, just doesn't scroll yet)

### 5. Content Checks
- ✅ 3 shows display with correct data
- ✅ Venues: "The Underground", "Echo Chamber", "Sound Garden"
- ✅ Locations: "Los Angeles, CA", "San Francisco, CA", "Seattle, WA"
- ✅ Dates in December 2025 and January 2026
- ✅ CTA text clearly explains booking

### 6. Browser Console Check
- ✅ No errors in console
- ✅ No warnings in console
- ✅ Clicking "Book Me" logs nothing (that's fine)

---

## Common Issues & Solutions

### Issue: Dates not formatting correctly
**Solution:** Verify `formatDate` function is called with `show.date` parameter and uses `toLocaleDateString` with correct options.

### Issue: Show cards not hovering
**Solution:** Check that `ShowsSection.css` is imported in `ShowsSection.tsx`.

### Issue: TypeScript error on contactRef
**Solution:** Ensure type is `React.useRef<HTMLElement>(null)` not `useRef<HTMLDivElement>`.

### Issue: "Book Me" button not clickable
**Solution:** Verify `onClick={onBookMeClick}` prop is passed and function is defined in ContentSections.

### Issue: Shows not displaying
**Solution:** Check that `placeholderShows.map()` is iterating correctly and `key={show.id}` is present.

---

## Testing the Scroll (After Phase 6E)

Once ContactSection is added in Phase 6E, come back and test:
- [ ] Click "Book Me" button
- [ ] Verify smooth scroll to contact section
- [ ] Verify contact section comes into view at top of viewport
- [ ] Verify "Booking" tab is selected (will be implemented in 6E)

**For now:** It's normal that clicking does nothing. The functionality will complete in Phase 6E.

---

## Phase 6D Completion Checklist

- [ ] `ShowsSection.tsx` created with component code
- [ ] `ShowsSection.css` created with styles
- [ ] ShowsSection imported in ContentSections.tsx
- [ ] `contactRef` created in ContentSections
- [ ] `handleBookMeClick` function created
- [ ] ShowsSection rendered with `onBookMeClick` prop
- [ ] TypeScript compiles without errors
- [ ] Dev server runs without errors
- [ ] Shows section visible below AboutSection
- [ ] 3 placeholder shows display
- [ ] Dates format correctly
- [ ] Show cards have proper layout (date + details)
- [ ] Hover effects work on show cards
- [ ] "Book Me" button displays prominently
- [ ] Button is clickable (no errors)
- [ ] Responsive layout works (desktop/mobile)
- [ ] No console errors

---

## What's Next?

**Phase 6E:** Contact Section (Final Sub-Phase)
- Create ContactSection component with tabs
- Implement Netlify Forms integration
- Connect ref for scroll-to-contact functionality
- Add honeypot spam protection
- Handle form submission states
- Update "Book Me" to switch to "Booking" tab

---

**END OF PHASE 6D**

Once this sub-phase is complete and validated, proceed to Phase 6E (Contact Section - the final piece!).
