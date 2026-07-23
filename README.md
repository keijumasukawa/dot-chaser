# dot-chaser-app

English | [日本語](./README.ja.md)

<!-- Keep this file in sync when README.ja.md is updated. -->

## Overview

A Pac-Man-style 2D maze game playable in the browser. Steer your character with the arrow keys, dodge the ghosts, and clear the stage by collecting every dot in the maze.

> 🚧 Under active development. This README is updated as the implementation progresses.

### Demo

https://dot-chaser-app.vercel.app

### Key Features

- Maze exploration and dot collection (collect them all to clear the stage)
- 4 ghosts, each with a different chase algorithm
- Power pellets (eat the ghosts back for a limited time)
- Score & high-score persistence (localStorage)
- Level progression (difficulty increases with each cleared stage)
- Lives, game over, and restart
- Pause

### Screenshots

(Coming soon — will be added once implemented)

## Tech Stack

| Category              | Technology                                  | Version    |
| --------------------- | ------------------------------------------- | ---------- |
| Language              | TypeScript (shared by front end & back end) | 6.x        |
| Front End (Build)     | Vite                                        | 8.x        |
| Front End (Rendering) | HTML5 Canvas API (no external libraries)    | -          |
| Back End              | Hono (planned — online ranking API)         | -          |
| Unit Tests            | Vitest                                      | 4.x        |
| Lint & Formatting     | ESLint + Prettier                           | 10.x / 3.x |
| Package Manager       | pnpm                                        | 11.x       |
| CI/CD                 | GitHub Actions                              | -          |
| Deployment            | Vercel                                      | -          |

## Architecture

Game logic (maze checks, movement, collision, scoring) is separated from Canvas rendering, and the logic never depends on Canvas. The main loop is driven by `requestAnimationFrame`, performing "apply input → update state → render" every frame.

```
[Keyboard input] ──→ [Game loop (requestAnimationFrame)]
                        ├─ update: state updates (maze, movement, ghost AI, score)
                        └─ render: Canvas drawing (maze, characters, UI)
```

## Directory Structure

```
.
├── index.html           # Entry HTML (canvas element)
├── src/
│   ├── main.ts          # Entry point (game loop & key input)
│   ├── game.ts          # Overall game state (score, lives, level)
│   ├── maze.ts          # Maze data & tile checks
│   ├── pacman.ts        # Player movement & drawing
│   ├── ghost.ts         # Ghost AI, states & drawing
│   ├── i18n/            # Internationalization (type-safe dictionaries & t())
│   ├── types.ts         # Shared types (directions, etc.)
│   └── style.css        # Page-wide styles
├── package.json
└── tsconfig.json
```

## Setup

Requirements: Node.js 24+ / pnpm 11+

```bash
pnpm install   # Install dependencies
pnpm dev       # Start the dev server
```

No environment variables are required.

## Development Commands

Run everything from the repository root.

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `pnpm dev`        | Start the dev server          |
| `pnpm build`      | Type check + production build |
| `pnpm preview`    | Preview the production build  |
| `pnpm test`       | Run unit tests once (Vitest)  |
| `pnpm test:watch` | Run unit tests in watch mode  |
| `pnpm lint`       | Run linter                    |
| `pnpm format`     | Format code                   |

## Dev Server URL

http://localhost:5173

---

⭐ If you found this project helpful, I would really appreciate a star.
