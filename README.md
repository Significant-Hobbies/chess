# Chess Coach

Play chess against Stockfish in the browser and request plain-language coaching for any position. The board, engine, clocks, move grading, and saved game state run client-side; optional AI coaching streams from a selected provider.

**Live app:** <https://chess.significanthobbies.com>

## Features

- Six Stockfish difficulty levels, evaluation bar, move quality labels, hints, undo, and board flip.
- Configurable chess clocks and automatic local game-state persistence.
- Streaming coaching through Anthropic, OpenAI, Google, DeepSeek, or supported local CLI tools.
- Responsive React interface with SaaS Maker feedback, analytics, testimonials, and changelog widgets.

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
```

## Architecture

- React 19 + TypeScript + Vite 8 frontend.
- Stockfish 18 WASM in a Web Worker; `chess.js` handles legal moves and game state.
- `api/coach.ts` provides the hosted streaming AI proxy; `server/index.mjs` bridges local AI CLIs during development.
- Current game and AI configuration are stored in browser `localStorage`.

See [agents.md](agents.md) for the repository map and implementation conventions.
