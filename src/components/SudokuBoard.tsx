import React from "react";
import "../styles/sudoku.css";

interface SudokuBoardProps {
  board: number[][];
  conflicts: boolean[][];
  onChange: (row: number, col: number, value: number | "") => void;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  conflicts,
  onChange,
}) => {
  return (
    <div className="sudoku-board">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isConflict = conflicts[rowIndex][colIndex];
          const isThickRight = (colIndex + 1) % 3 === 0 && colIndex !== 8;
          const isThickBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

          return (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`
                sudoku-cell
                ${isConflict ? "conflict" : ""}
                ${isThickRight ? "thick-right" : ""}
                ${isThickBottom ? "thick-bottom" : ""}
              `}
              value={cell === 0 ? "" : cell}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  onChange(rowIndex, colIndex, "");
                } else if (/^[1-9]$/.test(val)) {
                  onChange(rowIndex, colIndex, parseInt(val));
                }
              }}
            />
          );
        })
      )}
    </div>
  );
};
