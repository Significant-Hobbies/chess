---
title: Testing
description: Current Playwright smoke coverage and how to run it.
---

# Testing

## Current state

The browser boundary is a Playwright smoke test in
[`tests/example.spec.ts`](https://github.com/Significant-Hobbies/chess/blob/main/tests/example.spec.ts).
`playwright.config.ts` starts the Vite-only frontend on port 5173, so the test
does not need the local AI bridge or an already-running server.

The smoke proof checks the rendered board, primary controls, and move-history
surface. A second Playwright proof exercises the board, AI settings, and
changelog while measuring execution across every loaded application module.
CI runs both as part of `pnpm quality` with lint, TypeScript, unused-code,
complexity, duplication, dependency, suppression, build, and hygiene gates.

## Running Playwright (manual)

```bash
pnpm exec playwright install chromium  # first time, installs the browser
pnpm test                               # starts Vite and runs Playwright
pnpm test:coverage                      # loaded-module Chromium coverage
```

## What to add first (suggested)

- A legal-move smoke proof that observes move history and evaluation updates.
- A unit test for `classifyMoveQuality` thresholds and `StockfishEngine` eval
  normalization (the two places with non-obvious math).
