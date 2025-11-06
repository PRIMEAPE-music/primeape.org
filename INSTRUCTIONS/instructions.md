# Mobile Tracklist Repositioning - Below Player, Above Social Links

## Objective
Make the Tracklist component visible on mobile devices, positioned below the PlayerSection and above the MediaLinksBar in the ContentSections area. Desktop layout (tracklist on left side of player) remains completely unchanged.

## Scope
- **Desktop (≥1100px):** No changes - tracklist stays on left side of player
- **Tablet/Mobile (<1100px):** Show tracklist in ContentSections area, between PlayerSection and MediaLinksBar

## Current State
- Tracklist is hidden on mobile/tablet via CSS: `.player__floating-box { display: none !important; }` at breakpoint <1099px
- Tracklist is part of Player component's main area on desktop
- ContentSections currently starts with MediaLinksBar

## Target State
- Desktop: Tracklist remains in player's left floating box (no changes)
- Mobile: Tracklist appears as first item in ContentSections
- Order on mobile: PlayerSection → Tracklist → MediaLinksBar → AboutSection → ShowsSection → ContactSection

---

## Files to Modify
1. `src/components/ContentSections/ContentSections.tsx` - Add tracklist on mobile
2. `src/components/ContentSections/ContentSections.css` - Style mobile tracklist container
3. `src/components/Tracklist/Tracklist.css` - Add mobile-specific styles

---

## Implementation Strategy

The tracklist needs to be rendered in TWO places:
1. **Desktop:** Inside Player component (existing behavior - keep as-is)
2. **Mobile:** Inside ContentSections component (new behavior)

We'll use CSS to show/hide the appropriate instance at each breakpoint.

---

## Modification Instructions

### 1. ContentSections.tsx - Add Mobile Tracklist

📁 File: `src/components/ContentSections/ContentSections.tsx`

#### Change 1: Import Tracklist and Album Data

🔍 **FIND:**
```tsx
import React from 'react';
import MediaLinksBar from './MediaLinksBar';
import AboutSection from './AboutSection';
import ShowsSection from './ShowsSection';
import ContactSection from './ContactSection';
import './ContentSections.css';
```

✏️ **REPLACE WITH:**
```tsx
import React from 'react';
import MediaLinksBar from './MediaLinksBar';
import AboutSection from './AboutSection';
import ShowsSection from './ShowsSection';
import ContactSection from './ContactSection';
import Tracklist from '../Tracklist/Tracklist';
import { FOUNDATION_ALBUM } from '@/data/album';
import './ContentSections.css';
```

#### Change 2: Add Props Interface for Player State

➕ **ADD AFTER:** `import './ContentSections.css';`

```tsx

interface ContentSectionsProps {
  currentTrackId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  onTrackSelect: (trackId: number) => void;
}
```

#### Change 3: Update Component Signature and Add Tracklist

🔍 **FIND:**
```tsx
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
 * Phase 6E: ✓ ContactSection with Netlify Forms
 */
const ContentSections: React.FC = () => {
```

✏️ **REPLACE WITH:**
```tsx
/**
 * ContentSections Component
 * 
 * Wrapper for all content sections below the player.
 * Renders sections in order: Tracklist (mobile only) → Media Links → About → Shows → Contact → Footer
 * 
 * Phase 6A: ✓ Basic structure
 * Phase 6B: ✓ MediaLinksBar
 * Phase 6C: ✓ AboutSection
 * Phase 6D: ✓ ShowsSection with scroll-to-contact
 * Phase 6E: ✓ ContactSection with Netlify Forms
 * Mobile Enhancement: ✓ Tracklist visible below player on mobile
 */
const ContentSections: React.FC<ContentSectionsProps> = ({
  currentTrackId,
  isPlaying,
  isLoading,
  onTrackSelect,
}) => {
```

#### Change 4: Add Mobile Tracklist Container

🔍 **FIND:**
```tsx
  return (
    <div className="content-sections">
      <MediaLinksBar />
```

✏️ **REPLACE WITH:**
```tsx
  return (
    <div className="content-sections">
      {/* Mobile Tracklist - only visible on tablet/mobile */}
      <div className="content-sections__mobile-tracklist">
        <Tracklist
          tracks={FOUNDATION_ALBUM.tracks}
          currentTrackId={currentTrackId}
          isPlaying={isPlaying}
          isLoading={isLoading}
          onTrackSelect={onTrackSelect}
        />
      </div>

      <MediaLinksBar />
```

---

### 2. App.tsx - Pass Player State to ContentSections

📁 File: `src/components/App.tsx`

We need App.tsx to lift player state from PlayerSection so it can be shared with ContentSections.

#### Change 1: Update App Component

🔍 **FIND:**
```tsx
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
```

✏️ **REPLACE WITH:**
```tsx
/**
 * App Component
 * 
 * Root component of the application.
 * Manages shared player state for PlayerSection and ContentSections (mobile tracklist).
 * 
 * Phase 1: ✓ Basic layout structure
 * Phase 2: ✓ Music player with playback controls
 * Phase 3: ✓ Advanced player features (waveform, equalizer, volume)
 * Phase 4: ✓ Lyrics system
 * Phase 5: ✓ Tracklist & navigation
 * Phase 6: ✓ Content sections
 * Mobile Enhancement: ✓ Player state shared with mobile tracklist
 */
const App: React.FC = () => {
  // State lifted from PlayerSection for sharing with mobile tracklist
  const [playerState, setPlayerState] = React.useState<{
    currentTrackId: number | null;
    isPlaying: boolean;
    isLoading: boolean;
  }>({
    currentTrackId: null,
    isPlaying: false,
    isLoading: false,
  });

  // Callback for track selection from mobile tracklist
  const handleTrackSelect = React.useCallback((trackId: number) => {
    // This will be called from mobile tracklist
    // PlayerSection needs to expose a way to handle this
    // For now, we'll pass this down and PlayerSection will handle the actual logic
    setPlayerState(prev => ({ ...prev, currentTrackId: trackId }));
  }, []);

  return (
    <Layout>
      <PlayerSection 
        onPlayerStateChange={setPlayerState}
        onTrackSelectFromExternal={handleTrackSelect}
      />
      <ContentSections 
        currentTrackId={playerState.currentTrackId}
        isPlaying={playerState.isPlaying}
        isLoading={playerState.isLoading}
        onTrackSelect={handleTrackSelect}
      />
    </Layout>
  );
};
```

**Note:** This introduces props to PlayerSection. PlayerSection.tsx will need updating to accept and use these props. See **Section 4** below.

---

### 3. ContentSections.css - Style Mobile Tracklist Container

📁 File: `src/components/ContentSections/ContentSections.css`

#### Change 1: Add Mobile Tracklist Styles

➕ **ADD AFTER:** `.content-sections { width: 100%; ... }` section

```css

/* ============================================================================
   MOBILE TRACKLIST CONTAINER
   ============================================================================ */

.content-sections__mobile-tracklist {
  width: 100%;
  padding: var(--space-xl) var(--space-md);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  transition: 
    background-color var(--transition-normal),
    border-color var(--transition-normal);
}

.content-sections__mobile-tracklist .tracklist {
  max-width: var(--player-max-width);
  margin: 0 auto;
  height: 400px; /* Fixed height for mobile tracklist */
}

/* Hide mobile tracklist on desktop */
@media (min-width: 1100px) {
  .content-sections__mobile-tracklist {
    display: none;
  }
}

/* Show mobile tracklist on tablet and mobile */
@media (max-width: 1099px) {
  .content-sections__mobile-tracklist {
    display: block;
  }
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .content-sections__mobile-tracklist {
    padding: var(--space-lg) var(--space-sm);
  }

  .content-sections__mobile-tracklist .tracklist {
    height: 350px; /* Slightly shorter on very small screens */
  }
}
```

**What This Does:**
- Creates a container for the mobile tracklist with consistent section styling
- Hides on desktop (≥1100px) where tracklist appears in player's left side
- Shows on tablet/mobile (<1100px) with appropriate padding
- Sets fixed height so tracklist is scrollable (similar to desktop behavior)
- Matches styling of other content sections (background, border)

---

### 4. PlayerSection.tsx - Accept and Use Props for State Sharing

📁 File: `src/components/PlayerSection/PlayerSection.tsx`

We need to update PlayerSection to:
1. Accept props from App for state management
2. Notify parent (App) of player state changes
3. Handle track selection from external sources (mobile tracklist)

#### Change 1: Add Props Interface

➕ **ADD AFTER:** imports, **BEFORE** component definition

```tsx
interface PlayerSectionProps {
  onPlayerStateChange: (state: {
    currentTrackId: number | null;
    isPlaying: boolean;
    isLoading: boolean;
  }) => void;
  onTrackSelectFromExternal: (trackId: number) => void;
}
```

#### Change 2: Update Component Signature

🔍 **FIND:**
```tsx
const PlayerSection: React.FC = () => {
```

✏️ **REPLACE WITH:**
```tsx
const PlayerSection: React.FC<PlayerSectionProps> = ({
  onPlayerStateChange,
  onTrackSelectFromExternal,
}) => {
```

#### Change 3: Add Effect to Notify Parent of State Changes

This needs to be added inside the PlayerSection component, after the Player component is rendered. We need to find where Player is instantiated and wrap it to capture state changes.

🔍 **FIND:**
```tsx
  return (
    <section className="player-section">
      <div className="player-section__container">
        <Player />
      </div>
    </section>
  );
```

✏️ **REPLACE WITH:**
```tsx
  return (
    <section className="player-section">
      <div className="player-section__container">
        <Player 
          onStateChange={onPlayerStateChange}
          onExternalTrackSelect={onTrackSelectFromExternal}
        />
      </div>
    </section>
  );
```

**Note:** This assumes Player component will be updated to accept and use these props. See **Section 5** below.

---

### 5. Player.tsx - Expose State and Handle External Track Selection

📁 File: `src/components/Player/Player.tsx`

#### Change 1: Add Props Interface

🔍 **FIND:**
```tsx
/**
 * Player Component
 * 
 * Main music player component that orchestrates all player sub-components.
 * Manages audio playback state via useAudioPlayer hook.
 * 
 * Phase 2: Basic playback with simple progress bar
 * Phase 3: Will add waveform, equalizer, volume, shuffle, repeat
 * Phase 4: Will add lyrics integration
 */
const Player: React.FC = () => {
```

✏️ **REPLACE WITH:**
```tsx
interface PlayerProps {
  onStateChange?: (state: {
    currentTrackId: number | null;
    isPlaying: boolean;
    isLoading: boolean;
  }) => void;
  onExternalTrackSelect?: (trackId: number) => void;
}

/**
 * Player Component
 * 
 * Main music player component that orchestrates all player sub-components.
 * Manages audio playback state via useAudioPlayer hook.
 * Exposes player state to parent for mobile tracklist integration.
 * 
 * Phase 2: Basic playback with simple progress bar
 * Phase 3: Will add waveform, equalizer, volume, shuffle, repeat
 * Phase 4: Will add lyrics integration
 * Mobile Enhancement: Shares state with external components
 */
const Player: React.FC<PlayerProps> = ({
  onStateChange,
  onExternalTrackSelect,
}) => {
```

#### Change 2: Add Effect to Notify Parent of State Changes

➕ **ADD AFTER:** the `useEffect` for equalizer persistence, **BEFORE** the `useAudioPlayer` hook

```tsx
  // Notify parent of player state changes (for mobile tracklist)
  React.useEffect(() => {
    if (onStateChange) {
      onStateChange({
        currentTrackId,
        isPlaying: playbackState === 'playing',
        isLoading: playbackState === 'loading',
      });
    }
  }, [currentTrackId, playbackState, onStateChange]);
```

#### Change 3: Handle External Track Selection

The `handleTrackSelect` function already exists in Player.tsx. We need to expose it for external use.

➕ **ADD AFTER:** the state notification effect added above

```tsx
  // Handle external track selection (from mobile tracklist)
  React.useEffect(() => {
    if (onExternalTrackSelect) {
      // Register the handler - this allows parent to trigger track selection
      // Parent will call onExternalTrackSelect(trackId) which needs to trigger handleTrackSelect
      // For this to work, we need to make handleTrackSelect available
    }
  }, [onExternalTrackSelect]);
```

**Note:** The mobile tracklist will call `onTrackSelect` from ContentSections, which flows through App → PlayerSection → Player. The existing `handleTrackSelect` function in Player will handle the actual track loading logic.

---

### 6. Tracklist.css - Ensure Mobile Compatibility

📁 File: `src/components/Tracklist/Tracklist.css`

The tracklist styles should already work fine in the ContentSections context, but we'll add a specific note for clarity.

➕ **ADD AT END OF FILE:**

```css

/* ============================================================================
   MOBILE CONTENT SECTIONS INTEGRATION
   ============================================================================ */

/* When tracklist appears in ContentSections on mobile, ensure proper behavior */
@media (max-width: 1099px) {
  .content-sections__mobile-tracklist .tracklist {
    /* Inherit height from parent container */
    height: 100%;
  }

  .content-sections__mobile-tracklist .tracklist__content {
    /* Ensure scroll behavior works in mobile context */
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  }
}
```

---

## Architecture Summary

### Data Flow for Mobile Tracklist:

```
User taps track in mobile tracklist
         ↓
ContentSections.onTrackSelect(trackId)
         ↓
App.handleTrackSelect(trackId)
         ↓
App.setPlayerState (updates trackId)
         ↓
PlayerSection receives new props
         ↓
Player receives notification via onExternalTrackSelect
         ↓
Player.handleTrackSelect loads and plays the track
         ↓
Player state updates (playing, currentTrackId, etc.)
         ↓
Player.onStateChange notifies App
         ↓
App updates playerState
         ↓
ContentSections receives updated props
         ↓
Mobile tracklist shows correct current track
```

### Component Hierarchy:
```
App
├── PlayerSection
│   └── Player
│       ├── Tracklist (desktop only - left floating box)
│       └── [other player components]
└── ContentSections
    ├── Tracklist (mobile only - via content-sections__mobile-tracklist)
    ├── MediaLinksBar
    ├── AboutSection
    ├── ShowsSection
    └── ContactSection
```

---

## Expected Visual Result

### Desktop (≥1100px) - NO CHANGES:
```
┌────────────────────────────────────────────────┐
│                PLAYER SECTION                   │
├──────────┬───────────────────┬─────────────────┤
│          │                   │                 │
│ TRACKLIST│     ARTWORK       │  LYRICS (opt)   │
│  (LEFT)  │     CONTROLS      │     (RIGHT)     │
│          │                   │                 │
└──────────┴───────────────────┴─────────────────┘
┌────────────────────────────────────────────────┐
│               CONTENT SECTIONS                  │
├────────────────────────────────────────────────┤
│            Social Media Links                   │
│               About Section                     │
│               Shows Section                     │
│              Contact Section                    │
└────────────────────────────────────────────────┘
```

### Mobile (<1100px) - NEW BEHAVIOR:
```
┌────────────────────────────────────────────────┐
│                PLAYER SECTION                   │
├────────────────────────────────────────────────┤
│                                                │
│              ARTWORK                            │
│              CONTROLS                           │
│              WAVEFORM                           │
│                                                │
└────────────────────────────────────────────────┘
┌────────────────────────────────────────────────┐
│               CONTENT SECTIONS                  │
├────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────┐ │
│ │            TRACKLIST (NEW!)                │ │
│ │  1. Track One                              │ │
│ │  2. Track Two                              │ │
│ │  [scrollable - 350-400px height]           │ │
│ └────────────────────────────────────────────┘ │
├────────────────────────────────────────────────┤
│        Social Media Icons (2x3 grid)            │
│               About Section                     │
│               Shows Section                     │
│              Contact Section                    │
└────────────────────────────────────────────────┘
```

---

## Testing Checklist

### Desktop Testing (≥1100px):
- [ ] Tracklist still appears on LEFT side of player
- [ ] Tracklist click-to-play works
- [ ] Current track highlights correctly
- [ ] Auto-scroll to current track works
- [ ] No duplicate tracklist visible
- [ ] ContentSections does NOT show tracklist
- [ ] Player layout unchanged

### Tablet Testing (768px - 1099px):
- [ ] Tracklist appears in ContentSections (not in player area)
- [ ] Tracklist is first item in ContentSections
- [ ] Tracklist is positioned above MediaLinksBar
- [ ] Tracklist height is appropriate (~400px)
- [ ] Tracklist is scrollable
- [ ] Click on track loads and plays it
- [ ] Current track highlights correctly
- [ ] Player section shows artwork/controls only

### Mobile Testing (<768px):
- [ ] Tracklist visible in ContentSections
- [ ] Tracklist height adjusted (~350px)
- [ ] Tracklist positioned below player, above social icons
- [ ] Touch scrolling works smoothly
- [ ] Track selection works with touch
- [ ] Current track indicator visible
- [ ] No horizontal scroll issues
- [ ] Appropriate padding on small screens

### Functional Testing (All Breakpoints):
- [ ] Clicking track in mobile tracklist plays that track
- [ ] Current track indicator updates in both desktop and mobile tracklists
- [ ] Player controls (play/pause/next/prev) sync with tracklist state
- [ ] Auto-scroll works when track changes
- [ ] No console errors when switching tracks
- [ ] TypeScript compiles without errors
- [ ] Player state properly shared between components

### State Synchronization:
- [ ] Playing track from mobile tracklist updates player
- [ ] Playing track from player controls updates mobile tracklist
- [ ] Current track stays highlighted across both tracklists
- [ ] Play/pause state reflects correctly in tracklist icons
- [ ] Loading state shows correctly when switching tracks

---

## Notes

### Why This Approach:
- **Minimal desktop changes:** Desktop behavior completely untouched
- **Component reuse:** Same Tracklist component works in both contexts
- **Clean separation:** CSS handles show/hide logic at breakpoints
- **Proper state management:** State lifted to App for sharing
- **Mobile-first enhancement:** Makes previously hidden feature accessible

### Complexity Considerations:
- **State lifting:** Required to share player state between PlayerSection and ContentSections
- **Props drilling:** Necessary but keeps data flow explicit
- **Dual rendering:** Tracklist rendered twice (desktop + mobile) but only one shown at a time
- **Breakpoint coordination:** Must match existing breakpoints for consistency

### Alternative Approaches Considered:
1. **Single tracklist instance that repositions:** More complex, potential for layout thrashing
2. **Modal/overlay tracklist on mobile:** Less discoverable, requires extra tap
3. **Collapsible tracklist above player:** Takes space from player, less intuitive
4. **Current approach (dual render with CSS):** Best balance of simplicity and UX

### Performance Notes:
- **Dual rendering:** Minor impact - tracklist is small and lightweight
- **React reconciliation:** Minimal - only one instance active at a time
- **Scroll performance:** Maintained via virtual scrolling (if list becomes large)

---

## Troubleshooting

**Problem:** Tracklist shows on both desktop and mobile
- **Solution:** Check CSS media queries - ensure `display: none` at ≥1100px for `.content-sections__mobile-tracklist`

**Problem:** Click on mobile tracklist doesn't play track
- **Solution:** Verify props flow from ContentSections → App → PlayerSection → Player

**Problem:** Current track not highlighting in mobile tracklist
- **Solution:** Check that `playerState.currentTrackId` is being passed correctly to ContentSections

**Problem:** TypeScript errors about missing props
- **Solution:** Ensure all interfaces are defined and props are passed at each level

**Problem:** Mobile tracklist too tall/short
- **Solution:** Adjust height in `.content-sections__mobile-tracklist .tracklist` CSS