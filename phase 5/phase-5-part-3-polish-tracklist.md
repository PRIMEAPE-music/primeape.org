# EXECUTE: Phase 5 Part 3 - Polish & Final Touches

**Prompt for Claude Code:**
"Please implement Phase 5 Part 3 by adding polish, accessibility improvements, and final adjustments to the tracklist. Follow all implementation instructions exactly as specified below."

---

## Part 3: Polish, Accessibility, and Final Adjustments

### Change 1: Add Hover Effects and Transitions

**File:** `src/components/Tracklist/TracklistItem.css`

**Find the base `.tracklist-item` rule** (around line 8-20):

```css
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
```

**Add transform transition:**

```css
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
  transition: background-color var(--transition-fast),
              transform var(--transition-fast);
  width: 100%;
}
```

---

### Change 2: Add Loading State Support

**File:** `src/components/Tracklist/TracklistItem.tsx`

**Add disabled state when track is loading:**

**Find the component props interface** (around line 5-10):

```typescript
interface TracklistItemProps {
  track: Track;
  isCurrentTrack: boolean;
  isPlaying: boolean;
  onClick: () => void;
}
```

**Add isLoading prop:**

```typescript
interface TracklistItemProps {
  track: Track;
  isCurrentTrack: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  onClick: () => void;
}
```

**Update the component signature** (around line 18):

```typescript
const TracklistItem: React.FC<TracklistItemProps> = ({
  track,
  isCurrentTrack,
  isPlaying,
  onClick,
}) => {
```

**Change to:**

```typescript
const TracklistItem: React.FC<TracklistItemProps> = ({
  track,
  isCurrentTrack,
  isPlaying,
  isLoading,
  onClick,
}) => {
```

**Update the button element** (around line 21-25):

```typescript
  return (
    <button
      className={`tracklist-item ${isCurrentTrack ? 'tracklist-item--current' : ''}`}
      onClick={onClick}
      aria-label={`Play ${track.title}`}
      aria-current={isCurrentTrack ? 'true' : 'false'}
    >
```

**Add disabled attribute:**

```typescript
  return (
    <button
      className={`tracklist-item ${isCurrentTrack ? 'tracklist-item--current' : ''}`}
      onClick={onClick}
      disabled={isLoading}
      aria-label={`Play ${track.title}`}
      aria-current={isCurrentTrack ? 'true' : 'false'}
    >
```

---

### Change 3: Update Tracklist to Pass Loading State

**File:** `src/components/Tracklist/Tracklist.tsx`

**Find the props interface** (around line 5-10):

```typescript
interface TracklistProps {
  tracks: Track[];
  currentTrackId: number | null;
  isPlaying: boolean;
  onTrackSelect: (trackId: number) => void;
}
```

**Add isLoading prop:**

```typescript
interface TracklistProps {
  tracks: Track[];
  currentTrackId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  onTrackSelect: (trackId: number) => void;
}
```

**Update component signature** (around line 23):

```typescript
const Tracklist: React.FC<TracklistProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  onTrackSelect,
}) => {
```

**Change to:**

```typescript
const Tracklist: React.FC<TracklistProps> = ({
  tracks,
  currentTrackId,
  isPlaying,
  isLoading,
  onTrackSelect,
}) => {
```

**Update TracklistItem rendering** (around line 57-65):

```typescript
        {tracks.map((track) => (
          <TracklistItem
            key={track.id}
            track={track}
            isCurrentTrack={track.id === currentTrackId}
            isPlaying={isPlaying}
            onClick={() => onTrackSelect(track.id)}
          />
        ))}
```

**Add isLoading prop:**

```typescript
        {tracks.map((track) => (
          <TracklistItem
            key={track.id}
            track={track}
            isCurrentTrack={track.id === currentTrackId}
            isPlaying={isPlaying}
            isLoading={isLoading && track.id === currentTrackId}
            onClick={() => onTrackSelect(track.id)}
          />
        ))}
```

---

### Change 4: Pass Loading State from Player

**File:** `src/components/Player/Player.tsx`

**Find the Tracklist component in JSX** (around line 155-162):

```typescript
        <div className="player__floating-box player__floating-box--tracklist">
          <Tracklist
            tracks={FOUNDATION_ALBUM.tracks}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            onTrackSelect={handleTrackSelect}
          />
        </div>
```

**Add isLoading prop:**

```typescript
        <div className="player__floating-box player__floating-box--tracklist">
          <Tracklist
            tracks={FOUNDATION_ALBUM.tracks}
            currentTrackId={currentTrackId}
            isPlaying={isPlaying}
            isLoading={playbackState === 'loading'}
            onTrackSelect={handleTrackSelect}
          />
        </div>
```

---

### Change 5: Add Disabled State Styling

**File:** `src/components/Tracklist/TracklistItem.css`

**Add at the end of the file** (after the mobile adjustments):

```css
/* ============================================================================
   DISABLED STATE
   ============================================================================ */

.tracklist-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

### Change 6: Add Keyboard Navigation Support

**File:** `src/components/Tracklist/TracklistItem.tsx`

**Update the button element to support keyboard activation:**

**Find the button opening tag** (around line 21-27):

```typescript
    <button
      className={`tracklist-item ${isCurrentTrack ? 'tracklist-item--current' : ''}`}
      onClick={onClick}
      disabled={isLoading}
      aria-label={`Play ${track.title}`}
      aria-current={isCurrentTrack ? 'true' : 'false'}
    >
```

**Add keyboard handler:**

```typescript
    <button
      className={`tracklist-item ${isCurrentTrack ? 'tracklist-item--current' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      disabled={isLoading}
      aria-label={`Play ${track.title}`}
      aria-current={isCurrentTrack ? 'true' : 'false'}
      tabIndex={0}
    >
```

---

### Change 7: Add Smooth Scroll Behavior

**File:** `src/components/Tracklist/Tracklist.css`

**Find the `.tracklist__content` rule:**

```css
.tracklist__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-xs) 0;
}
```

**Add scroll behavior:**

```css
.tracklist__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-xs) 0;
  scroll-behavior: smooth;
}
```

---

### Change 8: Add Empty State (Optional Safety)

**File:** `src/components/Tracklist/Tracklist.tsx`

**Add empty state handling after the header:**

**Find the content section** (around line 52-65):

```typescript
      {/* Track List */}
      <div className="tracklist__content">
        {tracks.map((track) => (
          <TracklistItem
            key={track.id}
            track={track}
            isCurrentTrack={track.id === currentTrackId}
            isPlaying={isPlaying}
            isLoading={isLoading && track.id === currentTrackId}
            onClick={() => onTrackSelect(track.id)}
          />
        ))}
      </div>
```

**Add empty check:**

```typescript
      {/* Track List */}
      <div className="tracklist__content">
        {tracks.length === 0 ? (
          <div className="tracklist__empty">
            <p>No tracks available</p>
          </div>
        ) : (
          tracks.map((track) => (
            <TracklistItem
              key={track.id}
              track={track}
              isCurrentTrack={track.id === currentTrackId}
              isPlaying={isPlaying}
              isLoading={isLoading && track.id === currentTrackId}
              onClick={() => onTrackSelect(track.id)}
            />
          ))
        )}
      </div>
```

**Add empty state styling to Tracklist.css:**

```css
/* Empty state */
.tracklist__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  color: var(--color-text-secondary);
  text-align: center;
}
```

---

## Validation Checklist - Part 3

### Visual Polish
- [ ] Hover effects work smoothly on tracklist items
- [ ] Current track highlighting is clear and visible
- [ ] Transitions are smooth (no janky animations)
- [ ] Loading state shows correctly (disabled/dimmed)

### Accessibility
- [ ] Can navigate tracklist with Tab key
- [ ] Can activate tracks with Enter or Space
- [ ] Screen readers announce track info properly
- [ ] Focus indicators are visible (outline on focus)
- [ ] ARIA labels are present and descriptive

### Functionality
- [ ] Clicking current track toggles play/pause
- [ ] Clicking different track loads and plays it
- [ ] Loading state prevents clicking during track load
- [ ] Auto-scroll keeps current track visible
- [ ] Scrollbar appears when needed (16+ tracks)

### Edge Cases
- [ ] Empty tracklist shows appropriate message
- [ ] Very long track titles truncate with ellipsis
- [ ] Rapid clicking doesn't break the player
- [ ] Keyboard and mouse interactions work together

---

## Phase 5 Complete Summary

**Files Created:**
1. `src/components/Tracklist/TracklistItem.tsx` - Individual track component
2. `src/components/Tracklist/TracklistItem.css` - Track item styling
3. `src/components/Tracklist/Tracklist.tsx` - Tracklist container
4. `src/components/Tracklist/Tracklist.css` - Container styling

**Files Modified:**
1. `src/components/Player/Player.tsx` - Added tracklist integration and handler
2. `src/components/Player/Player.css` - Added tracklist layout styles
3. `src/hooks/useAudioPlayer.ts` - Verified loadTrack is exposed

**Features Implemented:**
- ✅ Scrollable tracklist on LEFT side (desktop)
- ✅ Click-to-play functionality
- ✅ Current track highlighting
- ✅ Play/pause icon for current track
- ✅ Auto-scroll to current track
- ✅ Loading state handling
- ✅ Keyboard navigation support
- ✅ Accessibility (ARIA labels, focus management)
- ✅ Smooth transitions and hover effects

**Ready for Phase 6:** Content Sections (Media links, About, Shows, Contact)
