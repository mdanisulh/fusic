<a name="readme-top"></a>
<br />

<div align="center">
  <a href="https://fusic.vercel.app/">
    <img src="public/logo.png" alt="Logo" width="250" height="250">
  </a>

<h1><a href="https://fusic.vercel.app/"><strong>Fusic</strong>
  </a></h1>
  <p align="center">
    Feel the fusion of sound
    <br />
    <a href="https://github.com/mdanisulh/fusic/issues">Report Bug</a>
    ·
    <a href="https://github.com/mdanisulh/fusic/issues">Request Feature</a>
  </p>
</div>

<p align="center">Welcome to Fusic, the Open-Source music streaming platform inspired by Spotify.</p>

> **Mobile Device Compatibility Notice:**
>
> For optimal viewing, users are advised to use their mobile devices in landscape mode. The application is currently optimized for screen sizes above 800px. I am actively working on a responsive design solution to improve user experience across all devices. Expect updates soon.

## Features

- **High-Quality Streaming**: Enjoy your favorite tracks in 320kbps audio quality.
- **Comprehensive Search**: Easily find songs, artists, albums, and playlists.
- **Lyrics Support**: View synced or plain lyrics for a better singing experience.
- **Lyrics Transliteration**: Instantly transliterate lyrics from any language to English.
- **Song Downloads**: Download your favorite tracks with high-quality audio and embedded metadata (ID3 tags) including cover art, lyrics, and artist info.
- **Personalized Experience**: Home page featuring recently played, most played, trending playlists, and recommendations.
- **Library Management**: Save songs, albums, and playlists to your personal library. Create and manage custom playlists.
- **Advanced Player Controls**:
  - Shuffle and Repeat (One/All) modes.
  - Dynamic Queue management (Add to queue, reorder).
  - Media Session API support for media keys and lock screen controls.
  - Keyboard shortcuts for quick navigation and control.
- **Privacy First**: All your data, including library and history, is stored locally in your browser using IndexedDB.
- **Responsive Design**: Optimized for desktop and landscape mobile viewing.

## Spotify to Fusic Playlist Converter

Fusic comes with a dedicated Chrome extension that allows you to migrate your Spotify playlists seamlessly.

### How to use the Extension:

1. **Install the Extension**:
   - Download or clone this repository.
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** in the top right corner.
   - Click **Load unpacked** and select the `extension` folder from this project.

2. **Export from Spotify**:
   - Navigate to any Spotify playlist page on the web.
   - Click the **Spotify to Fusic Playlist Exporter** icon in your extension bar.
   - A `.fusic` file containing the playlist data will be downloaded.

3. **Import to Fusic**:
   - Open [Fusic](https://fusic.vercel.app/).
   - In the **Your Library** section on the sidebar, click the **+** (Add) button.
   - Select **Import Playlist**.
   - Upload the `.fusic` file you just downloaded.
   - Fusic will automatically match the songs. You can review and adjust the matches before finalizing the import.

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `Space` | Play / Pause |
| `ArrowRight` | Seek Forward (5s) |
| `ArrowLeft` | Seek Backward (5s) |
| `ArrowUp` | Increase Volume |
| `ArrowDown` | Decrease Volume |
| `n` | Next Track |
| `p` | Previous Track |

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [React Context API](https://react.dev/learn/passing-data-deeply-with-context) & [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (for local persistence)
- **Backend (API)**: [Python](https://www.python.org/) with [Flask](https://flask.palletsprojects.com/) (for metadata processing and downloads)
- **Deployment**: [Vercel](https://vercel.com/)
