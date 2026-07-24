# dot-chaser-app

English | [日本語](./README.ja.md)

<!-- When updating this file, keep README.ja.md in sync. -->

## Overview

A retro-arcade-style 2D maze game that runs in the browser. Use the arrow keys to move your character, dodge the ghosts, and collect every dot in the maze to clear the stage.

> 🚧 Under active development. This README will be updated as development progresses.

### Demo

https://dot-chaser-app.vercel.app

### Key Features

- Maze exploration and dot collection — collect every dot to clear the stage
- Four ghosts, each with a distinct chase algorithm, plus power pellets that temporarily turn the tables, letting you eat the ghosts
- Level progression — difficulty ramps up with each stage you clear
- A lives system (it's game over when you run out), plus restart and pause support
- Score and high score are saved to `localStorage`

### Screenshots

To be added as development progresses.

## Tech Stack

| Category             | Technology                                      | Version    |
| -------------------- | ----------------------------------------------- | ---------- |
| Language             | TypeScript (used for both frontend and backend) | 6.x        |
| Build Tool           | Vite                                            | 8.x        |
| Rendering            | HTML5 Canvas API (no external libraries)        | -          |
| Backend              | Hono (planned — for the online ranking API)     | -          |
| Unit Testing         | Vitest                                          | 4.x        |
| Linting & Formatting | ESLint + Prettier                               | 10.x / 3.x |
| Package Manager      | pnpm                                            | 11.x       |
| CI/CD                | GitHub Actions                                  | -          |
| Deployment           | Vercel                                          | -          |

## Architecture

Game logic such as maze tile lookups, movement, collision detection, and scoring is decoupled from Canvas rendering and does not depend on the Canvas API. The main loop is driven by `requestAnimationFrame`, running an "input → update → render" cycle every frame.

```
[Keyboard input] ──→ [Game loop (requestAnimationFrame)]
                        ├─ update: state updates (maze, movement, ghost AI, score)
                        └─ render: Canvas rendering (maze, characters, UI)
```

## Directory Structure

```
.
├── index.html           # Entry HTML (canvas element)
├── src/
│   ├── main.ts          # Entry point (game loop & key input)
│   ├── game.ts          # Overall game state management (score, lives, level)
│   ├── maze.ts          # Maze data & tile lookups
│   ├── player.ts        # Player movement & rendering
│   ├── ghost.ts         # Ghost AI, states & rendering
│   ├── i18n/            # Internationalization (type-safe dictionaries & translation function t())
│   ├── types.ts         # Shared types (directions, etc.)
│   └── style.css        # Global styles
├── package.json
└── tsconfig.json
```

## Setup

Prerequisites: Node.js 24+ and pnpm 11+

```bash
pnpm install   # Install dependencies
pnpm dev       # Start the dev server
```

The dev server runs at http://localhost:5173.

No environment variables are required.

## Development Commands

Run all commands from the repository root.

| Command           | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `pnpm dev`        | Start the dev server                                   |
| `pnpm build`      | Type check + production build                          |
| `pnpm preview`    | Preview the production build                           |
| `pnpm test`       | Run unit tests (Vitest)                                |
| `pnpm test:watch` | Run unit tests in watch mode (re-runs on file changes) |
| `pnpm lint`       | Run the linter                                         |
| `pnpm format`     | Format the code                                        |
