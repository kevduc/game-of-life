import { useEffect, useState } from 'react';
import { golRule, update, type Grid } from './gol-logic';

const GRID_SIZE = 15;
const initialGrid: Grid = [...new Array(GRID_SIZE)].map(() =>
  [...new Array(GRID_SIZE)].map(() => Math.floor(Math.random() * 2))
);

const UPDATE_RATE = 10; // updates / second

export function App() {
  const [grid, setGrid] = useState(initialGrid);

  useEffect(() => {
    const id = setInterval(() => setGrid((grid) => update(grid, golRule)), 1000 / UPDATE_RATE);
    return () => clearInterval(id);
  }, []);

  return (
    <main style={{ display: 'grid', placeContent: 'center', height: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 50px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 50px)`,
        }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex},${colIndex}`}
              style={{ height: '100%', backgroundColor: cell === 1 ? 'white' : 'black' }}></div>
          ))
        )}
      </div>
    </main>
  );
}
