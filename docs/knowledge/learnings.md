---
title: Durable Learnings
description: Non-obvious constraints and gotchas discovered while building Chess Coach — the things you'd only learn by breaking them.
---

# Durable Learnings

Non-obvious constraints worth recording. Each is something that cost time to
discover or would silently break a change.

## Stockfish WASM needs cross-origin isolation

The Stockfish 18 WASM build uses `SharedArrayBuffer`, which requires
`Cross-Origin-Embedder-Policy: require-corp` and
`Cross-Origin-Opener-Policy: same-origin`. Vite sets them in dev
(`vite.config.ts`); **every deploy target must serve them too** or the engine
won't initialize. See [operations/deployment](../operations/deployment.md).

## `optimizeDeps` must exclude `stockfish`

`vite.config.ts` has `optimizeDeps: { exclude: ['stockfish'] }`. If Vite tries to
pre-bundle the `stockfish` npm package, the worker breaks. The engine is loaded
from `/public/stockfish.js`, not from the npm import.

## Eval perspective is a three-step transform

Stockfish reports from side-to-move → `StockfishEngine` normalizes to White →
`ChessGame` re-signs to the player. Skipping any step gives silently wrong loss
values and bad quality badges. See [development/conventions](../development/conventions.md).

## `chess.js` `new Chess(fen)` loses history

`cloneGame` uses PGN, not FEN, to preserve move history. A "simpler" `new
Chess(fen)` clone will silently drop history and break undo / move list.

## Board sizing: avoid mount-time ResizeObserver + vh units

`ChessGame` deliberately does **not** fire `ResizeObserver` on initial mount (the
`useState` initial is already correct) and avoids `vh` units, because mobile URL
bar show/hide changes `vh` and causes CLS. The board container uses
`contain: strict` to isolate layout. A `#lcp-shell` div in `index.html` renders
the LCP text immediately to avoid a blank dark frame.

## Vite multi-page builds silently drop unlisted entries

`faq.html` must be listed in `rollupOptions.input` or it's missing from the build.
This exact bug shipped and was fixed in d056c08. Any new static `.html` page must
be added to `vite.config.ts` input.

## SSE parsing is per-provider

The cloud proxy streams upstream SSE unchanged, so the client must parse per
provider (`CHUNK_PARSERS` in `useAI.ts`). Adding a cloud provider means adding a
parser (or reusing `_openai` if it's OpenAI-compatible, as DeepSeek does).

## Husky pre-push lint is currently a no-op

There is no `lint` script in `package.json`, so the pre-push hook's lint step
(`pnpm run --if-present lint`) does nothing. The secret scan still runs. Don't
assume pushes are lint-gated.

## `pnpm dev` runs `npm install` inside `server/` every start

The `dev` and `server` scripts shell out to `cd server && npm install --silent`
before starting the bridge. This is slow on first run and noisy after. It's
intentional so the submodule works without a separate install step, but it
assumes network access on dev start.

## Blume version pinning (docs)

Blume is fetched on demand by the docs scripts via `npx --yes blume@0.8.0`.
`0.8.0` is pinned (not `latest`) per the 7-day-vetting dependency rule — at time
of writing, the newest Blume (`1.0.4`) was <7 days old. Bump the pin in all
`scripts/docs-*.sh` and `.github/workflows/docs.yml` together once a version is
vetted.
