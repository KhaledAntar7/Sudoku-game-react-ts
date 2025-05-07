import React, { useState, useEffect } from "react";
import { SudokuBoard } from "./components/SudokuBoard";
import { validateBoard, ConflictMap } from "./utils/validateBoard";
import { generatePuzzle } from "./utils/sudokuGenerator";
import "./styles/sudoku.css";

const App = () => {
  const emptyBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [conflicts, setConflicts] = useState<ConflictMap>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(false))
  );
  const [gameStatus, setGameStatus] = useState<string>("");

  // Generate easy puzzle on initial load
  useEffect(() => {
    generateNewPuzzle("easy");
  }, []);

  const handleChange = (row: number, col: number, value: number | "") => {
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = typeof value === "number" ? value : 0;
    setBoard(newBoard);

    // Clear conflicts when making changes
    if (conflicts.some((row) => row.some((cell) => cell))) {
      setConflicts(
        Array(9)
          .fill(null)
          .map(() => Array(9).fill(false))
      );
      setGameStatus("");
    }
  };

  const checkSolution = () => {
    const conflictMap = validateBoard(board);
    setConflicts(conflictMap);

    // Check if the board is complete and valid
    const hasConflicts = conflictMap.some((row) => row.some((cell) => cell));
    const isFilled = board.every((row) => row.every((cell) => cell !== 0));

    if (!hasConflicts && isFilled) {
      setGameStatus("Congratulations! You solved the puzzle correctly!");
    } else if (hasConflicts) {
      setGameStatus("There are some errors in your solution");
    } else if (!isFilled) {
      setGameStatus("The puzzle is not complete yet");
    }
  };

  const generateNewPuzzle = (difficulty: "easy" | "medium" | "hard") => {
    const newBoard = generatePuzzle(difficulty);
    setBoard(newBoard);
    setConflicts(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(false))
    );
    setGameStatus(`New ${difficulty} puzzle generated`);

    // Clear status message after 3 seconds
    setTimeout(() => {
      setGameStatus("");
    }, 3000);
  };

  return (
    <div className="container">
      <h1>Sudoku Challenge</h1>

      <div className="sudoku-container">
        <SudokuBoard
          board={board}
          onChange={handleChange}
          conflicts={conflicts}
        />

        <div className="button-container">
          <button onClick={checkSolution} className="check-button">
            Check Solution
          </button>
        </div>

        <div className="difficulty-container">
          <button
            onClick={() => generateNewPuzzle("easy")}
            className="difficulty-button easy"
          >
            Easy
          </button>
          <button
            onClick={() => generateNewPuzzle("medium")}
            className="difficulty-button medium"
          >
            Medium
          </button>
          <button
            onClick={() => generateNewPuzzle("hard")}
            className="difficulty-button hard"
          >
            Hard
          </button>
        </div>

        {gameStatus && <div className="game-status">{gameStatus}</div>}
      </div>
    </div>
  );
};

export default App;
