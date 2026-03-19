import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Winning line indices for a 3x3 Tic-Tac-Toe board.
 * Index mapping:
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Compute winner info for a given board.
 * Returns:
 * - { winner: "X" | "O", line: number[] } if a win is detected
 * - { winner: null, line: null } otherwise
 */
function getWinner(board) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: null };
}

/** Create an empty board. */
function createEmptyBoard() {
  return Array(9).fill(null);
}

// PUBLIC_INTERFACE
function App() {
  /** Single-page game state (no backend required). */
  const [board, setBoard] = useState(() => createEmptyBoard());
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => getWinner(board), [board]);
  const isDraw = useMemo(
    () => !winner && board.every((cell) => cell !== null),
    [board, winner]
  );

  const currentPlayer = xIsNext ? "X" : "O";

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "It's a draw";
    return `Turn: ${currentPlayer}`;
  }, [winner, isDraw, currentPlayer]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /** Ignore clicks if game ended or square already filled. */
    if (winner || isDraw || board[index] !== null) return;

    setBoard((prev) => {
      const next = prev.slice();
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleNewGame() {
    setBoard(createEmptyBoard());
    setXIsNext(true);
  }

  return (
    <div className="App">
      <main className="ttt-page">
        <section className="ttt-card" aria-label="Tic Tac Toe">
          <header className="ttt-header">
            <h1 className="ttt-title">Tic-Tac-Toe</h1>
            <p
              className={`ttt-status ${
                winner ? "is-winner" : isDraw ? "is-draw" : ""
              }`}
              role="status"
              aria-live="polite"
            >
              {statusText}
            </p>
          </header>

          <div
            className="ttt-board"
            role="grid"
            aria-label="Tic Tac Toe board"
          >
            {board.map((value, idx) => {
              const isWinningCell = Boolean(line?.includes(idx));
              const isDisabled = winner || isDraw || value !== null;

              return (
                <button
                  key={idx}
                  type="button"
                  className={`ttt-cell ${isWinningCell ? "is-winning" : ""} ${
                    value ? "is-filled" : ""
                  }`}
                  onClick={() => handleSquareClick(idx)}
                  disabled={isDisabled}
                  role="gridcell"
                  aria-label={`Cell ${idx + 1}${
                    value ? `, ${value}` : ", empty"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>

          <footer className="ttt-controls">
            <button type="button" className="ttt-btn" onClick={handleNewGame}>
              New Game
            </button>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
