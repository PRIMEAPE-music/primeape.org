import React from 'react';
import MediaLinksBar from './MediaLinksBar';
import AboutSection from './AboutSection';
import MerchSection from '../Merch/MerchSection';
import ShowsSection from './ShowsSection';
import ContactSection from './ContactSection';
import Tracklist from '../Tracklist/Tracklist';
import { FOUNDATION_ALBUM } from '../../data/album';
import './ContentSections.css';

interface ContentSectionsProps {
  currentTrackId: number | null;
  isPlaying: boolean;
  isLoading: boolean;
  onTrackSelect: (trackId: number) => void;
}

/**
 * ContentSections Component
 *
 * Wrapper for all content sections below the player.
 * Renders sections in order: Tracklist (mobile only) → Media Links → About → Merch → Shows → Contact → Footer
 *
 * Phase 6A: ✓ Basic structure
 * Phase 6B: ✓ MediaLinksBar
 * Phase 6C: ✓ AboutSection
 * Phase 6D: ✓ ShowsSection with scroll-to-contact
 * Phase 6E: ✓ ContactSection with Netlify Forms
 * Phase 7: ✓ MerchSection with product grid and purchase flow
 * Mobile Enhancement: ✓ Tracklist visible below player on mobile
 */
const ContentSections: React.FC<ContentSectionsProps> = ({
  currentTrackId,
  isPlaying,
  isLoading,
  onTrackSelect,
}) => {
  // Ref for scroll target (contact section)
  const contactRef = React.useRef<HTMLElement>(null);

  // Handler passed to ShowsSection for "Book Me" button
  const handleBookMeClick = () => {
    // Scroll to contact section with smooth behavior
    contactRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    // Note: Tab switching to "Booking" could be implemented here
    // by passing initialTab prop to ContactSection if needed
  };

  return (
    <div className="content-sections">
      {/* Mobile Tracklist - only visible on tablet/mobile */}
      <div className="content-sections__mobile-tracklist">
        <Tracklist
          tracks={FOUNDATION_ALBUM.tracks}
          currentTrackId={currentTrackId}
          isPlaying={isPlaying}
          isLoading={isLoading}
          onTrackSelect={onTrackSelect}
        />
      </div>

      <MediaLinksBar />
      <AboutSection />
      <MerchSection />
      <ShowsSection onBookMeClick={handleBookMeClick} />
      <ContactSection ref={contactRef} />
      {/* Footer already exists in Layout - will stay there for now */}
    </div>
  );
};

export default ContentSections;