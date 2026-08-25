---
title: Deployment
description: How Chess Coach ships — Cloudflare Pages (manual) and required headers.
---

# Deployment

The only maintained deployment is a static SPA on Cloudflare Pages. Hosted AI
proxying and the dormant Vercel path were retired on 2026-08-01.

## Cloudflare Pages (active)

`.github/workflows/deploy.yml` — **manual only** (`workflow_dispatch`).

1. Checkout, pnpm install (frozen lockfile, `--ignore-scripts`), `pnpm build`.
2. The exact development dependency `wrangler@4.120.0` runs
   `pages deploy dist/ --project-name=chess-9a0 --branch=<branch>
   --commit-hash=<git-sha>`.
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

## CI

- `.github/workflows/ci.yml` — on push/PR to `main`/`master`: install, lint,
  typecheck, build, and run the Playwright smoke test against its managed Vite
  server.
- `.github/workflows/docs.yml` — on changes to `docs/`, runs the local link
  checker to catch broken Markdown links.

## Dependency updates

- `renovate.json` extends `github>sarthakagrawal927/foundry-renovate-config`.
- `.github/dependabot.yml` — weekly npm updates, **only** for `@saas-maker/feedback`,
  one open PR at a time, `deps:` commit prefix.
