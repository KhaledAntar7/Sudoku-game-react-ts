import { useState, useEffect } from "react";
import { SudokuBoard } from "./components/SudokuBoard";
import { validateBoard, ConflictMap } from "./utils/validateBoard";
import { generatePuzzle } from "./utils/sudokuGenerator";
import "./styles/sudoku.css";
import { solveBoard } from "./utils/sudokuGenerator";
import "./App.css";

const App = () => {
  const emptyBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  const emptyBooleanBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(false));

  const [board, setBoard] = useState<number[][]>(emptyBoard);
  const [initialCells, setInitialCells] =
    useState<boolean[][]>(emptyBooleanBoard);
  const [conflicts, setConflicts] = useState<ConflictMap>(emptyBooleanBoard);
  const [gameStatus, setGameStatus] = useState<string>("");

  // Generate easy puzzle on initial load
  useEffect(() => {
    generateNewPuzzle("easy");
  }, []);

  const handleChange = (row: number, col: number, value: number | "") => {
    // Skip changes to initial cells
    if (initialCells[row][col]) {
      return;
    }

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = typeof value === "number" ? value : 0;
    setBoard(newBoard);

    // Clear conflicts when making changes
    if (conflicts.some((row) => row.some((cell) => cell))) {
      setConflicts(emptyBooleanBoard.map((row) => [...row]));
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

    // Mark initial cells as fixed
    const newInitialCells = newBoard.map((row) =>
      row.map((cell) => cell !== 0)
    );

    setBoard(newBoard);
    setInitialCells(newInitialCells);
    setConflicts(emptyBooleanBoard.map((row) => [...row]));
    setGameStatus(`New ${difficulty} puzzle generated`);

    // Clear status message after 3 seconds
    setTimeout(() => {
      setGameStatus("");
    }, 3000);
  };

  const handleSolve = () => {
    const boardCopy = board.map((row) => [...row]); // Deep copy
    const solved = solveBoard(boardCopy);

    if (solved) {
      setBoard(boardCopy);
      setGameStatus("Puzzle solved!");
      setConflicts(emptyBooleanBoard.map((row) => [...row]));
    } else {
      setGameStatus("This puzzle has no valid solution.");
    }
  };

  const handleHint = () => {
    const originalBoard = board.map((row) => [...row]); // current board state
    const solvedBoard = board.map((row) => [...row]); // for solving

    if (!solveBoard(solvedBoard)) {
      setGameStatus("Cannot provide hint: board is unsolvable.");
      return;
    }

    // Find all empty cells that are not initial cells
    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (originalBoard[row][col] === 0 && !initialCells[row][col]) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      setGameStatus("No more hints available — the board is full.");
      return;
    }

    // Pick a random empty cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    const newBoard = originalBoard.map((r) => [...r]);
    newBoard[row][col] = solvedBoard[row][col];

    setBoard(newBoard);
    setGameStatus(`Hint: filled cell at row ${row + 1}, column ${col + 1}`);
  };

  return (
    <div className="container">
      <h1>Sudoku Challenge</h1>

      <div className="sudoku-container">
        <SudokuBoard
          board={board}
          onChange={handleChange}
          conflicts={conflicts}
          initialCells={initialCells}
        />

        <div className="button-container">
          <button onClick={checkSolution} className="check-button">
            Check Solution
          </button>
          <button onClick={handleSolve} className="solve-button">
            Solve Puzzle
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
        <button onClick={handleHint} className="hint-button">
          Get a Hint
        </button>

        {gameStatus && <div className="game-status">{gameStatus}</div>}
      </div>
    </div>
  );
};

export default App;
