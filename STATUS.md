# STATUS — Chess Coach

Last updated: 2026-07-26

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
- Multi-provider AI coaching code (Vercel-only cloud proxy + local CLI bridge);
  the active Cloudflare Pages deploy is static and does not serve the proxy.
- Agent/crawler surfaces (llms.txt, /api/ai, sitemap, robots, IndexNow, FAQ +
  JSON-LD). SaaS Maker widgets + PostHog analytics.
- Cloudflare Pages deploy (manual dispatch).
- Tracked Cloudflare Pages COEP/COOP headers required by Stockfish WASM.

## Blockers

- None for the active static Cloudflare Pages deploy.
- **Vercel-only open LLM proxy** (`api/coach.ts`): no auth or rate limiting.
  This does not ship in the Pages `dist/` artifact, but must be secured before
  enabling or redeploying the Vercel path. Details:
  [docs/operations/security-audit](docs/operations/security-audit.md).
- **Vercel-only Google API key handling** (`api/coach.ts:146`): move the key
  from the URL query to the `x-goog-api-key` header before a Vercel redeploy.
- **Wide-open CORS** in the cli-bridge submodule (`server/index.mjs`): restrict
  to the frontend origin before exposing that development bridge remotely.
- **Unresolved:** whether a live Vercel deployment still exists (would expose the
  open proxy). Confirm paused/deleted.

## Unresolved questions

- Docs site domain: dedicated `docs.` subdomain vs. `/docs` path on the main
  domain? `blume.config.ts` currently uses the app domain as a placeholder.
- Playwright smoke test targets port 3000 but Vite defaults to 5173 — needs a
  `playwright.config.ts` with a `webServer`.

## Next steps

1. Deploy the current static build through the manual Pages workflow and verify
   the tracked COEP/COOP headers plus Stockfish startup.
2. Confirm any old Vercel deployment is paused/deleted; secure `api/coach.ts`
   before intentionally enabling that separate path.
3. Add a `lint` + `typecheck` script and wire them into CI (currently only
   `pnpm build` runs).
4. Add a real `playwright.config.ts` and a `test` script; fix the port mismatch.
5. PGN import/export and promotion-piece selection (planned product features).
6. Decide docs domain and wire an automated docs deploy.

## Deferred

- Opening book, endgame tablebase, multiplayer, cross-device game history.
