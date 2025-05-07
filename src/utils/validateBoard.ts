export type ConflictMap = boolean[][];

export function validateBoard(board: number[][]): ConflictMap {
  const conflicts: ConflictMap = Array(9).fill(null).map(() => Array(9).fill(false));

  const seenRows = Array(9).fill(null).map(() => new Set<number>());
  const seenCols = Array(9).fill(null).map(() => new Set<number>());
  const seenBoxes = Array(9).fill(null).map(() => new Set<number>());

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = board[row][col];
      if (val === 0) continue;

      const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

      const isConflict =
        seenRows[row].has(val) ||
        seenCols[col].has(val) ||
        seenBoxes[boxIndex].has(val);

      if (isConflict) {
        conflicts[row][col] = true;
      }

      seenRows[row].add(val);
      seenCols[col].add(val);
      seenBoxes[boxIndex].add(val);
    }
  }

  return conflicts;
}
