import { Album, Track } from '@/types';

/**
 * FOUNDATION Album Metadata
 *
 * NOTE: Duration values are placeholders (180 seconds = 3:00 for each track).
 * Update these with actual durations after uploading real MP3 files.
 *
 * hasVocals is set to false for all tracks initially since only instrumentals
 * are uploaded. Set to true for each track as vocal versions are added.
 */

const tracks: Track[] = [
  {
    id: 1,
    title: 'A GOOD DAY',
    duration: 182, // 2:47 - Example updated duration
    vocalFile: '/music/vocal/01-A-GOOD-DAY.mp3',
    instrumentalFile: '/music/instrumental/01-A-GOOD-DAY-instrumental.mp3',
    lyricsFile: '/lyrics/01-A-GOOD-DAY.lrc',
    hasVocals: true, // Set to true when vocal version is uploaded
  },
  {
    id: 2,
    title: 'AWARENESS',
    duration: 222, // 3:09 - Example updated duration
    vocalFile: '/music/vocal/02-AWARENESS.mp3',
    instrumentalFile: '/music/instrumental/02-AWARENESS-instrumental.mp3',
    lyricsFile: '/lyrics/02-AWARENESS.lrc',
    hasVocals: true,
  },
  {
    id: 3,
    title: 'MOTIVATIONS',
    duration: 181,
    vocalFile: '/music/vocal/03-MOTIVATIONS.mp3',
    instrumentalFile: '/music/instrumental/03-MOTIVATIONS-instrumental.mp3',
    lyricsFile: '/lyrics/03-MOTIVATIONS.lrc',
    hasVocals: true,
  },
  {
    id: 4,
    title: 'HISTORY',
    duration: 142,
    vocalFile: '/music/vocal/04-HISTORY.mp3',
    instrumentalFile: '/music/instrumental/04-HISTORY-instrumental.mp3',
    lyricsFile: '/lyrics/04-HISTORY.lrc',
    hasVocals: true,
  },
  {
    id: 5,
    title: 'VICE',
    duration: 226,
    vocalFile: '/music/vocal/05-VICE.mp3',
    instrumentalFile: '/music/instrumental/05-VICE-instrumental.mp3',
    lyricsFile: '/lyrics/05-VICE.lrc',
    hasVocals: true,
  },
  {
    id: 6,
    title: 'LIGHT',
    duration: 205,
    vocalFile: '/music/vocal/06-LIGHT.mp3',
    instrumentalFile: '/music/instrumental/06-LIGHT-instrumental.mp3',
    lyricsFile: '/lyrics/06-LIGHT.lrc',
    hasVocals: true,
  },
  {
    id: 7,
    title: 'DEGRADATION',
    duration: 134,
    vocalFile: '/music/vocal/07-DEGRADATION.mp3',
    instrumentalFile: '/music/instrumental/07-DEGRADATION-instrumental.mp3',
    lyricsFile: '/lyrics/07-DEGRADATION.lrc',
    hasVocals: true,
  },
  {
    id: 8,
    title: 'RESISTANCE',
    duration: 296,
    vocalFile: '/music/vocal/08-RESISTANCE.mp3',
    instrumentalFile: '/music/instrumental/08-RESISTANCE-instrumental.mp3',
    lyricsFile: '/lyrics/08-RESISTANCE.lrc',
    hasVocals: true,
  },
  {
    id: 9,
    title: 'TEMPORARY',
    duration: 258,
    vocalFile: '/music/vocal/09-TEMPORARY.mp3',
    instrumentalFile: '/music/instrumental/09-TEMPORARY-instrumental.mp3',
    lyricsFile: '/lyrics/09-TEMPORARY.lrc',
    hasVocals: true,
  },
  {
    id: 10,
    title: 'JOY',
    duration: 133,
    vocalFile: '/music/vocal/10-JOY.mp3',
    instrumentalFile: '/music/instrumental/10-JOY-instrumental.mp3',
    lyricsFile: '/lyrics/10-JOY.lrc',
    hasVocals: true,
  },
  {
    id: 11,
    title: 'CREATION',
    duration: 217,
    vocalFile: '/music/vocal/11-CREATION.mp3',
    instrumentalFile: '/music/instrumental/11-CREATION-instrumental.mp3',
    lyricsFile: '/lyrics/11-CREATION.lrc',
    hasVocals: true,
  },
  {
    id: 12,
    title: 'TECHNOLOGY',
    duration: 223,
    vocalFile: '/music/vocal/12-TECHNOLOGY.mp3',
    instrumentalFile: '/music/instrumental/12-TECHNOLOGY-instrumental.mp3',
    lyricsFile: '/lyrics/12-TECHNOLOGY.lrc',
    hasVocals: true,
  },
  {
    id: 13,
    title: 'CACHE',
    duration: 177,
    vocalFile: '/music/vocal/13-CACHE.mp3',
    instrumentalFile: '/music/instrumental/13-CACHE-instrumental.mp3',
    lyricsFile: '/lyrics/13-CACHE.lrc',
    hasVocals: true,
  },
  {
    id: 14,
    title: 'GRANDEUR',
    duration: 149,
    vocalFile: '/music/vocal/14-GRANDEUR.mp3',
    instrumentalFile: '/music/instrumental/14-GRANDEUR-instrumental.mp3',
    lyricsFile: '/lyrics/14-GRANDEUR.lrc',
    hasVocals: true,
  },
  {
    id: 15,
    title: 'BATTLES',
    duration: 167,
    vocalFile: '/music/vocal/15-BATTLES.mp3',
    instrumentalFile: '/music/instrumental/15-BATTLES-instrumental.mp3',
    lyricsFile: '/lyrics/15-BATTLES.lrc',
    hasVocals: true,
  },
  {
    id: 16,
    title: 'ELEVATION',
    duration: 172,
    vocalFile: '/music/vocal/16-ELEVATION.mp3',
    instrumentalFile: '/music/instrumental/16-ELEVATION-instrumental.mp3',
    lyricsFile: '/lyrics/16-ELEVATION.lrc',
    hasVocals: true,
  },
];

export const FOUNDATION_ALBUM: Album = {
  title: 'FOUNDATION',
  artist: 'PRIMEAPE',
  releaseYear: 2025,
  artworkUrl: '/artwork/foundation-cover.png', // Placeholder - update when artwork ready
  tracks,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a track by its ID
 * @param id - Track ID to find
 * @returns Track object or undefined if not found
 */
export const getTrackById = (id: number): Track | undefined => {
  return tracks.find((track) => track.id === id);
};

/**
 * Get the next track ID in sequence
 * @param currentId - Current track ID
 * @returns Next track ID (loops back to first track at end)
 */
export const getNextTrackId = (currentId: number): number => {
  const currentIndex = tracks.findIndex((track) => track.id === currentId);
  if (currentIndex === -1 || currentIndex === tracks.length - 1) {
    return tracks[0].id; // Loop back to first track
  }
  return tracks[currentIndex + 1].id;
};

/**
 * Get the previous track ID in sequence
 * @param currentId - Current track ID
 * @returns Previous track ID (loops to last track at beginning)
 */
export const getPreviousTrackId = (currentId: number): number => {
  const currentIndex = tracks.findIndex((track) => track.id === currentId);
  if (currentIndex === -1 || currentIndex === 0) {
    return tracks[tracks.length - 1].id; // Loop to last track
  }
  return tracks[currentIndex - 1].id;
};
