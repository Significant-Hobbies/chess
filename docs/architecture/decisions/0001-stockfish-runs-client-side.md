---
title: ADR-0001 — Stockfish runs client-side as WASM
description: Why the engine is a browser Web Worker rather than a server endpoint.
---

# ADR-0001 — Stockfish runs client-side as WASM

**Status:** Accepted
**Date:** 2026-07-17 (backfilled from initial implementation)

## Context

A chess coach app needs a strong engine for move generation, eval, and best-move
hints. Options: (a) a server-side engine behind an API, or (b) Stockfish compiled
to WASM running in the browser.

## Decision

Run Stockfish 18 WASM entirely client-side in a Web Worker (`public/stockfish.js`
+ `.wasm`), wrapped by `StockfishEngine` in `src/lib/stockfish.ts`.

## Consequences

**Positive**

- Zero server compute cost — the app is a static SPA + one serverless AI proxy.
- No latency for engine moves beyond the configured `moveTime`.
- No rate limiting or abuse surface for the engine itself.

**Negative / constraints**

- Requires `Cross-Origin-Embedder-Policy: require-corp` and
  `Cross-Origin-Opener-Policy: same-origin` headers (SharedArrayBuffer). Every
  deploy target must serve these — see
  [operations/deployment](../../operations/deployment.md).
- Larger initial download (WASM binary). Mitigated by serving the `.wasm`
  statically and excluding `stockfish` from Vite's `optimizeDeps`.
- Single worker, serialized queue — concurrent eval requests must wait. Acceptable
  for a single-board, single-player app; would not scale to multi-board.

## Alternatives considered

- **Server-side Stockfish**: rejected — adds a stateful server, compute cost, and
  an abuse surface, none of which the rest of the app needs.
- **A weaker in-JS engine** (e.g. js-chess-engine): rejected — too weak for useful
  coaching evals at higher difficulty.
