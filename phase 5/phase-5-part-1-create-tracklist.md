# EXECUTE: Phase 5 Part 1 - Create Tracklist Component

**Prompt for Claude Code:**
"Please implement Phase 5 Part 1 by creating the Tracklist component with all its sub-components (TracklistItem) and styling. Follow all implementation instructions exactly as specified below."

---

## Phase 5 Overview

**Goal:** Add scrollable tracklist component to the LEFT side of the player layout with click-to-play functionality.

**This file covers:** Creating the Tracklist and TracklistItem components with complete styling.

---

## Part 1: Create Tracklist Component Files

### File 1: TracklistItem Component

**Create new file:** `src/components/Tracklist/TracklistItem.tsx`

```typescript
import React from 'react';
import type { Track } from '@/types';
import { formatTime } from '@/utils/formatTime';
import './TracklistItem.css';

interface TracklistItemProps {
  track: Track;
  isCurrentTrack: boolean;
  isPlaying: boolean;
  onClick: () => void;
}

/**
 * TracklistItem Component
 * 
 * Individual track item in the tracklist.
 * Shows track number, title, and duration.
 * Highlights when it's the current track.
 * Shows play/pause icon for current track.
 */
const TracklistItem: React.FC<TracklistItemProps> = ({
  track,
  isCurrentTrack,
  isPlaying,
  onClick,
}) => {
  return (
    <button
      className={`tracklist-item ${isCurrentTrack ? 'tracklist-item--current' : ''}`}
      onClick={onClick}
      aria-label={`Play ${track.title}`}
      aria-current={isCurrentTrack ? 'true' : 'false'}
    >
      {/* Track Number or Play/Pause Icon */}
      <div className="tracklist-item__number">
        {isCurrentTrack ? (
          <div className="tracklist-item__icon">
            {isPlaying ? (
              // Pause icon (two bars)
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <rect x="1" y="1" width="3" height="10" />
                <rect x="8" y="1" width="3" height="10" />
              </svg>
            ) : (
              // Play icon (triangle)
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <polygon points="2,1 2,11 10,6" />
              </svg>
            )}
          </div>
        ) : (
          <span className="tracklist-item__track-number">{track.id}</span>
        )}
      </div>

      {/* Track Title */}
      <div className="tracklist-item__title">{track.title}</div>

      {/* Track Duration */}
      <div className="tracklist-item__duration">
        {formatTime(track.duration)}
      </div>
    </button>
  );
};

export default TracklistItem;
```

---

### File 2: Tracklist Component

**Create new file:** `src/components/Tracklist/Tracklist.tsx`

```typescript
import React, { useRef, useEffect } from 'react';
import type { Track } from '@/types';
import TracklistItem from './TracklistItem';
import './Tracklist.css';

interface TracklistProps {
  tracks: Track[];
  currentTrackId: number | null;
  isPlaying: boolean;
  onTrackSelect: (trackId: number) => void;
}

/**
 * Tracklist Component
 * 
 * Scrollable list of all tracks in the album.
 * Displays on the LEFT side of the player (desktop).
 * Auto-scrolls to keep current track visible.
 * Click any track to play it.
 */
const Tracklist: React.FC<TracklistProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  onTrackSelect,
}) => {
  const tracklistRef = useRef<HTMLDivElement>(null);
  const currentTrackRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to current track when it changes
  useEffect(() => {
    if (!currentTrackId) return;

    const tracklist = tracklistRef.current;
    const currentTrackElement = tracklist?.querySelector('.tracklist-item--current') as HTMLElement;

    if (tracklist && currentTrackElement) {
      // Scroll current track into view (centered if possible)
      currentTrackElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTrackId]);

  return (
    <div ref={tracklistRef} className="tracklist">
      {/* Header */}
      <div className="tracklist__header">
        <h3 className="tracklist__title">Tracklist</h3>
        <span className="tracklist__count">{tracks.length} tracks</span>
      </div>

      {/* Track List */}
      <div className="tracklist__content">
        {tracks.map((track) => (
          <TracklistItem
            key={track.id}
            track={track}
            isCurrentTrack={track.id === currentTrackId}
            isPlaying={isPlaying}
            onClick={() => onTrackSelect(track.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Tracklist;
```

---

### File 3: TracklistItem Styles

**Create new file:** `src/components/Tracklist/TracklistItem.css`

```css
/* ============================================================================
   TRACKLIST ITEM
   ============================================================================ */

.tracklist-item {
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-family: inherit;
  font-size: var(--font-size-sm);
  text-align: left;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  width: 100%;
}

.tracklist-item:hover {
  background-color: var(--color-border);
}

.tracklist-item:active {
  transform: scale(0.98);
}

.tracklist-item:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* ============================================================================
   CURRENT TRACK HIGHLIGHT
   ============================================================================ */

.tracklist-item--current {
  background-color: var(--color-active);
  color: var(--color-bg);
}

.tracklist-item--current:hover {
  background-color: var(--color-hover);
}

/* ============================================================================
   TRACK NUMBER / ICON
   ============================================================================ */

.tracklist-item__number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.tracklist-item__track-number {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.tracklist-item--current .tracklist-item__track-number {
  color: var(--color-bg);
  font-weight: var(--font-weight-bold);
}

.tracklist-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--color-bg);
}

/* ============================================================================
   TRACK TITLE
   ============================================================================ */

.tracklist-item__title {
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tracklist-item--current .tracklist-item__title {
  font-weight: var(--font-weight-bold);
}

/* ============================================================================
   TRACK DURATION
   ============================================================================ */

.tracklist-item__duration {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.tracklist-item--current .tracklist-item__duration {
  color: var(--color-bg);
  opacity: 0.9;
}

/* ============================================================================
   MOBILE ADJUSTMENTS
   ============================================================================ */

@media (max-width: 640px) {
  .tracklist-item {
    grid-template-columns: 32px 1fr auto;
    padding: var(--space-xs) var(--space-sm);
    font-size: var(--font-size-xs);
  }

  .tracklist-item__number {
    width: 32px;
    height: 32px;
  }

  .tracklist-item__track-number {
    font-size: var(--font-size-xs);
  }
}
```

---

### File 4: Tracklist Container Styles

**Create new file:** `src/components/Tracklist/Tracklist.css`

```css
/* ============================================================================
   TRACKLIST CONTAINER
   ============================================================================ */

.tracklist {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 100%;
  transition: background-color var(--transition-normal),
              border-color var(--transition-normal);
}

/* ============================================================================
   HEADER
   ============================================================================ */

.tracklist__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-md) var(--space-sm);
  border-bottom: 1px solid var(--color-border);
}

.tracklist__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.tracklist__count {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

/* ============================================================================
   CONTENT (SCROLLABLE)
   ============================================================================ */

.tracklist__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-xs) 0;
}

/* Custom scrollbar */
.tracklist__content::-webkit-scrollbar {
  width: 8px;
}

.tracklist__content::-webkit-scrollbar-track {
  background: var(--color-bg);
}

.tracklist__content::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: var(--radius-sm);
}

.tracklist__content::-webkit-scrollbar-thumb:hover {
  background: var(--color-hover);
}

/* Firefox scrollbar */
.tracklist__content {
  scrollbar-width: thin;
  scrollbar-color: var(--color-accent) var(--color-bg);
}

/* ============================================================================
   MOBILE ADJUSTMENTS
   ============================================================================ */

@media (max-width: 640px) {
  .tracklist__header {
    padding: var(--space-sm) var(--space-sm) var(--space-xs);
  }

  .tracklist__title {
    font-size: var(--font-size-base);
  }
}
```

---

## Validation Checklist - Part 1

After implementing these files, verify:

- [ ] `src/components/Tracklist/TracklistItem.tsx` created
- [ ] `src/components/Tracklist/TracklistItem.css` created
- [ ] `src/components/Tracklist/Tracklist.tsx` created
- [ ] `src/components/Tracklist/Tracklist.css` created
- [ ] All files compile without TypeScript errors
- [ ] formatTime utility is imported correctly in TracklistItem

**Next Step:** Execute Phase 5 Part 2 to integrate the Tracklist into the Player component.
