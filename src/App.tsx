import React, { useEffect, useRef } from 'react';
import Layout from './components/Layout/Layout';
import PlayerSection from './components/PlayerSection/PlayerSection';
import ContentSections from './components/ContentSections/ContentSections';
import './styles/global.css';
import { trackSectionView, initializeAnalytics } from '@/utils/analytics';

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
 * Phase 6: ✓ Content sections (Media Links, About, Shows, Contact)
 * Phase 7: ✓ Merch system (Product grid, modals, Printful integration)
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

  // Ref to store the Player's track selection handler
  const trackSelectHandlerRef = React.useRef<((trackId: number) => void) | null>(null);

  // Track which sections have been viewed (prevent duplicate events)
  const viewedSectionsRef = useRef<Set<string>>(new Set());

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Set up Intersection Observer for section tracking
  useEffect(() => {
    const sectionIds = ['merch', 'shows', 'contact'];

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

  // Callback for track selection from mobile tracklist
  const handleTrackSelect = React.useCallback((trackId: number) => {
    // Call the Player's actual track selection handler
    if (trackSelectHandlerRef.current) {
      trackSelectHandlerRef.current(trackId);
    }
  }, []);

  return (
    <Layout>
      <PlayerSection 
        onPlayerStateChange={setPlayerState}
        trackSelectHandlerRef={trackSelectHandlerRef}
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

export default App;
