export type Cell = 0 | 1;
export type Grid = Cell[][];
type Rule = (cell: Cell, neighboringCells: number) => Cell;

const sum = (numbers: number[]) => numbers.reduce((sum, value) => sum + value, 0);

export const golRule: Rule = (cell, numberOfNeighbors) => {
  const nextState = ([0, 0, cell, 1, 0, 0, 0, 0, 0] as const)[numberOfNeighbors];
  if (nextState === undefined) throw new Error('undefined nextState');
  return nextState;
};

export const update = (grid: Grid, rule: Rule) => {
  return grid.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      const neighboringCells = [0, -1, 1]
        .flatMap((deltaRow) => [0, -1, 1].map((deltaCol) => grid[rowIndex + deltaRow]?.[colIndex + deltaCol] ?? 0))
        .slice(1); // this is to get rid of the current cell

      return rule(cell, sum(neighboringCells));
    })
  );
};
