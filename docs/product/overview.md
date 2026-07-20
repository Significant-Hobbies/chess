---
title: Product Overview
description: What Chess Coach is, its shipped features, audience, and product context under Significant Hobbies.
---

# Product Overview

Chess Coach is a single-page web app for playing chess against the Stockfish
engine in the browser and requesting plain-language AI coaching for any position.
The board, engine, clocks, move grading, and saved game state all run client-side;
AI coaching is optional and streams from a user-selected provider.

**Live app:** <https://chess.significanthobbies.com>
**Repository:** <https://github.com/Significant-Hobbies/chess>

## Why it exists

A personal learning project under **Significant Hobbies**. The goal is a
lightweight, no-account chess practice tool that pairs engine play with
human-readable move explanations — closer to a coach than a raw eval bar.

## Shipped features

- Six Stockfish difficulty levels (Beginner → Max), evaluation bar, move quality
  labels (best / good / inaccuracy / mistake / blunder), best-move hint arrow,
  undo, and board flip.
- Configurable chess clocks (untimed, 1 / 3 / 5 / 10 / 15 min) with per-player
  countdown and win-on-time.
- On-demand streaming AI coaching through Anthropic, OpenAI, Google, DeepSeek,
  or supported local CLI tools (Claude Code, Codex, Gemini CLI).
- Automatic local game-state persistence across reloads (`localStorage`).
- Responsive desktop + mobile layout, direct PostHog analytics, and the SaaS
  Maker feedback widget.
- Agent- and crawler-facing surfaces: `llms.txt`, `llms-full.txt`, `/api/ai`,
  `index.md`, `sitemap.xml`, `robots.txt`, IndexNow key, FAQ page with
  `FAQPage` JSON-LD. See [operations/agent-indexing](../operations/agent-indexing.md).

## Not done / deferred

- No automated test suite beyond a single Playwright smoke test; no lint or
  typecheck CI gate (a pre-push husky hook runs lint if a `lint` script exists,
  and a secret scan).
- No opening book or endgame tablebase.
- No PGN export / import.
- No game history (only the current game is persisted).
- No multiplayer, no sound effects.
- Promotion always auto-queens (no piece-selection UI).

See [`STATUS.md`](https://github.com/Significant-Hobbies/chess/blob/main/STATUS.md) for the current objective and blockers.

## Audience

Solo learners who want engine feedback *and* a short explanation of why a move
was good or bad, without installing anything or creating an account.

## Product context

- Part of the Significant Hobbies fleet; parent showcase at
  <https://sassmaker.com>.
- Deployed via Cloudflare Pages (manual `workflow_dispatch`) — see
  [operations/deployment](../operations/deployment.md).
- The hosted AI proxy (`api/coach.ts`) is an **open LLM proxy** and is the main
  security blocker before any broader promotion — see
  [operations/security-audit](../operations/security-audit.md).
