import { useState } from 'react';
import './styles.css';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className={`square ${isWinningSquare ? 'winning' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const isBoardFull = squares.every(square => square !== null);
  const status = winner
    ? 'Winner: ' + winner
    : isBoardFull
      ? 'Try Again!'
      : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={square}
            onSquareClick={() => handleClick(i)}
            isWinningSquare={winningSquares.includes(i)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.slice(1).map((squares, move) => {
    const description = 'Go to move #' + (move + 1);
    return (
      <li key={move + 1}>
        <button onClick={() => jumpTo(move + 1)}>{description}</button>
      </li>
    );
  });

  const winnerInfo = calculateWinner(currentSquares);
  const winningSquares = winnerInfo ? winnerInfo.line : [];

  return (
    <div className="container">
      <div className="game">
        <h1 className="title">Tic-Tac-Toe</h1>
        <div className="game-content">
          <div className="game-info">
            <h2>History</h2>
            <ol>{moves}</ol>
            <button className="reset-button" onClick={resetGame}>Reset Game</button>
          </div>
          <div className="game-board">
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningSquares={winningSquares} />
          </div>
        </div>
      </div>
      <footer>
        <p>
          Made with lots of ❤️ by ANSH PANT
        </p>
      </footer>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
