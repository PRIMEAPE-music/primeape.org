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
  // Placeholder show data
  const placeholderShows = [
    {
      id: 'show-1',
      date: '2025-12-15',
      venue: 'The Underground',
      city: 'Los Angeles',
      state: 'CA'
    },
    {
      id: 'show-2',
      date: '2025-12-22',
      venue: 'Echo Chamber',
      city: 'San Francisco',
      state: 'CA'
    },
    {
      id: 'show-3',
      date: '2026-01-10',
      venue: 'Sound Garden',
      city: 'Seattle',
      state: 'WA'
    }
  ];

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="shows-section" aria-labelledby="shows-heading">
      <div className="shows-section__container">
        <h2 id="shows-heading" className="shows-section__title">
          Shows
        </h2>

        <div className="shows-section__content">
          <ul className="shows-section__list">
            {placeholderShows.map((show) => (
              <li key={show.id} className="shows-section__item">
                <div className="shows-section__date">
                  <time dateTime={show.date}>{formatDate(show.date)}</time>
                </div>
                <div className="shows-section__details">
                  <div className="shows-section__venue">{show.venue}</div>
                  <div className="shows-section__location">
                    {show.city}, {show.state}
                  </div>
                </div>
              </li>
            ))}
          </ul>

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