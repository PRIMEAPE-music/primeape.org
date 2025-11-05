import React from 'react';
import './MediaLinksBar.css';

/**
 * MediaLinksBar Component
 * 
 * Horizontal bar displaying social and streaming platform links.
 * Layout: | YouTube | Spotify | Instagram | Bandcamp | Apple | TikTok |
 * 
 * Phase 6B: Initial implementation with placeholder URLs
 */

interface PlatformLink {
  id: string;
  name: string;
  url: string;
  icon: string; // Unicode emoji or icon
  ariaLabel: string;
}

const PLATFORM_LINKS: PlatformLink[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://youtube.com/@primeape', // Placeholder
    icon: '▶️',
    ariaLabel: 'Visit PRIMEAPE on YouTube'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    url: 'https://open.spotify.com/artist/primeape', // Placeholder
    icon: '🎵',
    ariaLabel: 'Listen to PRIMEAPE on Spotify'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://instagram.com/primeape', // Placeholder
    icon: '📷',
    ariaLabel: 'Follow PRIMEAPE on Instagram'
  },
  {
    id: 'bandcamp',
    name: 'Bandcamp',
    url: 'https://primeape.bandcamp.com', // Placeholder
    icon: '🎧',
    ariaLabel: 'Support PRIMEAPE on Bandcamp'
  },
  {
    id: 'apple',
    name: 'Apple Music',
    url: 'https://music.apple.com/artist/primeape', // Placeholder
    icon: '🍎',
    ariaLabel: 'Listen to PRIMEAPE on Apple Music'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://tiktok.com/@primeape', // Placeholder
    icon: '🎬',
    ariaLabel: 'Follow PRIMEAPE on TikTok'
  }
];

const MediaLinksBar: React.FC = () => {
  return (
    <section className="media-links" aria-label="Social and streaming platforms">
      <div className="media-links__container">
        {PLATFORM_LINKS.map((platform, index) => (
          <React.Fragment key={platform.id}>
            <a
              href={platform.url}
              className="media-links__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={platform.ariaLabel}
            >
              <span className="media-links__icon" aria-hidden="true">
                {platform.icon}
              </span>
              <span className="media-links__text">{platform.name}</span>
            </a>
            {/* Add divider between links (but not after last one) */}
            {index < PLATFORM_LINKS.length - 1 && (
              <div className="media-links__divider" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default MediaLinksBar;