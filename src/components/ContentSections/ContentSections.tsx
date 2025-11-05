import React from 'react';
import MediaLinksBar from './MediaLinksBar';
import AboutSection from './AboutSection';
import ShowsSection from './ShowsSection';
import ContactSection from './ContactSection';
import './ContentSections.css';

/**
 * ContentSections Component
 * 
 * Wrapper for all content sections below the player.
 * Renders sections in order: Media Links → About → Shows → Contact → Footer
 * 
 * Phase 6A: ✓ Basic structure
 * Phase 6B: ✓ MediaLinksBar
 * Phase 6C: ✓ AboutSection
 * Phase 6D: ✓ ShowsSection with scroll-to-contact
 * Phase 6E: ✓ ContactSection with Netlify Forms
 */
const ContentSections: React.FC = () => {
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
      <MediaLinksBar />
      <AboutSection />
      <ShowsSection onBookMeClick={handleBookMeClick} />
      <ContactSection ref={contactRef} />
      {/* Footer already exists in Layout - will stay there for now */}
    </div>
  );
};

export default ContentSections;