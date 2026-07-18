# STATUS — Chess Coach

Last updated: 2026-07-18

> Short view. Deep context lives in [`docs/`](docs/index.md). Update this file
> when the objective, active work, blockers, or next steps change.

## Objective

A no-account, browser-based chess practice tool that pairs Stockfish play with
plain-language AI coaching. Personal learning project under Significant Hobbies.

**Live:** <https://chess.significanthobbies.com> · **Repo:** <https://github.com/Significant-Hobbies/chess>

## Active work

- Repository knowledge system: `docs/` tree, `AGENTS.md` bootloader, Blume
  presentation config, docs CI (this branch: `docs/knowledge-system`).

## Shipped

- Full Stockfish game (6 levels), eval bar, move quality badges, hints, undo,
  board flip, configurable clocks, localStorage persistence, responsive layout.
- Multi-provider streaming AI coaching (cloud proxy + local CLI bridge).
- Agent/crawler surfaces (llms.txt, /api/ai, sitemap, robots, IndexNow, FAQ +
  JSON-LD). SaaS Maker widgets + PostHog analytics.
- Cloudflare Pages deploy (manual dispatch).

## Blockers

- **Open LLM proxy** (`api/coach.ts`): no auth, no rate limiting. Must add
  rate limiting / auth before broader promotion. Details:
  [docs/operations/security-audit](docs/operations/security-audit.md).
- **Google API key in URL query** (`api/coach.ts:135`): move to `x-goog-api-key`
  header.
- **Wide-open CORS** in the cli-bridge submodule (`server/index.mjs`): restrict
  to the frontend origin.
- **Unresolved:** whether a live Vercel deployment still exists (would expose the
  open proxy). Confirm paused/deleted.

## Unresolved questions

- Docs site domain: dedicated `docs.` subdomain vs. `/docs` path on the main
  domain? `blume.config.ts` currently uses the app domain as a placeholder.
- Are COEP/COOP headers actually served by Cloudflare Pages? No `public/_headers`
  in repo — add one if the engine fails on the live site.
- Playwright smoke test targets port 3000 but Vite defaults to 5173 — needs a
  `playwright.config.ts` with a `webServer`.

## Next steps

1. Resolve the open-proxy blocker (auth or rate limit on `api/coach.ts`).
2. Add a `lint` + `typecheck` script and wire them into CI (currently only
  `pnpm build` runs).
3. Add a real `playwright.config.ts` and a `test` script; fix the port mismatch.
4. PGN import/export and promotion-piece selection (planned product features).
5. Decide docs domain and wire an automated docs deploy.

## Deferred

- Opening book, endgame tablebase, multiplayer, cross-device game history.
