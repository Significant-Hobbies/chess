# Chess Coach

Play chess against Stockfish in the browser and request plain-language coaching for any position. The board, engine, clocks, move grading, and saved game state run client-side; optional AI coaching streams from a selected provider.

**Live app:** <https://chess.significanthobbies.com>

## Features

- Six Stockfish difficulty levels, evaluation bar, move quality labels, hints, undo, and board flip.
- Configurable chess clocks and automatic local game-state persistence.
- Optional streaming coaching through supported local CLI tools during
  development. The live static Pages target does not serve a hosted AI proxy.
- Responsive React interface with direct PostHog analytics and an optional
  caller-owned SaaS Maker feedback widget.

## Local development

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts the Vite frontend and the local Express bridge used by CLI-based AI providers. To run only the browser app, use `pnpm dev:frontend`.

## Commands

```bash
pnpm dev
pnpm dev:frontend
pnpm server
pnpm build
pnpm preview
pnpm test
pnpm test:coverage
pnpm quality
```

## Architecture

- React 19 + TypeScript + Vite 8 frontend.
- Stockfish 18 WASM in a Web Worker; `chess.js` handles legal moves and game state.
- `server/` (a git submodule, cli-bridge) bridges local AI CLIs during
  development. Hosted proxying is intentionally retired.
- Current game and AI configuration are stored in browser `localStorage`.

## Documentation

- [AGENTS.md](AGENTS.md) — concise agent bootloader (purpose, commands, critical constraints, docs navigation).
- [PROJECT_STATUS.md](PROJECT_STATUS.md) — durable current and shipped product truth.
- [GitHub Issues](https://github.com/Significant-Hobbies/chess/issues) — open work and blockers.
- [docs/](docs/index.md) — canonical knowledge system: product, architecture, decisions, development, operations, and learnings. The Markdown is the source of truth.

See [AGENTS.md](AGENTS.md) for the repository map and implementation conventions.
