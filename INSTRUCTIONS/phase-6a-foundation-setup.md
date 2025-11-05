# PHASE 6A: CONTENT SECTIONS - FOUNDATION SETUP

## Sub-Phase Overview

**Phase:** 6A of 6 (Foundation Setup)  
**Estimated Time:** 30-45 minutes  
**Complexity:** Simple  
**Dependencies:** Phases 1-5 complete

### What Will Be Built
This sub-phase establishes the foundation for all content sections:
1. Add TypeScript types for contact forms and shows
2. Create ContentSections wrapper component with basic structure
3. Set up folder structure
4. Integrate into App.tsx

### Success Criteria
- ✅ New types added to `src/types/index.ts`
- ✅ ContentSections folder created with wrapper component
- ✅ ContentSections renders below PlayerSection in App
- ✅ TypeScript compiles with no errors
- ✅ Basic structure in place for subsequent components

---

## Implementation Instructions

### Step 1: Add New TypeScript Types

📁 **File:** `src/types/index.ts`

Add the following types to the END of the existing file:

```typescript
// ============================================================================
// CONTACT FORM TYPES (for Phase 6)
// ============================================================================

export type ContactFormTab = 'general' | 'booking';

export type FormSubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  formType: ContactFormTab; // Hidden field for Netlify
}

export interface ShowEvent {
  id: string;
  date: string; // ISO format date string
  venue: string;
  city: string;
  state?: string;
  ticketUrl?: string;
}
```

**What these types do:**
- `ContactFormTab`: Represents the two form tabs (general/booking)
- `FormSubmissionState`: Tracks form submission lifecycle
- `ContactFormData`: Structure of data submitted to Netlify
- `ShowEvent`: Structure for show listings (used in Phase 6C)

---

### Step 2: Create ContentSections Folder

📁 **Create folder:** `src/components/ContentSections/`

This folder will contain all content section components.

---

### Step 3: Create ContentSections Wrapper Component

📁 **File:** `src/components/ContentSections/ContentSections.tsx`

Create this new file with the following content:

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

**Implementation Notes:**
- Simple wrapper component for now
- Comments mark where sections will be added in subsequent sub-phases
- Footer will remain in Layout component (no changes needed)

---

### Step 4: Create ContentSections CSS

📁 **File:** `src/components/ContentSections/ContentSections.css`

Create this new file with the following content:

```css
/* ============================================================================
   CONTENT SECTIONS WRAPPER
   ============================================================================ */

.content-sections {
  width: 100%;
  max-width: var(--player-max-width);
  margin: 0 auto;
  padding: 0;
}

/* Ensure proper spacing between player and content sections */
.content-sections {
  margin-top: var(--space-2xl);
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .content-sections {
    margin-top: var(--space-xl);
  }
}
```

**Styling Notes:**
- Uses existing CSS variables from Phase 1
- Matches player max-width for visual consistency
- Adds vertical spacing between player and content sections
- Responsive spacing for mobile

---

### Step 5: Integrate into App.tsx

📁 **File:** `src/App.tsx`

🔍 **FIND:**
```typescript
import React from 'react';
import Layout from './components/Layout/Layout';
import PlayerSection from './components/PlayerSection/PlayerSection';
import './styles/global.css';

/**
 * App Component
 * 
 * Root component of the application.
 * 
 * Phase 1: ✓ Basic layout structure
 * Phase 2: ✓ Music player with playback controls
 * Phase 3: Advanced player features (waveform, equalizer, volume)
 * Phase 4: Lyrics system
 * Phase 5+: Additional content sections
 */
const App: React.FC = () => {
  return (
    <Layout>
      <PlayerSection />
      {/* Additional sections will be added in Phase 6 */}
    </Layout>
  );
};

export default App;
```

✏️ **REPLACE WITH:**
```typescript
import React from 'react';
import Layout from './components/Layout/Layout';
import PlayerSection from './components/PlayerSection/PlayerSection';
import ContentSections from './components/ContentSections/ContentSections';
import './styles/global.css';

/**
 * App Component
 * 
 * Root component of the application.
 * 
 * Phase 1: ✓ Basic layout structure
 * Phase 2: ✓ Music player with playback controls
 * Phase 3: ✓ Advanced player features (waveform, equalizer, volume)
 * Phase 4: ✓ Lyrics system
 * Phase 5: ✓ Tracklist & navigation
 * Phase 6: ✓ Content sections (in progress - 6A complete)
 */
const App: React.FC = () => {
  return (
    <Layout>
      <PlayerSection />
      <ContentSections />
    </Layout>
  );
};

export default App;
```

**Changes Made:**
- Added import for ContentSections
- Rendered ContentSections below PlayerSection
- Updated phase completion comments

---

## Validation Steps

### 1. TypeScript Compilation
```bash
npm run build
```
- ✅ Should compile with no errors
- ✅ New types should be recognized

### 2. Development Server
```bash
npm run dev
```
- ✅ Server should start without errors
- ✅ Page should load normally

### 3. Visual Check
- ✅ Player section still displays correctly
- ✅ No visible content sections yet (that's expected)
- ✅ No console errors
- ✅ Extra whitespace below player (from margin-top)

### 4. File Structure Check
Verify the following structure exists:
```
src/
├── components/
│   ├── ContentSections/
│   │   ├── ContentSections.tsx
│   │   └── ContentSections.css
│   └── (other existing components)
├── types/
│   └── index.ts (with new types added)
└── App.tsx (modified)
```

---

## What's Next?

After Phase 6A is complete and validated:

**Phase 6B:** Media Links Bar
- Create MediaLinksBar component
- Add social/streaming platform links
- Implement horizontal bar with dividers

**Phase 6C:** About Section
- Create AboutSection component
- Add placeholder bio and album credits

**Phase 6D:** Shows Section
- Create ShowsSection component
- Add show listings and "Book Me" button
- Implement scroll-to-contact functionality

**Phase 6E:** Contact Section
- Create ContactSection component
- Implement tabbed form (General/Booking)
- Integrate Netlify Forms

---

## Common Issues & Solutions

### Issue: TypeScript errors about new types
**Solution:** Ensure types are added to the END of `src/types/index.ts`, not replacing existing types.

### Issue: ContentSections not rendering
**Solution:** Check that import path is correct in App.tsx and component is exported with `export default`.

### Issue: CSS not loading
**Solution:** Verify CSS import in ContentSections.tsx matches filename exactly (case-sensitive).

---

## Phase 6A Completion Checklist

- [ ] New types added to `src/types/index.ts`
- [ ] `ContentSections` folder created
- [ ] `ContentSections.tsx` created with wrapper component
- [ ] `ContentSections.css` created with basic styles
- [ ] `App.tsx` modified to import and render ContentSections
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Page loads correctly in browser
- [ ] No console errors
- [ ] File structure matches expected layout

---

**END OF PHASE 6A**

Once this sub-phase is complete and validated, proceed to Phase 6B (Media Links Bar).
