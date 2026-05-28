# Memory Game

Interactive browser-based memory game built with TypeScript, modular architecture, and local state persistence.

## Project Context

This project was created as part of my professional training at Developer Akademie.

## Portfolio Summary

- Focus: structured frontend development with TypeScript
- Goal: separate gameplay logic, UI states, and navigation concerns
- Result: maintainable architecture with clear component, service, and view boundaries

## Project Role

- Designed and implemented the application structure (views, services, components)
- Built the game flow: setup, card matching, scoring, and game-over handling
- Implemented local persistence and resume logic via Local Storage
- Organized reusable UI components and type-safe data contracts

## Highlights

- Multiple themes with dynamically loaded assets
- Configurable board sizes (16, 24, 36 cards)
- Player selection and start-player logic
- Live score tracking with winner/draw end screen
- Exit dialog and game state restoration
- Local Storage persistence

## Tech Stack

- TypeScript
- Vite
- SCSS (Sass)

## Architecture (Excerpt)

```text
src/
  components/   # Reusable UI building blocks
  services/     # Game logic, setup, and data services
  manager/      # App navigation
  storage/      # Local Storage access layer
  views/        # Home, Settings, Play
  types/        # Shared TypeScript contracts
```

## Local Setup

### Requirements

- Node.js (recommended: current LTS version)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Local Preview Build

```bash
npm run preview
```

## Possible Next Steps

- Add unit tests for services and game logic
- Add end-to-end tests for key user flows
- Run an accessibility pass for keyboard and screen reader support

## License

No license defined yet.
