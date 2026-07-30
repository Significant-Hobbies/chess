---
title: Testing
description: Current Playwright smoke coverage and how to run it.
---

# Testing

## Current state

The initial browser boundary is a Playwright smoke test in
[`tests/example.spec.ts`](https://github.com/Significant-Hobbies/chess/blob/main/tests/example.spec.ts).
`playwright.config.ts` starts the Vite-only frontend on port 5173, so the test
does not need the local AI bridge or an already-running server.

CI runs lint, TypeScript, the production build, and the Playwright smoke test.

## Running Playwright (manual)

```bash
pnpm exec playwright install chromium  # first time, installs the browser
pnpm test                               # starts Vite and runs Playwright
```

## What to add first (suggested)

- A real smoke test for: board renders, a legal move applies, the eval bar
  updates, the Analyze button appears.
- A unit test for `classifyMoveQuality` thresholds and `StockfishEngine` eval
  normalization (the two places with non-obvious math).
