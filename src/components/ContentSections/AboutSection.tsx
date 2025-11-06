import React from 'react';
import './AboutSection.css';

/**
 * AboutSection Component
 * 
 * Displays artist bio in a centered single-column layout.
 * 
 * Phase 6C: Placeholder content
 * Future: Can be made dynamic with CMS or props
 */
const AboutSection: React.FC = () => {
  return (
    <section className="about-section" aria-labelledby="about-heading">
      <div className="about-section__container">
        <h2 id="about-heading" className="about-section__title">
          About
        </h2>

        <div className="about-section__content">
          <div className="about-section__bio">
            <p>
              PRIMEAPE is a philosophical hip-hop artist exploring the depths of human 
              consciousness, societal structures, and the eternal quest for meaning. 
              Through intricate wordplay and thought-provoking narratives, each track 
              serves as a meditation on the complexities of modern existence, blending 
              introspection with sharp social commentary.
            </p>
            <p>
              <em>FOUNDATION</em> represents a sonic journey through 16 carefully crafted 
              tracks, each building upon universal themes of growth, struggle, and 
              enlightenment. With production that seamlessly merges boom-bap aesthetics 
              with contemporary soundscapes, the album invites listeners to question, 
              reflect, and ultimately discover their own truths within the music.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;