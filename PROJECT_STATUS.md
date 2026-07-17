# Chess Coach — PROJECT STATUS

Last updated: 2026-07-17

## Why / What

Chess Coach is a browser chess app for playing Stockfish and getting optional, plain-language AI explanations of positions and moves. It is a personal learning project under Significant Hobbies.

## Dependencies

- React 19, TypeScript, Vite 8, Tailwind CSS 4.
- Stockfish 18 WASM, `chess.js`, and `react-chessboard`.
- Optional hosted AI provider APIs or local Claude, Codex, and Gemini CLI bridges.
- SaaS Maker widgets and analytics.

## Timeline

- Core board, Stockfish play, move grading, clocks, hints, undo, and persistence shipped.
- Multi-provider streaming AI coaching and local CLI bridge shipped.
- Live Significant Hobbies domain established at `chess.significanthobbies.com`.

## Products

- **Web app:** <https://chess.significanthobbies.com>
- **Repository:** <https://github.com/Significant-Hobbies/chess>

## Features (shipped)

- Six engine levels, evaluation bar, move list with quality labels, and best-move hints.
- Timed and untimed games, board flip, undo, and browser persistence.
- On-demand streamed coaching with configurable AI provider.
- Responsive desktop and mobile interface.

## Todo / Planned / Deferred / Blocked

### Planned

- Add automated tests and a consistent lint/typecheck gate.
- Add PGN import/export and promotion-piece selection.

### Deferred

- Opening book, endgame tablebase, multiplayer, and cross-device game history.

### Blocked

- The hosted AI proxy needs authentication or rate limiting before broader promotion; see `AUDIT.md`.
