# PRIMEAPE - FOUNDATION

Official album website for FOUNDATION by PRIMEAPE.

## About

Philosophical hip-hop featuring 16 tracks. Stream instrumentals and full versions with synced lyrics.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** CSS Modules with CSS Variables
- **Hosting:** Netlify (primeape.org)

## Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/      # React components organized by feature
├── hooks/          # Custom React hooks
├── styles/         # Global styles and theme system
├── types/          # TypeScript type definitions
├── data/           # Static data (album metadata)
└── utils/          # Utility functions (added in later phases)
```

## Phase Progress

- [x] Phase 1: Project Foundation & Core Setup
- [x] Phase 2: Core Audio Player - Basic Playback
- [ ] Phase 3: Advanced Player Features
- [ ] Phase 4: Lyrics System
- [ ] Phase 5: Tracklist & Navigation
- [ ] Phase 6: Content Sections
- [ ] Phase 7: Merch System
- [ ] Phase 8: Download & Donation System
- [ ] Phase 9: Theme System & Preferences
- [ ] Phase 10: Responsive Design & Mobile Optimization
- [ ] Phase 11: Analytics & Tracking
- [ ] Phase 12: Polish, Testing & Deployment

## Uploading Music Files

Music files are not stored in Git due to size. Upload MP3 files to:

- **Instrumentals:** `public/music/instrumental/`
- **Vocals:** `public/music/vocal/` (when ready)

File naming convention: `[track-number]-[TRACK-NAME].mp3`

Example: `01-A-GOOD-DAY-instrumental.mp3`

Update `hasVocals: true` in `src/data/album.ts` when vocal versions are added.

## Lyrics Files

Convert SRT files from DaVinci Resolve to LRC format and place in `public/lyrics/`.

File naming convention: `[track-number]-[TRACK-NAME].lrc`

Example: `01-A-GOOD-DAY.lrc`

## Code Quality

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## License

© 2025 PRIMEAPE. All rights reserved.