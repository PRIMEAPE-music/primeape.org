import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import { Track } from '@/types';
import { FOUNDATION_ALBUM } from '@/data/album';
import './DownloadVocalButton.css';

interface DownloadVocalButtonProps {
  track: Track | null;
}

/**
 * DownloadVocalButton Component
 *
 * Download button with dropdown for vocal tracks.
 * Options: Download current track or full album as ZIP.
 *
 * @param track - Current track object
 */
const DownloadVocalButton: React.FC<DownloadVocalButtonProps> = ({ track }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleDownloadTrack = () => {
    if (!track || !track.hasVocals) return;

    const link = document.createElement('a');
    link.href = track.vocalFile;
    link.download = `${track.title} - PRIMEAPE.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const handleDownloadAlbum = async () => {
    setIsDownloading(true);
    setIsOpen(false);

    try {
      const zip = new JSZip();
      const albumFolder = zip.folder(`PRIMEAPE - ${FOUNDATION_ALBUM.title}`);

      if (!albumFolder) {
        throw new Error('Failed to create album folder');
      }

      // Get all tracks with vocals
      const vocalTracks = FOUNDATION_ALBUM.tracks.filter(t => t.hasVocals);

      // Fetch all vocal files and add to ZIP
      const fetchPromises = vocalTracks.map(async (t, index) => {
        try {
          const response = await fetch(t.vocalFile);
          if (!response.ok) {
            console.warn(`Failed to fetch ${t.title}`);
            return;
          }
          const blob = await response.blob();
          const trackNumber = String(index + 1).padStart(2, '0');
          albumFolder.file(`${trackNumber} - ${t.title}.mp3`, blob);
        } catch (error) {
          console.warn(`Error fetching ${t.title}:`, error);
        }
      });

      await Promise.all(fetchPromises);

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `PRIMEAPE - ${FOUNDATION_ALBUM.title}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating album ZIP:', error);
      alert('Failed to download album. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Only show if track exists and has vocals
  if (!track || !track.hasVocals) {
    return null;
  }

  return (
    <div className="download-vocal" ref={dropdownRef}>
      <button
        className={`download-vocal__button ${isOpen ? 'download-vocal__button--active' : ''} ${isDownloading ? 'download-vocal__button--loading' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Download options"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Download"
        disabled={isDownloading}
      >
        {isDownloading ? (
          <svg
            className="download-vocal__spinner"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="download-vocal__dropdown" role="menu">
          <button
            className="download-vocal__option"
            onClick={handleDownloadTrack}
            role="menuitem"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            <span>Download Track</span>
          </button>
          <button
            className="download-vocal__option"
            onClick={handleDownloadAlbum}
            role="menuitem"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Download Album</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadVocalButton;
