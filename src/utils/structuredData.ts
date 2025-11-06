/**
 * Structured Data (JSON-LD) Generator
 *
 * Generates schema.org markup for SEO and rich search results.
 * This helps search engines understand that this is a music album page.
 *
 * Reference: https://schema.org/MusicAlbum
 */

import type { Track } from '@/types';

interface StructuredDataConfig {
  albumName: string;
  artistName: string;
  releaseDate: string; // ISO 8601 format: YYYY-MM-DD
  genre: string;
  description: string;
  albumArtworkUrl: string;
  websiteUrl: string;
  tracks: Track[];
}

/**
 * Generate MusicAlbum structured data
 *
 * @param config - Album and track information
 * @returns JSON-LD script content as string
 */
export function generateMusicAlbumStructuredData(config: StructuredDataConfig): string {
  const {
    albumName,
    artistName,
    releaseDate,
    genre,
    description,
    albumArtworkUrl,
    websiteUrl,
    tracks
  } = config;

  // Build track list with schema.org MusicRecording format
  const trackList = tracks.map((track, index) => ({
    "@type": "MusicRecording",
    "name": track.title,
    "position": index + 1,
    "duration": formatDurationISO8601(track.duration),
    "byArtist": {
      "@type": "MusicGroup",
      "name": artistName
    }
  }));

  // Main MusicAlbum structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    "name": albumName,
    "byArtist": {
      "@type": "MusicGroup",
      "name": artistName,
      "genre": genre
    },
    "datePublished": releaseDate,
    "genre": genre,
    "description": description,
    "image": albumArtworkUrl,
    "url": websiteUrl,
    "numTracks": tracks.length,
    "track": trackList,
    "albumProductionType": "http://schema.org/StudioAlbum",
    "inLanguage": "en-US"
  };

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Convert duration in seconds to ISO 8601 duration format
 * Example: 245 seconds -> "PT4M5S" (4 minutes, 5 seconds)
 *
 * @param seconds - Duration in seconds
 * @returns ISO 8601 duration string
 */
function formatDurationISO8601(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `PT${minutes}M${remainingSeconds}S`;
}

/**
 * Generate Organization structured data for the artist
 * This can be added alongside the MusicAlbum data
 *
 * @param artistName - Name of the artist/band
 * @param websiteUrl - Official website URL
 * @returns JSON-LD script content as string
 */
export function generateArtistStructuredData(
  artistName: string,
  websiteUrl: string
): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": artistName,
    "genre": "Hip-Hop",
    "url": websiteUrl,
    "sameAs": [
      // Add social media links when available
      // "https://www.instagram.com/primeape",
      // "https://twitter.com/primeape",
      // "https://open.spotify.com/artist/..."
    ]
  };

  return JSON.stringify(structuredData, null, 2);
}

/**
 * Generate WebSite structured data with search action
 * Helps Google understand your site structure
 *
 * @param websiteUrl - Your website URL
 * @returns JSON-LD script content as string
 */
export function generateWebsiteStructuredData(websiteUrl: string): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PRIMEAPE - FOUNDATION",
    "url": websiteUrl,
    "description": "Official website for FOUNDATION album by PRIMEAPE",
    "inLanguage": "en-US"
  };

  return JSON.stringify(structuredData, null, 2);
}
