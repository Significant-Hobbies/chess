---
title: Deployment
description: How Chess Coach ships — Cloudflare Pages (manual), required headers, and the docs (Blume) build.
---

# Deployment

The only maintained deployment is a static SPA on Cloudflare Pages. Hosted AI
proxying and the dormant Vercel path were retired on 2026-08-01.

## Cloudflare Pages (active)

`.github/workflows/deploy.yml` — **manual only** (`workflow_dispatch`).

1. Checkout, pnpm install (frozen lockfile, `--ignore-scripts`), `pnpm build`.
2. `cloudflare/wrangler-action@v3` runs
   `pages deploy dist/ --project-name=chess-9a0 --branch=<branch>`.
3. Needs the `CF_API_TOKEN` secret and `CLOUDFLARE_ACCOUNT_ID` Actions variable.

The workflow uploads only `dist/`; local CLI coaching is development-only.

**Project:** `chess-9a0`. **Domain:** `chess.significanthobbies.com`.

### Required headers

The Stockfish WASM build needs `SharedArrayBuffer`, which requires the
cross-origin isolation headers. The Vite dev server sets them
(`vite.config.ts`); **the deploy target must serve them too**:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

Cloudflare Pages reads these from `public/_headers`, which Vite copies to the
root of `dist/`. Verify both headers on the production document after each
deploy.

## Docs site (Blume)

The `docs/` tree is rendered by Blume (presentation layer only — Markdown is the
source of truth). There is **no automated docs deploy** yet.

```bash
./scripts/docs-build.sh      # → dist/ (separate from the Vite build)
```

> **Unresolved:** docs site domain. `blume.config.ts` sets
> `deployment.site` to the known app domain as a placeholder; a dedicated
> `docs.chess.significanthobbies.com` (or a `/docs` path on the main domain) is
> TBD. Set `deployment.base` / `deployment.site` accordingly when decided.

## CI

- `.github/workflows/ci.yml` — on push/PR to `main`/`master`: install, lint,
  typecheck, build, and run the Playwright smoke test against its managed Vite
  server.
- `.github/workflows/docs.yml` (added with this docs system) — on changes to
  `docs/`, `blume.config.ts`, or `scripts/docs-*`, runs `blume validate --strict`
  and `blume build` to catch broken links and unrenderable Markdown. Uses
  `npx --yes blume@0.8.0` (pinned; see [dependency notes](../knowledge/learnings.md)).

## Dependency updates

- `renovate.json` extends `github>sarthakagrawal927/foundry-renovate-config`.
- `.github/dependabot.yml` — weekly npm updates, **only** for `@saas-maker/feedback`,
  one open PR at a time, `deps:` commit prefix.
