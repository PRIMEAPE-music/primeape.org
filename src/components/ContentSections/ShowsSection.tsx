import React from 'react';
import './ShowsSection.css';

/**
 * ShowsSection Component
 * 
 * Displays upcoming shows in a list view.
 * "Book Me" button triggers scroll to contact form + switches to booking tab.
 * 
 * Phase 6D: Placeholder shows with scroll functionality
 * Future: Can be made dynamic with real show data
 */

interface ShowsSectionProps {
  onBookMeClick: () => void;
}

const ShowsSection: React.FC<ShowsSectionProps> = ({ onBookMeClick }) => {
  return (
    <section className="shows-section" aria-labelledby="shows-heading">
      <div className="shows-section__container">
        <h2 id="shows-heading" className="shows-section__title">
          Shows
        </h2>

        <div className="shows-section__content">
          <div className="shows-section__coming-soon">
            <p className="shows-section__coming-soon-text">New dates coming soon</p>
          </div>

          <div className="shows-section__cta">
            <p className="shows-section__cta-text">
              Interested in booking PRIMEAPE for your venue or event?
            </p>
            <button
              type="button"
              className="shows-section__book-btn"
              onClick={onBookMeClick}
              aria-label="Book PRIMEAPE - go to booking form"
            >
              Book Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowsSection;