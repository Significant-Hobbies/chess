---
title: Architecture Overview
description: Component map, data flow, state management, and the client/server split for Chess Coach.
---

# Architecture Overview

React 19 + TypeScript SPA built with Vite. No SSR. The chess engine runs entirely
client-side in a Web Worker; AI coaching is the only networked feature.

## Component map

```
src/
  App.tsx                       # Root — header, AI config modal, game, SaaSMaker widgets
  main.tsx                      # React entry
  index.css                     # Tailwind import + global dark theme (#1a1a2e)
  components/
    ChessGame.tsx               # Game logic — board, clocks, controls, state persistence (643 lines, the core)
    CoachPanel.tsx              # Coaching explanation display + Analyze button
    EvalBar.tsx                 # Stockfish eval bar (vertical desktop, horizontal mobile)
    MoveList.tsx                # Move history with quality badges
    ChessClock.tsx              # Countdown timer per player
    DifficultyPicker.tsx        # 6-level difficulty selector (Beginner → Max)
    AIConfig.tsx                # Modal: provider, model, API key
    saasmaker-feedback.tsx      # SaaSMaker feedback/testimonials/changelog widgets
    posthog-provider.tsx        # PostHog analytics provider
    PageViewTracker.tsx         # Page view tracking
  hooks/
    useAI.ts                    # AI provider abstraction + SSE streaming
  lib/
    stockfish.ts                # StockfishEngine — Web Worker wrapper with queue
    ai-prompts.ts               # System + per-move coaching prompt builder
    saasmaker.ts                # SaaSMaker SDK client init
server/                         # git SUBMODULE — Express CLI bridge (dev only)
api/
  coach.ts                      # Vercel serverless fn — cloud AI proxy
public/
  stockfish.js + .wasm          # engine assets served statically
  llms.txt, llms-full.txt, api-ai.json, index.md, sitemap.xml, robots.txt
```

## Data flow per move

1. Player drops a piece → `ChessGame.onPieceDrop` validates with `chess.js`,
   applies the move, updates `fen`.
2. `afterPlayerMove` runs two engine calls in parallel against the **pre-move**
   FEN: `getEval` (eval before) and `getBestMove` (engine's top choice), then
   `getEval` on the **post-move** FEN (eval after).
3. Centipawn loss is computed from the player's perspective and classified into a
   quality badge (`best`/`good`/`inaccuracy`/`mistake`/`blunder`).
4. A `MoveEntry` (SAN, quality, evals, best move, prev FEN) is appended to
   `moveHistory`.
5. If the game isn't over, a 300 ms timer triggers `makeComputerMove`, which asks
   Stockfish for a move at the current difficulty and applies it.
6. **Coaching is not auto-triggered.** The user clicks *Analyze* → `handleAnalyze`
   builds a `CoachContext` from the last `MoveEntry` and calls `useChessCoach.evaluate`.

## State management

- All state is React `useState` in `ChessGame.tsx`. No external store.
- Game state persisted to `localStorage` key `chess-coach-game` on every `fen`
  change (PGN, orientation, difficulty, moveHistory, timeControl, timeLeft).
- AI config persisted to `localStorage` key `chess-coach-ai-config`.
- `ChessGame` uses `gameRef` / `evalScoreRef` / `orientationRef` refs to keep
  callbacks reading current values without re-subscribing effects.

## Stockfish engine wrapper

`StockfishEngine` ([`src/lib/stockfish.ts`](../../src/lib/stockfish.ts)) wraps the
WASM worker:

- Single-worker, **serialized** via an `isTurn` flag + `queue`. Concurrent
  `analyze()` calls queue; the worker only ever handles one `go` at a time.
  `stop` is sent before each new `position`/`go` to abort in-flight search.
- **Eval normalization**: Stockfish reports centipawns from the side-to-move's
  perspective. The wrapper negates when black is to move so evals are always
  from White's perspective. Mate scores clamp to ±10000.
- `getBestMove` uses skill 20 / 1500 ms; `getEval` uses skill 20 / 500 ms.
- `init()` runs the UCI handshake (`uci` → `uciok` → `isready` → `readyok`).

## Difficulty → engine parameters

`DIFFICULTY_CONFIGS` in `DifficultyPicker.tsx` maps each level to a Stockfish
`Skill Level` and `moveTime` (ms):

| Level | Label | Skill | moveTime |
| --- | --- | --- | --- |
| 0 | Beginner | 0 | 50 |
| 1 | Easy | 4 | 100 |
| 2 | Medium | 8 | 300 |
| 3 | Hard | 13 | 600 |
| 4 | Expert | 18 | 1200 |
| 5 | Max | 20 | 2000 |

## Cross-origin isolation

`vite.config.ts` sets `Cross-Origin-Embedder-Policy: require-corp` and
`Cross-Origin-Opener-Policy: same-origin` on the dev server. These headers are
required for SharedArrayBuffer, which the Stockfish WASM build uses. Any deploy
target must serve the same headers — see
[operations/deployment](../operations/deployment.md).

## Decisions

Non-obvious *why* choices are recorded as ADRs in [decisions/](decisions/).
