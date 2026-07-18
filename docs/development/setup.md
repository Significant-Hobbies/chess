---
title: Development Setup
description: Local setup, commands, environment variables, and the local-vs-cloud AI split.
---

# Development Setup

## Prerequisites

- Node.js 22+ (CI uses 22; Blume docs build needs 22.12+ — see
  [operations/deployment](../operations/deployment.md)).
- pnpm 10.32.1 (pinned in CI via `pnpm/action-setup@v4`).
- For local AI providers: `claude`, `codex`, or `gemini` CLI installed and on
  `PATH`, plus the `server/` submodule checked out (see below).

## First checkout

```bash
pnpm install
git submodule update --init --recursive   # only needed for local AI providers
```

The `server/` submodule (cli-bridge) is **not** initialized by default. Without
it, `pnpm dev:frontend` works (Vite only); `pnpm dev` / `pnpm server` need it.

## Commands

```bash
pnpm dev              # Vite + Express CLI bridge (both). Runs npm install inside server/ on start.
pnpm dev:frontend     # Vite only — no local AI bridge
pnpm server           # Express CLI bridge only
pnpm build            # Production build (Vite) → dist/
pnpm preview          # Preview the production build
```

Docs-only commands (Blume is not a dependency; scripts fetch it on demand):

```bash
./scripts/docs-dev.sh        # Blume dev server on docs/
./scripts/docs-build.sh      # Blume static build → dist/ (see note below)
./scripts/docs-validate.sh   # Blume link validation (strict)
./scripts/docs-check.sh      # Blume type-check
```

> **`dist/` conflict:** both `pnpm build` (Vite) and `./scripts/docs-build.sh`
> (Blume) write to `dist/`. They are different sites — run them in separate
> steps/jobs, not simultaneously. Both outputs are gitignored.

## Environment variables

```bash
# .env.local (gitignored). Only PostHog vars are documented in .env.example:
VITE_POSTHOG_KEY=          # PostHog analytics key
VITE_POSTHOG_HOST=https://us.i.posthog.com

# Also read by the SaaSMaker widgets (src/lib/saasmaker.ts,
# saasmaker-feedback.tsx) but NOT listed in .env.example. The committed
# foundry.json already carries the SaaSMaker project key (public pk_ prefix),
# so this is optional for local runs:
VITE_SAASMAKER_API_KEY=
```

Cloud AI API keys are **not** env vars — the user enters them in the AI Config
modal and they live in `localStorage` (`chess-coach-ai-config`). The serverless
proxy receives them per request. See
[product/ai-coaching](../product/ai-coaching.md).

## Vite dev server quirks

- `/api` is proxied to `http://localhost:3456` (the Express bridge).
- `Cross-Origin-Embedder-Policy: require-corp` and
  `Cross-Origin-Opener-Policy: same-origin` headers are set in `vite.config.ts`
  for SharedArrayBuffer (Stockfish WASM). Any local proxy or fetch that breaks
  under these headers is the likely culprit.
- `stockfish` is excluded from `optimizeDeps` — Vite must not try to bundle the
  WASM package; it's served statically from `public/`.

## Git hooks (husky)

- `pre-push` (`.husky/pre-push`): runs `pnpm lint` if a `lint` script exists, then
  a secret scan over tracked files (regex for `sk-...`, `AKIA...`, `ghp_...`,
  `AIzaSy...`, `xoxb-...`, private key blocks). Excludes `.example`/`.sample`,
  tests, fixtures, vendor, and `content.json`. A match aborts the push.
- `prepare` runs `husky` on install.
