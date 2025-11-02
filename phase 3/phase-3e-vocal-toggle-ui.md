# PHASE 3E: VOCAL/INSTRUMENTAL TOGGLE UI

## Claude Code Prompt

```
I'm implementing Phase 3E (Vocal/Instrumental Toggle) for the PRIMEAPE music website.

Please implement:
1. UI button for switching between vocal and instrumental versions
2. Visual indicator of current version
3. Integration with existing toggleVersion logic from Phase 2

Context:
- Phase 2 complete (toggleVersion function already exists in useAudioPlayer)
- Need to add UI button that calls this function
- Button should show current version state

This is a simple UI addition - the logic already exists.
```

---

## Overview

**Sub-Phase:** 3E  
**Feature:** Vocal/Instrumental Toggle Button  
**Complexity:** Simple  
**Time Estimate:** 30 minutes

**What Will Be Built:**
- Toggle button for vocal/instrumental switch
- Visual indicator of current version
- Seamless switching (logic already implemented in Phase 2)

**Dependencies:**
- Phase 2 complete (toggleVersion exists)

---

## Files to Create

```
src/components/Player/VersionToggle.tsx
src/components/Player/VersionToggle.css
```

## Files to Modify

```
src/components/Player/Player.tsx (add VersionToggle button)
```

---

## Implementation Instructions

### File: `src/components/Player/VersionToggle.tsx`

**📁 CREATE NEW FILE:**

```typescript
import React from 'react';
import type { AudioVersion } from '@/types';
import './VersionToggle.css';

interface VersionToggleProps {
  currentVersion: AudioVersion;
  onToggle: () => void;
}

/**
 * VersionToggle Component
 * 
 * Button to toggle between vocal and instrumental versions.
 * Shows "V" for vocal, "I" for instrumental.
 * 
 * @param currentVersion - Current audio version ('vocal' | 'instrumental')
 * @param onToggle - Callback when button clicked
 */
const VersionToggle: React.FC<VersionToggleProps> = ({
  currentVersion,
  onToggle,
}) => {
  const isVocal = currentVersion === 'vocal';

  return (
    <button
      className={`version-toggle ${isVocal ? 'version-toggle--vocal' : 'version-toggle--instrumental'}`}
      onClick={onToggle}
      aria-label={`Switch to ${isVocal ? 'instrumental' : 'vocal'} version`}
      title={`Current: ${isVocal ? 'Vocal' : 'Instrumental'}\nClick to switch`}
    >
      <span className="version-toggle__icon">
        {isVocal ? 'V' : 'I'}
      </span>
      <span className="version-toggle__label">
        {isVocal ? 'Vocal' : 'Instrumental'}
      </span>
    </button>
  );
};

export default VersionToggle;
```

---

### File: `src/components/Player/VersionToggle.css`

**📁 CREATE NEW FILE:**

```css
.version-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--color-border);
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.version-toggle:hover {
  border-color: var(--color-accent);
  color: var(--color-text-primary);
  background-color: var(--color-border);
}

.version-toggle:active {
  transform: scale(0.98);
}

.version-toggle:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

.version-toggle__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-xs);
}

/* Vocal version styling */
.version-toggle--vocal .version-toggle__icon {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

/* Instrumental version styling */
.version-toggle--instrumental .version-toggle__icon {
  background-color: var(--color-border);
  color: var(--color-text-primary);
}

.version-toggle--instrumental:hover .version-toggle__icon {
  background-color: var(--color-accent);
  color: var(--color-bg);
}

.version-toggle__label {
  font-size: var(--font-size-xs);
}

/* Mobile: Hide label, show icon only */
@media (max-width: 768px) {
  .version-toggle {
    padding: var(--space-xs);
    min-width: 36px;
  }

  .version-toggle__label {
    display: none;
  }

  .version-toggle__icon {
    width: 24px;
    height: 24px;
  }
}
```

---

### File: `src/components/Player/Player.tsx`

**🔍 FIND:**
```typescript
import EqualizerToggle from './EqualizerToggle';
```

**✏️ REPLACE WITH:**
```typescript
import EqualizerToggle from './EqualizerToggle';
import VersionToggle from './VersionToggle';
```

**🔍 FIND:**
```typescript
      {/* Playback Controls */}
      <Controls
        playbackState={playbackState}
        onPlayPause={togglePlayPause}
        onPrevious={prevTrack}
        onNext={nextTrack}
      />
```

**➕ ADD AFTER:**
```typescript
      {/* Version Toggle (Vocal/Instrumental) */}
      <div className="player__version-row">
        <VersionToggle
          currentVersion={audioVersion}
          onToggle={toggleVersion}
        />
      </div>
```

**🔍 FIND (in Player.css):**
```css
.player__secondary-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-sm) 0;
}
```

**➕ ADD AFTER:**
```css
.player__version-row {
  display: flex;
  justify-content: center;
  padding: var(--space-sm) 0;
}
```

---

## Validation Checklist

- [ ] Version toggle button displays correctly
- [ ] Shows "V" icon for vocal version
- [ ] Shows "I" icon for instrumental version
- [ ] Label shows "Vocal" or "Instrumental"
- [ ] Clicking button switches version seamlessly
- [ ] Audio position maintained during switch (from Phase 2)
- [ ] Button styling fits with other controls
- [ ] Mobile: shows icon only (no label)
- [ ] Hover effects work
- [ ] Accessible (aria-label, keyboard)

## Testing

1. **Initial State:**
   - Button should show "I" (instrumental) by default
   
2. **Toggle to Vocal:**
   - Click button
   - Should change to "V"
   - Audio should switch (if vocals available)
   - Playback position should be maintained
   
3. **Toggle Back:**
   - Click again
   - Should return to "I"
   - Audio switches to instrumental
   
4. **During Playback:**
   - Play a track
   - Toggle version while playing
   - Audio should switch smoothly without stopping

5. **Mobile:**
   - Resize to mobile width
   - Verify label hidden, icon visible

## Known Pitfalls

1. **No Vocal Version Available:**
   - Button still works, but plays instrumental (as intended)
   - Consider graying out button if no vocals exist (optional)

2. **Switch Delay:**
   - Small delay (100-200ms) is normal while loading new file
   - Position is restored once loaded

## Completion Criteria

- ✅ Toggle button functional
- ✅ Visual indicator clear
- ✅ Seamless switching works
- ✅ Responsive on mobile
- ✅ No TypeScript errors

**Next:** Proceed to `phase-3f-keyboard-shortcuts.md`

---

# END OF PHASE 3E INSTRUCTIONS
