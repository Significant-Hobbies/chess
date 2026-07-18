# AGENTS.md — Chess Coach

Play chess against Stockfish (WASM) in the browser with optional, on-demand AI
coaching. React 19 + TypeScript + Vite SPA; no SSR. Personal project under
Significant Hobbies.

> **Deep context lives in [`docs/`](docs/index.md).** This file is a bootloader —
> read it, then jump to the relevant doc instead of re-deriving from code.
> Current snapshot: [`STATUS.md`](STATUS.md). Human entry: [`README.md`](README.md).

## Essential commands

```bash
pnpm install
git submodule update --init --recursive   # only for local AI CLI providers
pnpm dev              # Vite + Express CLI bridge (local AI). Runs npm install in server/ on start.
pnpm dev:frontend     # Vite only (no local AI)
pnpm build            # Production build → dist/
```

Docs (Blume is fetched on demand, not a dependency):

```bash
./scripts/docs-validate.sh   # link validation (strict) — run before committing doc changes
./scripts/docs-build.sh      # Blume build → dist/ (separate from Vite build; don't run both at once)
```

## Critical constraints (don't learn these the hard way)

- **Cross-origin isolation required**: Stockfish WASM needs
  `Cross-Origin-Embedder-Policy: require-corp` + `Cross-Origin-Opener-Policy: same-origin`.
  Vite sets them in dev; **deploy targets must serve them too**. See
  [docs/operations/deployment](docs/operations/deployment.md).
- **`vite.config.ts` excludes `stockfish` from `optimizeDeps`** — don't remove
  this; the engine loads from `public/`, not the npm bundle.
- **Eval perspective is a 3-step transform**: side-to-move → White (in
  `StockfishEngine`) → player (in `ChessGame`). See
  [docs/development/conventions](docs/development/conventions.md).
- **Clone games via PGN, not `new Chess(fen)`** — FEN drops move history.
- **New static `.html` pages must be added to `vite.config.ts` `rollupOptions.input`**
  or they silently drop from the build (happened to `faq.html`, fixed in d056c08).
- **`api/coach.ts` is an open LLM proxy** (no auth, no rate limit) — the primary
  security blocker. Don't redeploy without addressing it. See
  [docs/operations/security-audit](docs/operations/security-audit.md).
- **The `index.html` JSON-LD block is generated** (`fleet-jsonld:start/end`) —
  edit the fleet registry, not the block.

## Documentation navigation

| Need | Go to |
| --- | --- |
| What the product is | [docs/product/overview](docs/product/overview.md) |
| How AI coaching works | [docs/product/ai-coaching](docs/product/ai-coaching.md) |
| Component map, data flow, state | [docs/architecture/overview](docs/architecture/overview.md) |
| Why decisions were made | [docs/architecture/decisions](docs/architecture/decisions/) |
| Setup, env, commands | [docs/development/setup](docs/development/setup.md) |
| Code conventions | [docs/development/conventions](docs/development/conventions.md) |
| Testing state | [docs/development/testing](docs/development/testing.md) |
| Deployment / CI | [docs/operations/deployment](docs/operations/deployment.md) |
| Agent indexing surfaces | [docs/operations/agent-indexing](docs/operations/agent-indexing.md) |
| Security audit | [docs/operations/security-audit](docs/operations/security-audit.md) |
| Non-obvious gotchas | [docs/knowledge/learnings](docs/knowledge/learnings.md) |
| What not to try again | [docs/knowledge/failed-approaches](docs/knowledge/failed-approaches.md) |

## Documentation maintenance rules

1. **Markdown in `docs/` is the source of truth.** Blume, the live site, and
   `public/llms-full.txt` are derived presentation — fix facts here, not there.
2. **One home per fact.** Link, don't duplicate. Don't re-explain what code or
   another doc already covers.
3. **Mark unknowns explicitly** (`> **Unresolved:**`) — don't guess.
4. **Update `STATUS.md`** when objective / active work / blockers / next steps
   change.
5. **Prefer `docs/archive/<name>.md` over deletion** to preserve git rename
   history.
6. **Run `./scripts/docs-validate.sh`** before committing doc changes; the
   `.github/workflows/docs.yml` CI re-validates on push.

## Safety constraints (repo-wide)

- Never commit secrets / `.env*` / SSH keys / cloud credentials. `.env*` and
  `*.local` are gitignored; a husky pre-push hook scans for common secret patterns.
- Don't edit the generated `fleet-jsonld` block in `index.html`.
- Don't modify agent skills/plugins outside this repo (`.claude/`, `skills/`, etc.).
- Don't push, deploy, run migrations, or open PRs without explicit instruction.
