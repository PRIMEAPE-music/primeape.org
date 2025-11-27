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
