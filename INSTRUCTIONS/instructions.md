# PHASE 11: Analytics & Tracking

## Phase Overview

**Phase Number:** 11
**Phase Name:** Analytics & Tracking
**Estimated Time:** 2-3 hours
**Complexity:** Simple-Moderate

### Goals
- Integrate Google Analytics 4 (GA4) with production-only loading
- Create type-safe analytics utility functions
- Implement comprehensive custom event tracking across all user interactions
- Track player events, navigation, social clicks, and errors
- Update footer with analytics notice

### What Will Be Built/Modified

**New Files:**
- `src/utils/analytics.ts` - Core analytics utility with all tracking functions
- `src/hooks/useAnalytics.ts` - React hook for component-level analytics
- `src/types/analytics.ts` - TypeScript types for GA4 and custom events

**Modified Files:**
- `index.html` - Add GA4 gtag script (production-only via Vite)
- `src/types/index.ts` - Export analytics types
- `src/hooks/useAudioPlayer.ts` - Add play/pause/complete/error tracking
- `src/components/AudioPlayer/AudioPlayer.tsx` - Add seek/volume/toggle tracking
- `src/components/AudioPlayer/PlayerControls.tsx` - Add shuffle/repeat tracking
- `src/components/Lyrics/LyricsToggle.tsx` - Add lyrics toggle tracking
- `src/components/ContentSections/MediaLinksBar.tsx` - Add social click tracking
- `src/components/ContentSections/ContactSection.tsx` - Add form submission tracking
- `src/components/ContentSections/DownloadSection.tsx` - Add download/donation tracking
- `src/components/Layout/Footer.tsx` - Replace tech stack text with analytics notice
- `src/App.tsx` - Add section view tracking with Intersection Observer

### Dependencies on Previous Phases
- Phase 1-6 must be complete (core site structure)
- Phase 8 should be complete for download tracking (or skip those events if not implemented)

### Success Criteria
- [ ] GA4 script loads ONLY in production builds
- [ ] No analytics calls in development mode (check console)
- [ ] All 17 custom events fire correctly when triggered
- [ ] Events appear in GA4 Realtime dashboard within minutes
- [ ] TypeScript compiles with no errors
- [ ] Footer displays "This site uses analytics" instead of tech stack text
- [ ] No console errors related to gtag

---

## Architectural Decisions

### Design Pattern: Centralized Analytics Utility
All analytics logic lives in `src/utils/analytics.ts` with a single `trackEvent()` function. Components import specific tracking functions (e.g., `trackPlay()`, `trackSocialClick()`) that wrap the core function with proper typing.

**Rationale:**
- Single source of truth for event names and parameters
- Easy to modify event structure without touching components
- Type-safe event parameters prevent typos
- Simple to disable/mock for testing

### Environment Detection Strategy
We use Vite's `import.meta.env.PROD` to detect production builds. The GA4 script is conditionally injected, and all tracking functions check this flag before firing.

**Rationale:**
- Prevents polluting analytics data during development
- No environment variables needed
- Built into Vite's build system

### Event Naming Convention
All custom events use `snake_case` to match GA4's recommended format. Event names are descriptive and grouped by feature:
- Player events: `track_play`, `track_pause`, `track_complete`, `track_skip`
- UI events: `lyrics_toggle`, `version_toggle`, `shuffle_toggle`
- Engagement events: `social_click`, `download_click`, `section_view`

### Hook vs Direct Import
We provide both:
1. `useAnalytics()` hook - For components needing multiple tracking functions
2. Direct imports - For one-off tracking in event handlers

**Rationale:** Flexibility for different component needs without over-engineering.

---

## Technical Specifications

### GA4 Configuration
- **Measurement ID:** `G-7SZ64PPTWR`
- **Data Stream:** Web
- **Enhanced Measurement:** Enabled (automatic pageviews, scrolls, outbound clicks)

### No New Dependencies Required
GA4 uses the global `gtag()` function injected via script tag. No npm packages needed.

### TypeScript Global Declaration
We must declare `gtag` on the Window interface to satisfy TypeScript:

```typescript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
```

---

## Implementation Instructions

---

### File 1: `src/types/analytics.ts` (NEW FILE)

**Purpose:** Type definitions for all analytics events and parameters.

**Complete file contents:**

```typescript
// ============================================================================
// ANALYTICS TYPE DEFINITIONS
// ============================================================================

/**
 * GA4 gtag function signature
 */
export type GtagCommand = 'config' | 'event' | 'js' | 'set';

/**
 * Extend Window interface to include gtag
 */
declare global {
  interface Window {
    gtag: (
      command: GtagCommand,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

// ============================================================================
// CUSTOM EVENT TYPES
// ============================================================================

/**
 * All custom event names used in the application
 */
export type AnalyticsEventName =
  | 'track_play'
  | 'track_pause'
  | 'track_complete'
  | 'track_skip'
  | 'seek'
  | 'version_toggle'
  | 'volume_change'
  | 'shuffle_toggle'
  | 'repeat_toggle'
  | 'lyrics_toggle'
  | 'download_click'
  | 'donation_click'
  | 'social_click'
  | 'merch_view'
  | 'contact_submit'
  | 'section_view'
  | 'audio_error';

/**
 * Base event parameters (optional, sent with all events)
 */
export interface BaseEventParams {
  page_location?: string;
  page_title?: string;
}

/**
 * Track play event parameters
 */
export interface TrackPlayParams extends BaseEventParams {
  track_id: number;
  track_title: string;
  audio_version: 'vocal' | 'instrumental';
}

/**
 * Track pause event parameters
 */
export interface TrackPauseParams extends BaseEventParams {
  track_id: number;
  track_title: string;
  current_time: number;
  percent_complete: number;
}

/**
 * Track complete event parameters
 */
export interface TrackCompleteParams extends BaseEventParams {
  track_id: number;
  track_title: string;
  audio_version: 'vocal' | 'instrumental';
}

/**
 * Track skip event parameters (skipped before 30% complete)
 */
export interface TrackSkipParams extends BaseEventParams {
  track_id: number;
  track_title: string;
  percent_complete: number;
}

/**
 * Seek event parameters
 */
export interface SeekParams extends BaseEventParams {
  track_id: number;
  seek_to_percent: number;
}

/**
 * Version toggle event parameters
 */
export interface VersionToggleParams extends BaseEventParams {
  track_id: number;
  new_version: 'vocal' | 'instrumental';
}

/**
 * Volume change event parameters
 */
export interface VolumeChangeParams extends BaseEventParams {
  new_volume: number; // 0-100
}

/**
 * Shuffle toggle event parameters
 */
export interface ShuffleToggleParams extends BaseEventParams {
  enabled: boolean;
}

/**
 * Repeat toggle event parameters
 */
export interface RepeatToggleParams extends BaseEventParams {
  mode: 'off' | 'all' | 'one';
}

/**
 * Lyrics toggle event parameters
 */
export interface LyricsToggleParams extends BaseEventParams {
  new_state: 'hidden' | 'panel' | 'integrated';
}

/**
 * Social click event parameters
 */
export interface SocialClickParams extends BaseEventParams {
  platform: string;
}

/**
 * Merch view event parameters
 */
export interface MerchViewParams extends BaseEventParams {
  product_id: string;
  product_name: string;
}

/**
 * Contact submit event parameters
 */
export interface ContactSubmitParams extends BaseEventParams {
  form_type: 'general' | 'booking';
}

/**
 * Section view event parameters
 */
export interface SectionViewParams extends BaseEventParams {
  section_name: string;
}

/**
 * Audio error event parameters
 */
export interface AudioErrorParams extends BaseEventParams {
  track_id: number;
  error_message: string;
}

/**
 * Union type of all event parameter types
 */
export type AnalyticsEventParams =
  | TrackPlayParams
  | TrackPauseParams
  | TrackCompleteParams
  | TrackSkipParams
  | SeekParams
  | VersionToggleParams
  | VolumeChangeParams
  | ShuffleToggleParams
  | RepeatToggleParams
  | LyricsToggleParams
  | SocialClickParams
  | MerchViewParams
  | ContactSubmitParams
  | SectionViewParams
  | AudioErrorParams
  | BaseEventParams;
```

---

### File 2: `src/utils/analytics.ts` (NEW FILE)

**Purpose:** Core analytics utility with all tracking functions.

**Complete file contents:**

```typescript
// ============================================================================
// GOOGLE ANALYTICS 4 UTILITY
// ============================================================================

import type {
  AnalyticsEventName,
  TrackPlayParams,
  TrackPauseParams,
  TrackCompleteParams,
  TrackSkipParams,
  SeekParams,
  VersionToggleParams,
  VolumeChangeParams,
  ShuffleToggleParams,
  RepeatToggleParams,
  LyricsToggleParams,
  SocialClickParams,
  MerchViewParams,
  ContactSubmitParams,
  SectionViewParams,
  AudioErrorParams,
} from '@/types/analytics';

// GA4 Measurement ID
const GA_MEASUREMENT_ID = 'G-7SZ64PPTWR';

/**
 * Check if we're in production environment
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

/**
 * Check if gtag is available
 */
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Core event tracking function
 * Only fires in production when gtag is available
 */
export const trackEvent = (
  eventName: AnalyticsEventName,
  params?: Record<string, unknown>
): void => {
  if (!isProduction()) {
    // Log to console in development for debugging
    console.log(`[Analytics Dev] ${eventName}`, params);
    return;
  }

  if (!isGtagAvailable()) {
    console.warn('[Analytics] gtag not available');
    return;
  }

  window.gtag('event', eventName, params);
};

// ============================================================================
// PLAYER TRACKING FUNCTIONS
// ============================================================================

/**
 * Track when a user starts playing a track
 */
export const trackPlay = (params: TrackPlayParams): void => {
  trackEvent('track_play', params);
};

/**
 * Track when a user pauses a track
 */
export const trackPause = (params: TrackPauseParams): void => {
  trackEvent('track_pause', params);
};

/**
 * Track when a track plays to completion
 */
export const trackComplete = (params: TrackCompleteParams): void => {
  trackEvent('track_complete', params);
};

/**
 * Track when a user skips a track before 30% complete
 */
export const trackSkip = (params: TrackSkipParams): void => {
  trackEvent('track_skip', params);
};

/**
 * Track when a user seeks/scrubs in a track
 */
export const trackSeek = (params: SeekParams): void => {
  trackEvent('seek', params);
};

/**
 * Track when a user toggles between vocal/instrumental
 */
export const trackVersionToggle = (params: VersionToggleParams): void => {
  trackEvent('version_toggle', params);
};

/**
 * Track volume changes
 * Note: Debounce this in the component to avoid excessive events
 */
export const trackVolumeChange = (params: VolumeChangeParams): void => {
  trackEvent('volume_change', params);
};

/**
 * Track shuffle toggle
 */
export const trackShuffleToggle = (params: ShuffleToggleParams): void => {
  trackEvent('shuffle_toggle', params);
};

/**
 * Track repeat mode changes
 */
export const trackRepeatToggle = (params: RepeatToggleParams): void => {
  trackEvent('repeat_toggle', params);
};

// ============================================================================
// UI TRACKING FUNCTIONS
// ============================================================================

/**
 * Track lyrics display state changes
 */
export const trackLyricsToggle = (params: LyricsToggleParams): void => {
  trackEvent('lyrics_toggle', params);
};

/**
 * Track social/streaming link clicks
 */
export const trackSocialClick = (params: SocialClickParams): void => {
  trackEvent('social_click', params);
};

/**
 * Track merch product modal opens
 */
export const trackMerchView = (params: MerchViewParams): void => {
  trackEvent('merch_view', params);
};

// ============================================================================
// CONVERSION TRACKING FUNCTIONS
// ============================================================================

/**
 * Track download button clicks
 */
export const trackDownloadClick = (): void => {
  trackEvent('download_click');
};

/**
 * Track donation/tip button clicks
 */
export const trackDonationClick = (): void => {
  trackEvent('donation_click');
};

/**
 * Track contact form submissions
 */
export const trackContactSubmit = (params: ContactSubmitParams): void => {
  trackEvent('contact_submit', params);
};

// ============================================================================
// ENGAGEMENT TRACKING FUNCTIONS
// ============================================================================

/**
 * Track when a section comes into view
 */
export const trackSectionView = (params: SectionViewParams): void => {
  trackEvent('section_view', params);
};

// ============================================================================
// ERROR TRACKING FUNCTIONS
// ============================================================================

/**
 * Track audio playback errors
 */
export const trackAudioError = (params: AudioErrorParams): void => {
  trackEvent('audio_error', params);
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize GA4 (called once on app load)
 * This is a fallback - primary initialization is in index.html
 */
export const initializeAnalytics = (): void => {
  if (!isProduction()) {
    console.log('[Analytics] Development mode - tracking disabled');
    return;
  }

  if (isGtagAvailable()) {
    console.log('[Analytics] GA4 initialized');
  } else {
    console.warn('[Analytics] GA4 script not loaded');
  }
};
```

---

### File 3: `src/hooks/useAnalytics.ts` (NEW FILE)

**Purpose:** React hook providing analytics functions to components.

**Complete file contents:**

```typescript
// ============================================================================
// useAnalytics Hook
// ============================================================================

import { useCallback, useRef } from 'react';
import {
  trackPlay,
  trackPause,
  trackComplete,
  trackSkip,
  trackSeek,
  trackVersionToggle,
  trackVolumeChange,
  trackShuffleToggle,
  trackRepeatToggle,
  trackLyricsToggle,
  trackSocialClick,
  trackMerchView,
  trackDownloadClick,
  trackDonationClick,
  trackContactSubmit,
  trackSectionView,
  trackAudioError,
  isProduction,
} from '@/utils/analytics';

import type {
  TrackPlayParams,
  TrackPauseParams,
  TrackCompleteParams,
  TrackSkipParams,
  SeekParams,
  VersionToggleParams,
  VolumeChangeParams,
  ShuffleToggleParams,
  RepeatToggleParams,
  LyricsToggleParams,
  SocialClickParams,
  MerchViewParams,
  ContactSubmitParams,
  SectionViewParams,
  AudioErrorParams,
} from '@/types/analytics';

/**
 * Custom hook for analytics tracking
 * Provides memoized tracking functions and utilities
 */
export function useAnalytics() {
  // Ref to track if volume change has been debounced
  const volumeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ref to track sections already viewed (prevent duplicate events)
  const viewedSectionsRef = useRef<Set<string>>(new Set());

  /**
   * Track play with memoization
   */
  const handleTrackPlay = useCallback((params: TrackPlayParams) => {
    trackPlay(params);
  }, []);

  /**
   * Track pause with memoization
   */
  const handleTrackPause = useCallback((params: TrackPauseParams) => {
    trackPause(params);
  }, []);

  /**
   * Track completion with memoization
   */
  const handleTrackComplete = useCallback((params: TrackCompleteParams) => {
    trackComplete(params);
  }, []);

  /**
   * Track skip with memoization
   */
  const handleTrackSkip = useCallback((params: TrackSkipParams) => {
    trackSkip(params);
  }, []);

  /**
   * Track seek with memoization
   */
  const handleSeek = useCallback((params: SeekParams) => {
    trackSeek(params);
  }, []);

  /**
   * Track version toggle with memoization
   */
  const handleVersionToggle = useCallback((params: VersionToggleParams) => {
    trackVersionToggle(params);
  }, []);

  /**
   * Track volume change with debouncing (500ms)
   * Prevents excessive events while user drags slider
   */
  const handleVolumeChange = useCallback((params: VolumeChangeParams) => {
    if (volumeDebounceRef.current) {
      clearTimeout(volumeDebounceRef.current);
    }
    volumeDebounceRef.current = setTimeout(() => {
      trackVolumeChange(params);
    }, 500);
  }, []);

  /**
   * Track shuffle toggle with memoization
   */
  const handleShuffleToggle = useCallback((params: ShuffleToggleParams) => {
    trackShuffleToggle(params);
  }, []);

  /**
   * Track repeat toggle with memoization
   */
  const handleRepeatToggle = useCallback((params: RepeatToggleParams) => {
    trackRepeatToggle(params);
  }, []);

  /**
   * Track lyrics toggle with memoization
   */
  const handleLyricsToggle = useCallback((params: LyricsToggleParams) => {
    trackLyricsToggle(params);
  }, []);

  /**
   * Track social click with memoization
   */
  const handleSocialClick = useCallback((params: SocialClickParams) => {
    trackSocialClick(params);
  }, []);

  /**
   * Track merch view with memoization
   */
  const handleMerchView = useCallback((params: MerchViewParams) => {
    trackMerchView(params);
  }, []);

  /**
   * Track download click with memoization
   */
  const handleDownloadClick = useCallback(() => {
    trackDownloadClick();
  }, []);

  /**
   * Track donation click with memoization
   */
  const handleDonationClick = useCallback(() => {
    trackDonationClick();
  }, []);

  /**
   * Track contact submit with memoization
   */
  const handleContactSubmit = useCallback((params: ContactSubmitParams) => {
    trackContactSubmit(params);
  }, []);

  /**
   * Track section view with deduplication
   * Only fires once per section per page load
   */
  const handleSectionView = useCallback((params: SectionViewParams) => {
    if (viewedSectionsRef.current.has(params.section_name)) {
      return; // Already tracked this section
    }
    viewedSectionsRef.current.add(params.section_name);
    trackSectionView(params);
  }, []);

  /**
   * Track audio error with memoization
   */
  const handleAudioError = useCallback((params: AudioErrorParams) => {
    trackAudioError(params);
  }, []);

  return {
    // Player tracking
    trackPlay: handleTrackPlay,
    trackPause: handleTrackPause,
    trackComplete: handleTrackComplete,
    trackSkip: handleTrackSkip,
    trackSeek: handleSeek,
    trackVersionToggle: handleVersionToggle,
    trackVolumeChange: handleVolumeChange,
    trackShuffleToggle: handleShuffleToggle,
    trackRepeatToggle: handleRepeatToggle,

    // UI tracking
    trackLyricsToggle: handleLyricsToggle,
    trackSocialClick: handleSocialClick,
    trackMerchView: handleMerchView,

    // Conversion tracking
    trackDownloadClick: handleDownloadClick,
    trackDonationClick: handleDonationClick,
    trackContactSubmit: handleContactSubmit,

    // Engagement tracking
    trackSectionView: handleSectionView,

    // Error tracking
    trackAudioError: handleAudioError,

    // Utility
    isProduction: isProduction(),
  };
}
```

---

### File 4: `src/types/index.ts` (MODIFY)

**Purpose:** Export analytics types from the main types barrel file.

📁 `src/types/index.ts`

🔍 **FIND:**
```typescript
// ============================================================================
// ANALYTICS TYPES (for Phase 11)
// ============================================================================

export interface PlayEvent {
  trackId: number;
  timestamp: number;
  audioVersion: AudioVersion;
}

export interface DownloadEvent {
  timestamp: number;
  userAgent: string;
}
```

✏️ **REPLACE WITH:**
```typescript
// ============================================================================
// ANALYTICS TYPES (Phase 11)
// ============================================================================

// Re-export all analytics types from dedicated file
export * from './analytics';

// Legacy types (kept for backwards compatibility)
export interface PlayEvent {
  trackId: number;
  timestamp: number;
  audioVersion: AudioVersion;
}

export interface DownloadEvent {
  timestamp: number;
  userAgent: string;
}
```

---

### File 5: `index.html` (MODIFY)

**Purpose:** Add GA4 gtag script that only loads in production.

📁 `index.html`

🔍 **FIND:**
```html
    <!-- Preconnect for performance (if using external fonts later) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
```

✏️ **REPLACE WITH:**
```html
    <!-- Preconnect for performance (if using external fonts later) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />

    <!-- Google Analytics 4 (Production Only) -->
    <script>
      // Only load GA4 in production
      if (window.location.hostname !== 'localhost' && 
          window.location.hostname !== '127.0.0.1' &&
          !window.location.hostname.includes('netlify.app')) {
        // Load gtag.js
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7SZ64PPTWR';
        document.head.appendChild(script);

        // Initialize dataLayer and gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-7SZ64PPTWR', {
          send_page_view: true,
          cookie_flags: 'SameSite=None;Secure'
        });

        // Make gtag globally available
        window.gtag = gtag;
      } else {
        // Development mode - create no-op gtag
        window.dataLayer = [];
        window.gtag = function() {
          console.log('[GA4 Dev]', arguments);
        };
      }
    </script>
```

**Note:** This approach:
- Checks hostname to detect development environments
- Excludes `localhost`, `127.0.0.1`, and Netlify preview deployments
- Only loads the external GA4 script in production
- Creates a no-op gtag in development for safe function calls

---

### File 6: `src/components/Layout/Footer.tsx` (MODIFY)

**Purpose:** Replace tech stack text with analytics notice.

📁 `src/components/Layout/Footer.tsx`

🔍 **FIND:**
```typescript
Website built with React & TypeScript
```

✏️ **REPLACE WITH:**
```typescript
This site uses analytics
```

**Note:** This is a simple text replacement. The exact string may vary - search for any text mentioning "React" or "TypeScript" in the footer and replace it.

---

### File 7: `src/components/ContentSections/MediaLinksBar.tsx` (MODIFY)

**Purpose:** Add tracking for social/streaming link clicks.

📁 `src/components/ContentSections/MediaLinksBar.tsx`

🔍 **FIND** (at top of file, after existing imports):
```typescript
import './MediaLinksBar.css';
```

✏️ **REPLACE WITH:**
```typescript
import './MediaLinksBar.css';
import { trackSocialClick } from '@/utils/analytics';
```

🔍 **FIND** (the link click handler or where links are rendered - look for `<a href=` tags):

If links are rendered like this:
```typescript
<a href={link.url} target="_blank" rel="noopener noreferrer">
```

✏️ **REPLACE WITH:**
```typescript
<a 
  href={link.url} 
  target="_blank" 
  rel="noopener noreferrer"
  onClick={() => trackSocialClick({ platform: link.name.toLowerCase() })}
>
```

**Alternative approach if links use a different structure:**

Add an onClick handler to each social link that calls:
```typescript
trackSocialClick({ platform: 'spotify' }) // or 'instagram', 'youtube', 'bandcamp', 'apple', 'tiktok'
```

The platform name should match the link being clicked, using lowercase.

---

### File 8: `src/components/ContentSections/ContactSection.tsx` (MODIFY)

**Purpose:** Add tracking for successful form submissions.

📁 `src/components/ContentSections/ContactSection.tsx`

🔍 **FIND** (at top of file, after existing imports):
```typescript
import './ContactSection.css';
```

✏️ **REPLACE WITH:**
```typescript
import './ContactSection.css';
import { trackContactSubmit } from '@/utils/analytics';
```

🔍 **FIND** (inside the handleSubmit function, after successful submission):
```typescript
        if (response.ok) {
          setSubmissionState('success');
          // Reset form
          setFormData({
            name: '',
            email: '',
            message: '',
            formType: activeTab
          });
        }
```

✏️ **REPLACE WITH:**
```typescript
        if (response.ok) {
          setSubmissionState('success');
          
          // Track successful submission
          trackContactSubmit({ form_type: activeTab });
          
          // Reset form
          setFormData({
            name: '',
            email: '',
            message: '',
            formType: activeTab
          });
        }
```

---

### File 9: `src/hooks/useAudioPlayer.ts` (MODIFY)

**Purpose:** Add comprehensive player event tracking.

This is a larger modification. We need to add tracking calls at several points.

📁 `src/hooks/useAudioPlayer.ts`

🔍 **FIND** (at top of file, after existing imports):
```typescript
import { FOUNDATION_ALBUM, getTrackById } from '@/data/album';
```

✏️ **REPLACE WITH:**
```typescript
import { FOUNDATION_ALBUM, getTrackById } from '@/data/album';
import { 
  trackPlay, 
  trackPause, 
  trackComplete, 
  trackSkip,
  trackAudioError 
} from '@/utils/analytics';
```

---

🔍 **FIND** (the play function):
```typescript
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrackId) return;
```

Add tracking AFTER the audio starts playing. Look for where `setPlaybackState('playing')` is called or where `audio.play()` is called, and add:

```typescript
    // Track play event
    const track = getTrackById(currentTrackId);
    if (track) {
      trackPlay({
        track_id: currentTrackId,
        track_title: track.title,
        audio_version: audioVersion,
      });
    }
```

---

🔍 **FIND** (the pause function):
```typescript
  const pause = useCallback(() => {
```

Add tracking when pause is called:

```typescript
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setPlaybackState('paused');
    
    // Track pause event
    const track = currentTrackId ? getTrackById(currentTrackId) : null;
    if (track && audio.duration > 0) {
      const percentComplete = Math.round((audio.currentTime / audio.duration) * 100);
      trackPause({
        track_id: currentTrackId!,
        track_title: track.title,
        current_time: Math.round(audio.currentTime),
        percent_complete: percentComplete,
      });
    }
  }, [currentTrackId]);
```

---

🔍 **FIND** (the handleEnded function inside useEffect):
```typescript
    // Track ended
    const handleEnded = () => {
```

Modify to track completion:

```typescript
    // Track ended
    const handleEnded = () => {
      // Track completion
      const track = currentTrackId ? getTrackById(currentTrackId) : null;
      if (track) {
        trackComplete({
          track_id: currentTrackId!,
          track_title: track.title,
          audio_version: audioVersion,
        });
      }

      if (repeatMode === 'one') {
        // ... rest of existing code
```

---

🔍 **FIND** (the handleError function inside useEffect):
```typescript
    // Error handling
    const handleError = () => {
      console.error('Audio error:', audio.error);
      setError(audio.error?.message || 'Failed to load audio file');
      setPlaybackState('stopped');
    };
```

✏️ **REPLACE WITH:**
```typescript
    // Error handling
    const handleError = () => {
      console.error('Audio error:', audio.error);
      const errorMessage = audio.error?.message || 'Failed to load audio file';
      setError(errorMessage);
      setPlaybackState('stopped');
      
      // Track audio error
      if (currentTrackId) {
        trackAudioError({
          track_id: currentTrackId,
          error_message: errorMessage,
        });
      }
    };
```

---

🔍 **FIND** (the nextTrack or prevTrack function - for skip tracking):

Add skip tracking when a user manually skips before 30% of the track has played:

```typescript
  const nextTrack = useCallback(() => {
    const audio = audioRef.current;
    
    // Track skip if less than 30% played
    if (audio && audio.duration > 0 && currentTrackId) {
      const percentComplete = Math.round((audio.currentTime / audio.duration) * 100);
      if (percentComplete < 30) {
        const track = getTrackById(currentTrackId);
        if (track) {
          trackSkip({
            track_id: currentTrackId,
            track_title: track.title,
            percent_complete: percentComplete,
          });
        }
      }
    }
    
    // ... rest of existing nextTrack logic
```

---

### File 10: `src/components/AudioPlayer/PlayerControls.tsx` (MODIFY)

**Purpose:** Add tracking for shuffle and repeat toggles.

📁 `src/components/AudioPlayer/PlayerControls.tsx`

🔍 **FIND** (at top of file, after existing imports):
```typescript
import './PlayerControls.css';
```

✏️ **REPLACE WITH:**
```typescript
import './PlayerControls.css';
import { trackShuffleToggle, trackRepeatToggle } from '@/utils/analytics';
```

🔍 **FIND** (the shuffle button onClick handler):

Look for where `toggleShuffle` or similar is called. Wrap or extend the handler:

```typescript
onClick={() => {
  toggleShuffle();
  trackShuffleToggle({ enabled: !isShuffled });
}}
```

🔍 **FIND** (the repeat button onClick handler):

Look for where `toggleRepeat` or similar is called. Wrap or extend the handler:

```typescript
onClick={() => {
  toggleRepeat();
  // Determine next mode (off -> all -> one -> off)
  const nextMode = repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off';
  trackRepeatToggle({ mode: nextMode });
}}
```

---

### File 11: `src/components/AudioPlayer/AudioPlayer.tsx` or `VolumeControl.tsx` (MODIFY)

**Purpose:** Add tracking for volume changes and version toggle.

📁 Look for the component that handles volume control.

🔍 **FIND** (at top of file, after existing imports):

Add:
```typescript
import { trackVolumeChange, trackVersionToggle, trackSeek } from '@/utils/analytics';
```

🔍 **FIND** (the volume slider onChange handler):

Add debounced tracking after volume change:
```typescript
onChange={(e) => {
  const newVolume = parseFloat(e.target.value);
  setVolume(newVolume);
  // Track volume (will be debounced in analytics util)
  trackVolumeChange({ new_volume: Math.round(newVolume * 100) });
}}
```

🔍 **FIND** (the version toggle button - vocal/instrumental switch):

Add tracking:
```typescript
onClick={() => {
  toggleVersion();
  const newVersion = audioVersion === 'vocal' ? 'instrumental' : 'vocal';
  if (currentTrackId) {
    trackVersionToggle({ 
      track_id: currentTrackId, 
      new_version: newVersion 
    });
  }
}}
```

🔍 **FIND** (the seek/progress bar interaction - where users can click to jump in the track):

Add tracking when seek completes:
```typescript
onSeekComplete={(newTime: number) => {
  // ... existing seek logic
  if (currentTrackId && duration > 0) {
    trackSeek({
      track_id: currentTrackId,
      seek_to_percent: Math.round((newTime / duration) * 100),
    });
  }
}}
```

---

### File 12: `src/components/Lyrics/LyricsToggle.tsx` (MODIFY)

**Purpose:** Add tracking for lyrics display state changes.

📁 `src/components/Lyrics/LyricsToggle.tsx`

🔍 **FIND** (at top of file, after existing imports):

Add:
```typescript
import { trackLyricsToggle } from '@/utils/analytics';
```

🔍 **FIND** (the toggle button onClick handler):

Add tracking:
```typescript
onClick={() => {
  // Determine next state (hidden -> panel -> integrated -> hidden)
  const nextState = lyricsDisplayState === 'hidden' 
    ? 'panel' 
    : lyricsDisplayState === 'panel' 
    ? 'integrated' 
    : 'hidden';
  
  setLyricsDisplayState(nextState);
  trackLyricsToggle({ new_state: nextState });
}}
```

---

### File 13: `src/App.tsx` (MODIFY)

**Purpose:** Add section view tracking using Intersection Observer.

This tracks when users scroll to different sections of the page.

📁 `src/App.tsx`

🔍 **FIND** (at top of file, after existing imports):

Add:
```typescript
import { useEffect, useRef } from 'react';
import { trackSectionView, initializeAnalytics } from '@/utils/analytics';
```

🔍 **FIND** (inside the App component, near the top):

Add initialization and section tracking:
```typescript
function App() {
  // Track which sections have been viewed
  const viewedSectionsRef = useRef<Set<string>>(new Set());

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Set up Intersection Observer for section tracking
  useEffect(() => {
    const sectionIds = ['about', 'shows', 'merch', 'download', 'contact'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionName = entry.target.id;
            if (sectionName && !viewedSectionsRef.current.has(sectionName)) {
              viewedSectionsRef.current.add(sectionName);
              trackSectionView({ section_name: sectionName });
            }
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );

    // Observe all section elements
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // ... rest of component
```

**Note:** Ensure your section components have the appropriate `id` attributes (e.g., `<section id="about">`, `<section id="contact">`). If they use `ref` instead, adjust the observer setup accordingly.

---

### File 14: Download Section Tracking (IF EXISTS)

**Purpose:** Track download and donation button clicks.

📁 `src/components/ContentSections/DownloadSection.tsx` (or wherever download functionality lives)

🔍 **FIND** (at top of file):

Add:
```typescript
import { trackDownloadClick, trackDonationClick } from '@/utils/analytics';
```

🔍 **FIND** (the download button onClick):

Add:
```typescript
onClick={() => {
  // ... existing download logic
  trackDownloadClick();
}}
```

🔍 **FIND** (the donation/Buy Me a Coffee button onClick):

Add:
```typescript
onClick={() => {
  trackDonationClick();
  // ... existing link/redirect logic
}}
```

---

### File 15: Merch Section Tracking (IF EXISTS)

**Purpose:** Track when users view merch product details.

📁 `src/components/Merch/MerchCard.tsx` or `MerchModal.tsx`

🔍 **FIND** (at top of file):

Add:
```typescript
import { trackMerchView } from '@/utils/analytics';
```

🔍 **FIND** (where the product modal/detail opens):

Add:
```typescript
onClick={() => {
  trackMerchView({ 
    product_id: product.id, 
    product_name: product.name 
  });
  // ... existing modal open logic
}}
```

---

## Validation Checklist

### Pre-Deployment Checks

- [ ] **TypeScript compilation:** Run `npm run build` - no type errors
- [ ] **Development mode test:** Run `npm run dev`, open console, perform actions - see `[Analytics Dev]` logs
- [ ] **No gtag errors:** Console should not show "gtag is not defined" errors
- [ ] **Footer updated:** "This site uses analytics" displays in footer

### Post-Deployment Checks (Production)

- [ ] **GA4 Script loads:** In browser DevTools Network tab, see `gtag/js` request
- [ ] **Realtime dashboard:** Go to GA4 → Reports → Realtime, verify your visit appears
- [ ] **Custom events:** Perform actions, check Realtime → Event count by Event name
- [ ] **Test each event type:**
  - [ ] Play a track → `track_play` event
  - [ ] Pause a track → `track_pause` event
  - [ ] Let track finish → `track_complete` event
  - [ ] Skip track early → `track_skip` event
  - [ ] Seek in track → `seek` event
  - [ ] Toggle vocal/instrumental → `version_toggle` event
  - [ ] Change volume → `volume_change` event
  - [ ] Toggle shuffle → `shuffle_toggle` event
  - [ ] Toggle repeat → `repeat_toggle` event
  - [ ] Toggle lyrics → `lyrics_toggle` event
  - [ ] Click social link → `social_click` event
  - [ ] Submit contact form → `contact_submit` event
  - [ ] Scroll to section → `section_view` event
  - [ ] (If merch exists) Open product → `merch_view` event
  - [ ] (If download exists) Click download → `download_click` event

---

## Known Pitfalls & Anti-Patterns

### ❌ Don't Do This

1. **Don't track on every render:**
   ```typescript
   // BAD - fires on every render
   useEffect(() => {
     trackPlay({ ... });
   });
   ```

2. **Don't forget to check for null trackId:**
   ```typescript
   // BAD - might send null
   trackPlay({ track_id: currentTrackId, ... });
   
   // GOOD - check first
   if (currentTrackId) {
     trackPlay({ track_id: currentTrackId, ... });
   }
   ```

3. **Don't track volume on every slider move:**
   ```typescript
   // BAD - sends hundreds of events
   onInput={(e) => trackVolumeChange({ new_volume: e.target.value })}
   
   // GOOD - debounce (handled in useAnalytics hook)
   ```

4. **Don't duplicate section view events:**
   ```typescript
   // BAD - fires every time section is scrolled into view
   // GOOD - use Set to track already-viewed sections (handled in useAnalytics hook)
   ```

### ✅ Do This

1. **Always check environment before sensitive logging:**
   ```typescript
   if (!isProduction()) {
     console.log('Debug info');
   }
   ```

2. **Use meaningful event names that match GA4 conventions (snake_case)**

3. **Keep parameter values concise - GA4 has limits on string lengths**

4. **Test in GA4 Realtime before considering implementation complete**

---

## Testing & Verification

### Local Development Testing

1. Run `npm run dev`
2. Open browser DevTools Console
3. Perform various actions (play, pause, click links)
4. Verify console shows `[Analytics Dev] event_name { params }` for each action
5. Verify NO network requests to googletagmanager.com

### Production Testing

1. Deploy to Netlify (or your production host)
2. Visit the live site
3. Open GA4 Dashboard → Reports → Realtime
4. Perform actions on the site
5. Watch events appear in Realtime within 5-30 seconds
6. Verify event parameters by clicking on event names

### Debugging Tips

- **Events not appearing?** Check browser Console for errors
- **Wrong event names?** Search codebase for the misspelled event
- **Missing parameters?** Check that all required fields are passed
- **Duplicate events?** Look for multiple tracking calls or missing deduplication

---

## Integration Notes

### Files Created
- `src/types/analytics.ts`
- `src/utils/analytics.ts`
- `src/hooks/useAnalytics.ts`

### Files Modified
- `index.html`
- `src/types/index.ts`
- `src/components/Layout/Footer.tsx`
- `src/components/ContentSections/MediaLinksBar.tsx`
- `src/components/ContentSections/ContactSection.tsx`
- `src/hooks/useAudioPlayer.ts`
- `src/components/AudioPlayer/PlayerControls.tsx`
- `src/components/AudioPlayer/AudioPlayer.tsx` (or volume control component)
- `src/components/Lyrics/LyricsToggle.tsx`
- `src/App.tsx`
- (Optional) Download section component
- (Optional) Merch section component

### Import Path Note
This project uses `@/` path aliases. Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Summary

This phase implements comprehensive Google Analytics 4 tracking with:
- **17 custom events** covering all user interactions
- **Production-only loading** to keep dev data clean
- **Type-safe implementation** with full TypeScript coverage
- **Performance-conscious design** with debouncing and deduplication
- **Easy debugging** with development console logging