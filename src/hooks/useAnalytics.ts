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
