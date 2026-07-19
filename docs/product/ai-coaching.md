---
title: AI Coaching
description: How AI coaching works — providers, streaming, prompt design, and the local-vs-cloud split.
---

# AI Coaching

The coaching feature is the product's differentiator. It is **on-demand**: the
player clicks *Analyze* on the last move and a short explanation streams into the
Coach panel. Coaching is never auto-triggered on every move (cost + latency).

## Provider model

There are two transport paths, decided by whether the selected provider is a
"local" CLI or a cloud API. The split lives in [`src/hooks/useAI.ts`](https://github.com/Significant-Hobbies/chess/blob/main/src/hooks/useAI.ts).

| Path | Provider set | Transport | Where it runs |
| --- | --- | --- | --- |
| **Local CLI** | `claude-code`, `codex`, `gemini-cli` | POST `/api/chat` → Express bridge spawns the CLI and streams SSE back | Dev only (`server/` submodule) |
| **Cloud proxy** | `openai`, `anthropic`, `google`, `deepseek` | POST `/api/coach` → Vercel serverless fn forwards to the upstream API | Prod |

- `LOCAL_PROVIDERS` and `IS_LOCAL` (derived from `import.meta.env.DEV`) decide the
  path. In production the local CLI path is unreachable (no Express bridge).
- The cloud proxy is `api/coach.ts` — see
  [operations/security-audit](../operations/security-audit.md): it currently
  forwards user-supplied keys with **no auth and no rate limiting**.
- The Express bridge is a git submodule (`server/` →
  `github.com/sarthakagrawal927/cli-bridge.git`). `pnpm dev` and `pnpm server`
  run `npm install` inside it on demand.

## Streaming

Both paths return Server-Sent Events. `useAI.ts` keeps a per-provider chunk parser
map (`CHUNK_PARSERS`) because each upstream shapes its SSE deltas differently:

- `anthropic` → `content_block_delta` → `delta.text`
- `google` → `candidates[0].content.parts[0].text`
- `_openai` (also used for DeepSeek, which is OpenAI-compatible) →
  `choices[0].delta.content`

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

The model list per provider is hardcoded in `MODELS` in `useAI.ts`. Defaults:
local dev → `claude-code`; prod → `claude-sonnet-4-5-20250929`. Update the list
there when adding or retiring models — it is not config-driven.

## Configuration persistence

AI config (provider, model, apiKey) is stored in `localStorage` under
`chess-coach-ai-config`. **The API key lives in the browser**, not the server —
the serverless proxy receives it per request and forwards it upstream. This is
inherent to the open-proxy design and is part of the security blocker in
[security-audit](../operations/security-audit.md).
