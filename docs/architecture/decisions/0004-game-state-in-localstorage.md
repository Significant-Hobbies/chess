---
title: ADR-0004 — Game state in localStorage
description: Why game and AI config are persisted to localStorage with no backend or game history.
---

# ADR-0004 — Game state in localStorage

**Status:** Accepted
**Date:** 2026-07-17 (backfilled)

## Context

The app should survive a reload mid-game without an account or backend.

## Decision

Persist the current game (PGN, orientation, difficulty, moveHistory, timeControl,
timeLeft) to `localStorage` key `chess-coach-game`, and AI config to
`chess-coach-ai-config`. No server-side storage, no cross-device sync, no game
history beyond the current game.

## Consequences

**Positive**

- No backend, no auth, no privacy surface.
- Reload resumes the exact game.

**Negative / known limits**

- Only the **current** game is persisted; starting a new game overwrites it. No
  game history list. (Listed in product "not done".)
- No cross-device sync — state is per-browser.
- `chess.js`'s `new Chess(fen)` loses move history, so `ChessGame.cloneGame`
  reloads via PGN instead. Anyone touching game cloning must use the PGN path.

## Alternatives considered

- **IndexedDB with a game list**: deferred — would enable game history but adds
  complexity and a migration surface; not yet warranted for a personal project.
- **Backend persistence**: rejected — contradicts the no-account design goal.
