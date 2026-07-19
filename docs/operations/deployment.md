---
title: Deployment
description: How Chess Coach ships — Cloudflare Pages (manual), Vercel config, required headers, and the docs (Blume) build.
---

# Deployment

The app is a static SPA plus one Vercel serverless function (`api/coach.ts`) for
cloud AI. There are two deploy pathways in the repo; only Cloudflare Pages is
currently used.

## Cloudflare Pages (active)

`.github/workflows/deploy.yml` — **manual only** (`workflow_dispatch`).

1. Checkout, pnpm install (frozen lockfile, `--ignore-scripts`), `pnpm build`.
2. `cloudflare/wrangler-action@v3` runs
   `pages deploy dist/ --project-name=chess-9a0 --branch=<branch>`.
3. Needs `CF_API_TOKEN` secret in the repo.

**Project:** `chess-9a0`. **Domain:** `chess.significanthobbies.com`.

### Required headers

The Stockfish WASM build needs `SharedArrayBuffer`, which requires the
cross-origin isolation headers. The Vite dev server sets them
(`vite.config.ts`); **the deploy target must serve them too**:

```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

On Cloudflare Pages these are set via `_headers` or the dashboard — there is
currently **no `_headers` file in the repo**.

> **Unresolved:** confirm the COEP/COOP headers are actually served by the Pages
> project. If the engine works on the live site, they are; if not, add a
> `public/_headers` file. (The repo has `public/_redirects` for the `/api/ai`
> rewrite but no `_headers`.)

## Vercel (configured, status unclear)

- `vercel.json` defines SPA rewrites: `/faq` → `/faq.html`, then filesystem
  handling, then catch-all to `/index.html`.
- `api/coach.ts` is a Vercel serverless function (only works on Vercel).
- `.vercel/` is gitignored. The security audit (commit b3db100) noted "confirm
  the Vercel deployment is paused/deleted if the project is inactive."

> **Unresolved:** whether a live Vercel deployment still exists. If it does, the
> open LLM proxy (`api/coach.ts`) is exposed — see
> [security-audit](security-audit.md).

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

- `.github/workflows/ci.yml` — on push/PR to `main`/`master`: `pnpm install
  --frozen-lockfile --ignore-scripts` then `pnpm build`. No tests, no lint, no
  docs check in this workflow.
- `.github/workflows/docs.yml` (added with this docs system) — on changes to
  `docs/`, `blume.config.ts`, or `scripts/docs-*`, runs `blume validate --strict`
  and `blume build` to catch broken links and unrenderable Markdown. Uses
  `npx --yes blume@0.8.0` (pinned; see [dependency notes](../knowledge/learnings.md)).

## Dependency updates

- `renovate.json` extends `github>sarthakagrawal927/foundry-renovate-config`.
- `.github/dependabot.yml` — weekly npm updates, **only** for `@saas-maker/sdk`,
  one open PR at a time, `deps:` commit prefix.
