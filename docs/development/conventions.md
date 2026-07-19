---
title: Code Conventions
description: Component, hook, and naming conventions plus the move-quality and eval-normalization rules.
---

# Code Conventions

## Components & hooks

- **Components**: PascalCase function components, one per file, named exports
  (not default) — except `App.tsx` which uses a default export.
- **Hooks**: `use` prefix, live in `src/hooks/`.
- **Lib**: framework-agnostic helpers in `src/lib/`.

## Styling

- Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — v4 is
  CSS-first). Global styles + dark theme base (`#1a1a2e`) in `src/index.css`.
- Inline `style={{}}` is used where a value is dynamic (board sizing, eval bar).

## Move quality classification

`classifyMoveQuality` in `ChessGame.tsx` uses centipawn loss from the player's
perspective:

| Loss (cp) | Label |
| --- | --- |
| ≤ 10 | best |
| ≤ 50 | good |
| ≤ 100 | inaccuracy |
| ≤ 200 | mistake |
| > 200 | blunder |

These thresholds are also encoded in the coaching prompt (`isBestMove` = cp loss
≤ 10 or matches engine). Keep the two in sync if thresholds change.

## Eval normalization

Stockfish reports centipawns from the **side-to-move's** perspective.
`StockfishEngine` negates when black is to move so all evals are from **White's**
perspective. `ChessGame.afterPlayerMove` then re-signs to the **player's**
perspective when computing loss. Anyone adding a new eval consumer must decide
which perspective they want and convert explicitly.

## Game cloning

`chess.js`'s `new Chess(fen)` drops move history. To preserve history, use
`cloneGame` (loads via PGN). Don't replace it with a `new Chess(fen)` shortcut.

## Config / secrets

- No secrets in code or env-committed files. `.env*` and `*.local` are gitignored.
- `foundry.json` contains a SaaSMaker **project key** (public-prefix, low risk)
  and is committed intentionally.
- The husky pre-push hook scans for common secret patterns; respect its excludes
  (tests, fixtures, `.example`).

## Linting / formatting

- ESLint config extends `@saas-maker/eslint-config/vite` (`eslint.config.js`).
- Prettier config is `@saas-maker/prettier-config` (declared in `package.json`).
- There is **no `lint` or `format` script** in `package.json` today, so the husky
  pre-push lint step is a no-op. Adding one is a listed TODO.
