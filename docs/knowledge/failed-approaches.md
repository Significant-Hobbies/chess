---
title: Failed Approaches
description: Things tried that didn't work, so they don't get re-attempted.
---

# Failed Approaches

Reusable records of approaches that were tried and rejected, with the reason.

## Auto-triggering AI coaching on every move

**Tried:** calling the coach automatically after each player move.
**Why it failed:** cost (an LLM call per move) and latency (streaming blocks the
next interaction mentally). Users also don't want a paragraph after every
opening move.
**What we do instead:** on-demand *Analyze* button on the last move only. See
[product/ai-coaching](../product/ai-coaching.md).

## `new Chess(fen)` to clone a game in progress

**Tried:** cloning the game state with `new Chess(game.fen())` for the computer
move / undo paths.
**Why it failed:** `chess.js` drops move history when constructing from FEN, so
undo and the move list broke.
**What we do instead:** `cloneGame` reloads via PGN. See ADR-0004 and
[learnings](learnings.md).

## Direct browser → cloud AI provider calls

**Tried:** calling OpenAI / Anthropic / Google directly from the browser.
**Why it failed:** inconsistent CORS per provider, and Google requires the key in
the URL query, which is worse client-side.
**What we do instead:** the `api/coach.ts` serverless proxy normalizes the
request server-side. See ADR-0002. (The proxy itself has an open security issue —
that's a separate, current problem, not a failed approach.)

## In-SPA FAQ route for SEO

**Tried:** rendering the FAQ inside the React SPA at `/faq`.
**Why it failed:** the SPA shell gives crawlers an empty div; the `FAQPage`
JSON-LD and crawlable Q&A never get indexed.
**What we do instead:** `faq.html` as a second Vite entry — static HTML + JSON-LD.
See ADR-0005.

## ResizeObserver firing on mount for board sizing

**Tried:** using a `ResizeObserver` (or `vh`-based sizing) from mount to size the
board.
**Why it failed:** initial-mount observer fire caused a visible CLS shift, and
`vh` changes when the mobile URL bar shows/hides, causing ongoing layout shift.
**What we do instead:** compute the initial size in `useState`, only listen to
`window resize`, and use `contain: strict` on the board container. See
[learnings](learnings.md).
