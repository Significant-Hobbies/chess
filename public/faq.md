# Chess Coach FAQ

Chess Coach combines a browser-local Stockfish 18 engine with optional,
on-demand AI explanations. No account is required.

## What does Chess Coach provide?

- Six Stockfish difficulty levels
- Real-time evaluation from White's perspective
- Move-quality badges based on centipawn loss
- Best-move hints, undo, board flip, and configurable clocks
- Local game persistence across page reloads
- Optional natural-language coaching after a move

## Does Stockfish run locally?

Yes. Stockfish runs as WebAssembly inside a Web Worker in the browser. Engine
analysis does not require a server queue or upload the game.

## How are moves classified?

Chess Coach compares the played move with Stockfish's best line and uses the
centipawn loss to label it Best, Good, Inaccuracy, Mistake, or Blunder.

## How do AI explanations work?

The user explicitly requests an explanation from the Coach panel. The prompt
includes the position, played move, evaluation change, and engine alternative.
Cloud providers require the user's own configured key. Local CLI providers are
available only through the development bridge and are not part of the static
public deployment.

## Is Chess Coach free?

The game, Stockfish analysis, evaluation bar, hints, and move-quality feedback
are free and require no account. A cloud AI provider may charge for explanations
requested with a user-supplied key.

## Can a game be paused?

The current game is saved in local storage, so a practice session can continue
after a page reload.

- [Play Chess Coach](https://chess.significanthobbies.com/)
- [Read the changelog](https://chess.significanthobbies.com/changelog)
- [View the source](https://github.com/Significant-Hobbies/chess)
