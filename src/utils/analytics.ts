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
  trackEvent('track_play', { ...params });
};

/**
 * Track when a user pauses a track
 */
export const trackPause = (params: TrackPauseParams): void => {
  trackEvent('track_pause', { ...params });
};

/**
 * Track when a track plays to completion
 */
export const trackComplete = (params: TrackCompleteParams): void => {
  trackEvent('track_complete', { ...params });
};

/**
 * Track when a user skips a track before 30% complete
 */
export const trackSkip = (params: TrackSkipParams): void => {
  trackEvent('track_skip', { ...params });
};

/**
 * Track when a user seeks/scrubs in a track
 */
export const trackSeek = (params: SeekParams): void => {
  trackEvent('seek', { ...params });
};

/**
 * Track when a user toggles between vocal/instrumental
 */
export const trackVersionToggle = (params: VersionToggleParams): void => {
  trackEvent('version_toggle', { ...params });
};

/**
 * Track volume changes
 * Note: Debounce this in the component to avoid excessive events
 */
export const trackVolumeChange = (params: VolumeChangeParams): void => {
  trackEvent('volume_change', { ...params });
};

/**
 * Track shuffle toggle
 */
export const trackShuffleToggle = (params: ShuffleToggleParams): void => {
  trackEvent('shuffle_toggle', { ...params });
};

/**
 * Track repeat mode changes
 */
export const trackRepeatToggle = (params: RepeatToggleParams): void => {
  trackEvent('repeat_toggle', { ...params });
};

// ============================================================================
// UI TRACKING FUNCTIONS
// ============================================================================

/**
 * Track lyrics display state changes
 */
export const trackLyricsToggle = (params: LyricsToggleParams): void => {
  trackEvent('lyrics_toggle', { ...params });
};

/**
 * Track social/streaming link clicks
 */
export const trackSocialClick = (params: SocialClickParams): void => {
  trackEvent('social_click', { ...params });
};

/**
 * Track merch product modal opens
 */
export const trackMerchView = (params: MerchViewParams): void => {
  trackEvent('merch_view', { ...params });
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
  trackEvent('contact_submit', { ...params });
};

// ============================================================================
// ENGAGEMENT TRACKING FUNCTIONS
// ============================================================================

/**
 * Track when a section comes into view
 */
export const trackSectionView = (params: SectionViewParams): void => {
  trackEvent('section_view', { ...params });
};

// ============================================================================
// ERROR TRACKING FUNCTIONS
// ============================================================================

/**
 * Track audio playback errors
 */
export const trackAudioError = (params: AudioErrorParams): void => {
  trackEvent('audio_error', { ...params });
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
