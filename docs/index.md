---
title: Chess Coach Docs
description: Knowledge system for the Chess Coach repository — product, architecture, decisions, development, operations, and durable learnings.
---

# Chess Coach — Repository Knowledge System

Chess Coach is a browser chess app: play Stockfish (WASM) in the browser and get
optional, plain-language AI coaching for any position. This `docs/` tree is the
canonical, source-of-truth documentation for the repository. It is written for
both humans and agents, and is rendered for the web by [Blume](../blume.config.ts)
(Blume is only the presentation layer — this Markdown is the source of truth).

> Repository bootloader: [`AGENTS.md`](../AGENTS.md). Current snapshot:
> [`STATUS.md`](../STATUS.md). Human entry point: [`README.md`](../README.md).

## How this knowledge system is organized

| Section | What lives there | Start here |
| --- | --- | --- |
| [`product/`](product/overview.md) | What the product is, who it's for, how AI coaching works | [Product overview](product/overview.md) |
| [`architecture/`](architecture/overview.md) | Component map, data flow, state, technical decisions | [Architecture overview](architecture/overview.md) |
| [`development/`](development/setup.md) | Local setup, commands, conventions, testing | [Development setup](development/setup.md) |
| [`operations/`](operations/deployment.md) | Deployment, security, agent/AI indexing surfaces | [Operations](operations/deployment.md) |
| [`knowledge/`](knowledge/learnings.md) | Durable learnings and failed approaches | [Learnings](knowledge/learnings.md) |

## Documentation maintenance rules

1. **Markdown in this tree is the source of truth.** Blume, the live site, and
   `public/llms-full.txt` are derived presentation surfaces — never edit them to
   correct a fact; fix the Markdown here instead.
2. **One canonical home per fact.** Don't re-explain something that already has a
   home here — link to it. Code-discoverable details (function signatures, exact
   dependency versions) are not duplicated; we document the *why* and the
   non-obvious constraints.
3. **Mark unresolved questions explicitly** with `> **Unresolved:**` callouts
   rather than guessing.
4. **Keep pages focused** (target ~150–300 lines). Split rather than grow a
   catch-all page.
5. **When consolidating**, prefer `docs/archive/<name>.md` over deletion so git
   rename history is preserved.
6. **Update `STATUS.md`** when the objective, active work, or blockers change —
   it is the short view, this tree is the deep view.

## Adding a new page

1. Drop a `.md` file in the right section folder (use frontmatter `title` +
   `description`).
2. Link it from the section's index and from this page's table if it's a top-level
   entry point.
3. Run `./scripts/docs-validate.sh` to catch broken links before committing.
4. The Blume CI workflow (`.github/workflows/docs.yml`) re-validates on push.
