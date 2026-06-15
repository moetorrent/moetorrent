## moeTorrent - A cute BitTorrent client

![GitHub package.json version](https://img.shields.io/github/package-json/v/moetorrent/moetorrent?style=flat-square&color=blue)
![GitHub License](https://img.shields.io/github/license/moetorrent/moetorrent?style=flat-square&color=blue)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/moetorrent/moetorrent/release.yml?style=flat-square&color=blue&logo=github)

### Description:
moeTorrent is a bittorrent client programmed in [TypeScript](https://www.typescriptlang.org/) / [React](https://react.dev/) / [Tauri](https://v2.tauri.app/) that uses
a bundled [transmission-daemon](https://transmissionbt.com).

It aims to be a modern alternative to other bittorrent clients out there. 
moeTorrent focuses heavily on clean UX, aesthetic design, and simplicity, 
making torrenting approachable without overwhelming the user with advanced 
technical configurations.

### Roadmap:
Currently implemented:
- Transmission daemon bundling and auto-start
- Magnet URI and `.torrent` file parsing
- Start, pause, remove torrents
- Data persistence between launches
- Advanced metrics (seed/peer counts, upload ratios)

Planned:
- Theme / Skin support ecosystem
- Notification system for completed downloads
- Global bandwidth rate limiting controls
- ... more ...

### Installation:

Ensure you have Node.js (v18+), Rust, and [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) installed.

1. Clone the repository and install dependencies:
   `pnpm install`
2. Start the development server:
   `pnpm tauri dev`
3. To create an optimized production build:
   `pnpm tauri build`

### Philosophy:
Our goal is to build functionality before polish, while keeping components
simple and readable.\
We prioritize a clean, native-feeling desktop experience
over complex feature sets.

### Misc:
For more information please visit the repository.\
Please report any bug (or feature request) on the [issue tracker](https://github.com/moetorrent/moetorrent/issues).
