---
title: AI Coaching
description: How optional local AI coaching works during development.
---

# AI Coaching

The coaching feature is the product's differentiator. It is **on-demand**: the
player clicks *Analyze* on the last move and a short explanation streams into the
Coach panel. Coaching is never auto-triggered on every move (cost + latency).

## Provider model

The maintained transport lives in [`src/hooks/useAI.ts`](https://github.com/Significant-Hobbies/chess/blob/main/src/hooks/useAI.ts).

| Path | Provider set | Transport | Where it runs |
| --- | --- | --- | --- |
| **Local CLI** | `claude-code`, `codex`, `gemini-cli` | POST `/api/chat` → Express bridge spawns the CLI and streams SSE back | Dev only (`server/` submodule) |
- `IS_LOCAL` (derived from `import.meta.env.DEV`) prevents coaching requests in
  production, where no Express bridge exists.
- Hosted cloud-provider proxying was retired on 2026-08-01 rather than adding a
  second authenticated production service to this maintenance-mode project.
- The Express bridge is a git submodule (`server/` →
  `github.com/sarthakagrawal927/cli-bridge.git`). `pnpm dev` and `pnpm server`
  run `npm install` inside it on demand.

## Streaming

The local bridge returns Server-Sent Events with normalized `text` chunks.

An `AbortController` lets the user cancel an in-flight stream; aborting suppresses
the error.

## Prompt design

The system prompt and per-move prompt are in [`src/lib/ai-prompts.ts`](https://github.com/Significant-Hobbies/chess/blob/main/src/lib/ai-prompts.ts).

- **System prompt** fixes the persona: a concise chess coach that uses concrete
  positional/tactical concepts, stays under 3 sentences, is encouraging but
  honest, and never gives generic advice.
- **Per-move prompt** is built from `CoachContext` (FEN before the move, the
  player's move SAN, eval before/after, the engine's best move, player color). It
  normalizes eval to the *player's* perspective and computes centipawn loss, then
  branches:
  - **Best move** (cp loss ≤ 10 or matches engine) → ask for 2 sentences on what
    makes the move strong.
  - **Suboptimal move** → ask for 2–3 sentences: (1) the idea behind the played
    move, (2) why the engine's move is better, concretely for this position.

The prompt deliberately avoids dumping the full move list or PGN — it gives the
model just the position before the move and the two moves, which keeps token cost
low and answers specific.

## Models offered

The local model list is hardcoded in `MODELS` in `useAI.ts`. The default is
`claude-code` with `claude-code-local`. Update the list there when adding or
retiring local CLI adapters; it is not config-driven.

## Configuration persistence

AI config (local provider and model) is stored in `localStorage` under
`chess-coach-ai-config`. Provider API keys are no longer accepted by the app.
