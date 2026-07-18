---
title: Testing
description: Current test state — a single Playwright smoke test — and how to run it.
---

# Testing

## Current state

There is **no real test suite**. The only test file is
[`tests/example.spec.ts`](../../tests/example.spec.ts) — a one-line Playwright
smoke test that loads `http://localhost:3000` and asserts the title matches
`/Chess/i`.

- `@playwright/test` is a devDependency, but there is **no `test` script** in
  `package.json` and no Playwright config (`playwright.config.ts`).
- The smoke test targets port 3000, while `pnpm dev` runs Vite on its default
  port (5173) — the test would fail as-is.
- CI (`.github/workflows/ci.yml`) runs `pnpm build` only; it does not run tests.

> **Unresolved:** port mismatch (3000 vs Vite default 5173) means the smoke test
> can't pass without a config or a running server on 3000. Adding a
> `playwright.config.ts` and a `test` script is a listed TODO.

## Running Playwright (manual)

```bash
pnpm exec playwright install        # first time, installs browsers
pnpm exec playwright test           # needs a server on the configured port
```

## What to add first (suggested)

- A `playwright.config.ts` pinning `webServer` to `pnpm dev:frontend` on a fixed
  port, and a `test` script in `package.json`.
- A real smoke test for: board renders, a legal move applies, the eval bar
  updates, the Analyze button appears.
- A unit test for `classifyMoveQuality` thresholds and `StockfishEngine` eval
  normalization (the two places with non-obvious math).
