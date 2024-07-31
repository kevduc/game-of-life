import { useEffect, useRef, useState } from 'react';
import { golRule, update, type Cell, type Grid } from './gol-logic';
import { isTouchDevice } from './utils/is-touch-device';

type Brush = Cell | undefined;

const MouseButtonsBrush = {
  0: 1,
  2: 0, // right click
} as const satisfies Record<number, Cell>;

const isSupportedMouseButton = (mouseButton: number): mouseButton is keyof typeof MouseButtonsBrush =>
  Object.hasOwn(MouseButtonsBrush, mouseButton);

const BrushCursors = { undefined: 'pointer', 0: 'crosshair', 1: 'cell' } as const satisfies Record<
  `${Brush}`,
  React.CSSProperties['cursor']
>;

const GRID_SIZE = 15;
const emptyGrid: Grid = [...Array(GRID_SIZE)].map(() => Array(GRID_SIZE).fill(0));
const generateRandomGrid = (): Grid => emptyGrid.map((row) => row.map(() => (Math.random() > 0.5 ? 1 : 0)));

const UPDATE_RATE = 10; // updates / second

export function App() {
  const [grid, setGrid] = useState(generateRandomGrid);
  const [isPaused, setIsPaused] = useState(false);
  const [brush, setBrush] = useState<Brush>(undefined);

  const brushRef = useRef(brush);
  brushRef.current = brush;

  useEffect(() => {
    if (isPaused) return;

    const id = setInterval(() => {
      if (brushRef.current === undefined) setGrid((grid) => update(grid, golRule));
    }, 1000 / UPDATE_RATE);

    return () => clearInterval(id);
  }, [isPaused]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setIsPaused((isPaused) => !isPaused);
      } else if (event.key === 'c' || event.code === 'Backspace' || event.code === 'Delete') {
        setGrid(() => emptyGrid);
      } else if (event.key === 'r') {
        setGrid(() => generateRandomGrid());
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleContextMenu = (event: Event) => {
      if (isTouchDevice()) {
        setIsPaused((isPaused) => !isPaused);
      }

      event.preventDefault();
      return false;
    };
    const handlePointerUp = (event: PointerEvent) => {
      if (!isSupportedMouseButton(event.button)) return;
      setBrush(undefined);
    };
    const handlePointerLeave = handlePointerUp;

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <main
      style={{
        height: '100%',
      }}>
      <div
        style={{
          position: 'relative',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0]?.length ?? 0}, 1fr)`,
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          borderWidth: '1vmin',
          borderStyle: 'solid',
          borderColor: isPaused ? 'red' : 'transparent',
          maxHeight: '100%',
          aspectRatio: 1,
          marginInline: 'auto',
          boxSizing: 'border-box',
          cursor: BrushCursors[`${brush}`],
          WebkitTapHighlightColor: 'transparent',
        }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              onPointerDown={(event) => {
                let newBrush: Brush;

                if (isTouchDevice()) {
                  newBrush = cell === 0 ? 1 : 0;
                } else {
                  const mouseButton = event.button;
                  if (!isSupportedMouseButton(mouseButton)) return;
                  newBrush = MouseButtonsBrush[mouseButton];
                }

                setBrush(newBrush);
                if (cell !== newBrush)
                  setGrid((grid) => grid.map((r, ri) => r.map((c, ci) => (ri === rowIndex && ci == colIndex ? newBrush : c))));
              }}
              onPointerEnter={() => {
                if (brush !== undefined && cell !== brush)
                  setGrid((grid) => grid.map((r, ri) => r.map((c, ci) => (ri === rowIndex && ci == colIndex ? brush : c))));
              }}
              onPointerOver={(event) => {
                if (brush !== undefined) console.log({ rowIndex, colIndex, cell, event });
              }}
              key={`${rowIndex},${colIndex}`}
              style={{ height: '100%', backgroundColor: cell === 1 ? 'white' : 'black' }}></div>
          ))
        )}
      </div>
    </main>
  );
}
