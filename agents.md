# Chess Coach

Play chess against Stockfish (WASM) with AI-powered move coaching and analysis.

## Tech Stack

- **Framework**: React 19 + TypeScript (Vite 6, no SSR)
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Chess engine**: Stockfish WASM (runs in Web Worker via `/public/stockfish.js`)
- **Chess logic**: `chess.js` (board state, move validation, PGN/FEN)
- **Board UI**: `react-chessboard` v5
- **Icons**: `lucide-react`
- **AI coaching**: Multi-provider — supports Anthropic, OpenAI, Google, DeepSeek APIs + local CLI tools (Claude Code, Codex, Gemini CLI)
- **SaaS integrations**: `@saas-maker/*` (feedback widget, analytics, testimonials, changelog)
- **Deployment**: Vercel (serverless function at `api/coach.ts` + static SPA)
- **Local dev server**: Express 5 (`server/index.mjs`) — CLI-to-HTTP bridge for local AI tools

## Architecture

```
chess/
  src/
    App.tsx                       # Root — header, AI config modal, game
    main.tsx                      # React entry point
    index.css                     # Tailwind import + global styles (dark theme #1a1a2e)
    components/
      ChessGame.tsx               # Main game logic — board, clocks, controls, state persistence
      CoachPanel.tsx              # AI coaching explanation display + analyze button
      EvalBar.tsx                 # Stockfish eval bar (vertical desktop, horizontal mobile)
      MoveList.tsx                # Move history with quality badges
      ChessClock.tsx              # Countdown timer per player
      DifficultyPicker.tsx        # 6-level difficulty selector (Beginner -> Max)
      AIConfig.tsx                # Modal to select AI provider, model, API key
      saasmaker-feedback.tsx      # SaaSMaker feedback/testimonials/changelog widgets
    hooks/
      useAI.ts                    # AI provider abstraction — SSE streaming
    lib/
      stockfish.ts                # StockfishEngine class — Web Worker wrapper with queue
      ai-prompts.ts               # System prompt + per-move coaching prompt builder
      saasmaker.ts                # SaaSMaker SDK client init
  server/
    index.mjs                     # Express server (port 3456) — spawns CLI tools, streams SSE
  api/
    coach.ts                      # Vercel serverless fn — proxies AI API calls
  public/
    stockfish.js + .wasm files
```

### How frontend/backend connect

- **Local dev**: Vite proxies `/api` to `http://localhost:3456` (Express CLI bridge). `pnpm dev` starts both.
- **Cloud AI (prod)**: Frontend POSTs to `/api/coach` (Vercel serverless fn) which proxies to upstream AI APIs.
- **Local AI (dev)**: Frontend POSTs to `/api/chat` (Express CLI bridge) which spawns `claude`/`codex`/`gemini` CLI and streams back SSE.
- **Stockfish**: Runs entirely client-side in a Web Worker.

### State management

- All state in React `useState` in `ChessGame.tsx`.
- Game state persisted to `localStorage` key `chess-coach-game`.
- AI config persisted to `localStorage` key `chess-coach-ai-config`.

## Key Conventions

- **Components**: PascalCase function components, one per file, named exports
- **Hooks**: `use` prefix, in `hooks/` directory
- **Move quality**: Centipawn loss thresholds — best (<10), good (<50), inaccuracy (<100), mistake (<200), blunder (200+)
- **Eval normalization**: Stockfish reports from side-to-move; `StockfishEngine` normalizes to white's perspective

## Commands

```bash
pnpm dev              # Start Vite + Express CLI bridge (both concurrently)
pnpm dev:frontend     # Vite only (no local AI)
pnpm server           # Express CLI bridge only
pnpm build            # Production build (Vite)
pnpm preview          # Preview production build
```

## Environment Variables

```bash
VITE_SAASMAKER_API_KEY=   # SaaSMaker project key (feedback widget, analytics)
```

Cloud AI API keys are entered by the user in the UI and stored in localStorage. No server-side env vars needed for AI.

## Current State

**Done:**
- Full chess game against Stockfish with 6 difficulty levels
- Board flip, undo, best-move hint (arrow overlay)
- Real-time eval bar (vertical desktop, horizontal mobile)
- Move history with quality classification and color-coded badges
- Chess clocks with configurable time controls (untimed, 1/3/5/10/15m)
- AI coaching panel — on-demand "Analyze" streams explanation from any configured provider
- Multi-provider AI config modal (7 providers, persisted)
- Game state persistence across reloads (localStorage)
- Responsive layout (mobile + desktop)
- SaaSMaker feedback widget, Vercel deployment config

**Not done:**
- No tests, no linting/formatting
- No opening book or endgame tablebase
- No PGN export/import
- No game history (only current game persisted)
- No multiplayer, no sound effects
- Promotion always auto-queens (no piece selection UI)
