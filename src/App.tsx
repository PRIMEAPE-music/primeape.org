import React from 'react';
import Layout from './components/Layout/Layout';
import PlayerSection from './components/PlayerSection/PlayerSection';
import ContentSections from './components/ContentSections/ContentSections';
import './styles/global.css';

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

export default App;
