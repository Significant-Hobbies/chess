# agents.md — chess (Chess Coach)

## Purpose
Browser chess game against Stockfish WASM with AI-powered move coaching — play, get real-time eval bar, and request per-move analysis from any configured AI provider.

## Stack
- Framework: Vite 8 + React 19 (SPA)
- Language: TypeScript
- Styling: Tailwind CSS v4 (via `@tailwindcss/vite`)
- DB: None (localStorage for game state + AI config)
- Auth: None
- Testing: Playwright (`tests/example.spec.ts`)
- Deploy: Vercel (serverless fn at `api/coach.ts` + static SPA)
- Package manager: pnpm

## Repo structure
```
src/
  App.tsx                   # Root — header, AIConfig modal, ChessGame
  components/
    ChessGame.tsx           # Board, clocks, controls, localStorage persistence
    CoachPanel.tsx          # AI coaching display + Analyze button
    EvalBar.tsx             # Stockfish eval bar (vertical desktop, horizontal mobile)
    MoveList.tsx            # Move history with quality badges
    ChessClock.tsx          # Per-player countdown timer
    DifficultyPicker.tsx    # 6 difficulty levels (Beginner → Max)
    AIConfig.tsx            # Provider/model/API key modal (7 providers)
    saasmaker-feedback.tsx  # SaaS Maker widgets
  hooks/
    useAI.ts                # AI provider abstraction — SSE streaming
  lib/
    stockfish.ts            # StockfishEngine — Web Worker wrapper with request queue
    ai-prompts.ts           # System prompt + per-move coaching prompt builder
    saasmaker.ts            # SaaS Maker SDK init
api/
  coach.ts                  # Vercel serverless — proxies cloud AI API calls
server/
  index.mjs                 # Express 5 (port 3456) — spawns claude/codex/gemini CLI, SSE
public/
  stockfish.js / .wasm      # Stockfish 18 WASM (runs in Web Worker)
```

## Key commands
```bash
pnpm dev              # Vite (port 5173) + Express server (port 3456) concurrently
pnpm dev:frontend     # Vite only
pnpm server           # Express local AI server only
pnpm build            # Vite production build
pnpm preview          # Preview production build
```

## Architecture notes
- **Stockfish** runs client-side in a Web Worker. `vite.config.ts` sets `require-corp`/`same-origin` CORS headers to enable SharedArrayBuffer for WASM.
- **AI routing**:
  - Cloud (prod): Frontend → `POST /api/coach` (Vercel serverless) → upstream AI APIs
  - Local (dev): Frontend → `POST /api/chat` (Express :3456) → spawns claude/codex/gemini CLI → SSE
  - Vite proxies `/api` → `http://localhost:3456` in dev
- **Multi-provider**: Claude, OpenAI, Gemini, DeepSeek, Groq, local CLI. 6 difficulty levels.
- **AI keys stored in localStorage** (`chess-coach-ai-config`) — no server-side secrets needed for AI.
- **Move quality thresholds** (centipawn loss): best <10, good <50, inaccuracy <100, mistake <200, blunder 200+.
- **Eval normalized to white's perspective** in `StockfishEngine` (Stockfish reports from side-to-move).
- **Promotion always auto-queens** — no piece selection UI (known gap).
- **Game state** in `ChessGame.tsx` useState, persisted to `localStorage` key `chess-coach-game`. No global store.
- **SaaS Maker** integrated: feedback, testimonials, changelog-widget.
- Env var: `VITE_SAASMAKER_API_KEY`.

## Active context
