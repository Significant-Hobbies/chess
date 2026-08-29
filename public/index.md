# Chess Coach

Browser-based chess practice against Stockfish 18 with optional, on-demand AI
explanations.

## What is included

- Six engine levels, configurable clocks, hints, undo, and board flip
- Real-time evaluation and move-quality badges
- Local game persistence with no account
- Optional explanations from authenticated local CLI tools through the
  development bridge

Stockfish runs locally in a Web Worker. The static production deployment does
not expose the development-only AI bridge or accept provider keys.

## Public pages

- [Play](https://chess.significanthobbies.com/)
- [FAQ](https://chess.significanthobbies.com/faq)
- [Changelog](https://chess.significanthobbies.com/changelog)

## Agent entrypoints

- https://chess.significanthobbies.com/llms.txt
- https://chess.significanthobbies.com/index.md
- https://chess.significanthobbies.com/api/ai
