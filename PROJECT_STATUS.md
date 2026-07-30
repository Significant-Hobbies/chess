# Chess Coach — PROJECT STATUS

Last updated: 2026-07-29

> Deep context lives in [`docs/`](docs/index.md). Update this file when durable
> current or shipped product truth changes.

## Why / What

A no-account, browser-based chess practice tool that pairs Stockfish play with
plain-language AI coaching. Personal learning project under Significant Hobbies.

## Dependencies

- Stockfish WASM, Vite, Cloudflare Pages, and optional AI coaching providers.

## Timeline

- **2026-07-31:** Enforced lint, TypeScript, build, and a managed-server
  Playwright smoke test in CI.
- **2026-07-29:** Added an owned `/changelog` with verified release outcomes and
  direct GitHub Roadmap and Source links.
- **2026-07-26:** Current static Cloudflare Pages product and agent surfaces
  verified and documented.

## Products

- **Live:** <https://chess.significanthobbies.com>
- **Repo:** <https://github.com/Significant-Hobbies/chess>

## Features (shipped)

- Full Stockfish game (6 levels), eval bar, move quality badges, hints, undo,
  board flip, configurable clocks, localStorage persistence, responsive layout.
- Multi-provider AI coaching code (Vercel-only cloud proxy + local CLI bridge);
  the active Cloudflare Pages deploy is static and does not serve the proxy.
- Agent/crawler surfaces (llms.txt, /api/ai, sitemap, robots, IndexNow, FAQ +
  JSON-LD). SaaS Maker widgets + PostHog analytics.
- Cloudflare Pages deploy (manual dispatch).
- Tracked Cloudflare Pages COEP/COOP headers required by Stockfish WASM.
- Owned editorial product changelog at `/changelog`.

## Work queue

Open work is tracked only in [GitHub Issues](https://github.com/Significant-Hobbies/chess/issues).
An open issue is a to-do, a linked pull request is in progress, and merge plus
issue closure makes the work done.
