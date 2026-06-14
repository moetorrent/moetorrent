# AGENTS.md

## moeTorrent

A cute, customizable torrent client built with:

- Tauri
- React
- TypeScript
- TailwindCSS
- HeroUI
- Transmission Daemon

## Vision

moeTorrent aims to make torrenting:

- approachable
- aesthetic
- customizable
- lightweight
- enjoyable

This project focuses heavily on:

- clean UX
- modern UI
- theme/skin support
- simplicity

NOT on exposing every advanced torrent feature possible.

## Current MVP Scope

Focus ONLY on the basics first:

- Add `.torrent` files
- Add magnet URIs
- Start/pause/remove torrents
- Display torrent list
- Persist torrents between launches
- Configure download directory
- Auto-start bundled transmission daemon

Avoid feature creep during MVP.

## UI Philosophy

- Dark-first UI
- Blue-accented default theme
- Minimal and clean layout
- Rounded corners
- Smooth but subtle animations
- Avoid visual clutter
- Avoid overwhelming users

The default UI should feel:

- modern
- cozy
- lightweight
- polished

## Tech Notes

### Frontend

- React + TypeScript
- TailwindCSS
- HeroUI components
- Zustand for state management
- TanStack Query for async state

### Icons

- Local SVG icons
- Imported using SVGR
- Use `?react` imports

Example:

```tsx
import PlayIcon from "@/assets/icons/play.svg?react";
```

### Backend

- Bundled `transmission-daemon`
- Controlled through Transmission RPC API
- Daemon should launch automatically with the app

## Important Rules

### DO

- Keep components simple
- Prefer readability over abstraction
- Build functionality before polish
- Use CSS variables for theming
- Keep bundle size small
- Optimize for desktop UX

### DON'T

- Over-engineer architecture early
- Add plugin systems yet
- Add unnecessary settings
- Add Electron
- Add excessive animations
- Build custom torrent protocol logic

## Theme Direction

Default palette:

- Deep blue-gray backgrounds
- Soft blue accents
- Subtle gradients
- Minimal glow effects

Themes/skins will be supported later.

## Priority Order

1. Functional torrent workflow
2. Stable state management
3. Smooth UX
4. Theme system
5. Customization ecosystem
