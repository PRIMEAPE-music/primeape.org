import React from 'react';
import Layout from './components/Layout/Layout';
import PlayerSection from './components/PlayerSection/PlayerSection';
import './styles/global.css';

/**
 * App Component
 * 
 * Root component of the application.
 * 
 * Phase 1: ✓ Basic layout structure
 * Phase 2: ✓ Music player with playback controls
 * Phase 3: Advanced player features (waveform, equalizer, volume)
 * Phase 4: Lyrics system
 * Phase 5+: Additional content sections
 */
const App: React.FC = () => {
  return (
    <Layout>
      <PlayerSection />
      {/* Additional sections will be added in Phase 6 */}
    </Layout>
  );
};

export default App;
