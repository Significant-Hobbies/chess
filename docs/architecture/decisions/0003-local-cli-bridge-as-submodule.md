---
title: ADR-0003 — Local CLI bridge is a git submodule
description: Why server/ is a separate repo (cli-bridge) pinned as a submodule rather than vendored.
---

# ADR-0003 — Local CLI bridge is a git submodule

**Status:** Accepted
**Date:** 2026-07-17 (backfilled)

## Context

For local development, the app can use local AI CLIs (`claude`, `codex`,
`gemini`) instead of paid cloud APIs. This needs a small Express server that
spawns the CLI and streams output as SSE.

## Decision

`server/` is a git submodule pointing at
`github.com/sarthakagrawal927/cli-bridge.git` rather than vendored source in this
repo. `pnpm dev` and `pnpm server` run `npm install` inside `server/` on demand.

## Consequences

**Positive**

- The CLI bridge is reusable across other fleet projects that want local AI.
- Keeps this repo focused on the chess SPA.

**Negative / constraints**

- Fresh clones need `git submodule update --init --recursive` to use local AI.
  `pnpm dev:frontend` works without the submodule (Vite only, no local AI).
- The submodule is **not initialized** in the current working tree (status `-`
  in `git submodule status`). Local AI providers won't work until it's checked out.
- `pnpm dev` shells out to `npm install` inside `server/` on every start — slow
  on first run, noisy on subsequent runs.

## Alternatives considered

- **Vendor the bridge in-repo**: rejected — duplicates code shared across the
  fleet.
- **No local AI path**: rejected — local CLIs are the zero-cost dev path and a
  reason this project exists.
