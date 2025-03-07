import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { Table } from '../models/Table';
import styles from './Grid.module.scss';
import { drawDots, drawRoundedRect, drawTables } from '../utils';
import { Grid } from '../models/Grid';

function GridView({
  grid,
}: {
  grid: Grid,
}) {
  const tables: Table[] = grid.tables;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bufferRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    bufferRef.current = document.createElement("canvas");
    bufferRef.current.width = Grid.MAX_COLS * Grid.CELL_SIZE;
    bufferRef.current.height = Grid.MAX_ROWS * Grid.CELL_SIZE;
  }, []);

  const drawMouseCell = useCallback((ctx: CanvasRenderingContext2D) => {
    const { col, row } = grid.mouseCell;
    ctx.fillStyle = "rgba(0, 0, 255, 0.15)";
    drawRoundedRect({
      ctx,
      x: col * Grid.CELL_SIZE,
      y: row * Grid.CELL_SIZE,
      width: Grid.CELL_SIZE,
      height: Grid.CELL_SIZE,
      radius: Grid.CELL_SIZE / 2,
      shadowOffset: 1,
      stroke: false,
    });
  }, [grid.mouseCell]);

  const draw = useCallback(() => {
    //
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const buffer: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas || !buffer) return;
    //
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    const bufferCtx = buffer.getContext("2d");
    if (!ctx || !bufferCtx) return;
    // Draw everything on the buffer
    bufferCtx.clearRect(0, 0, buffer.width, buffer.height);

    drawDots(bufferCtx);
    drawTables(bufferCtx, tables, grid.hoveredTable, grid.selectedTable, grid.hoveredColumnIndex, grid.selectedColumnIndex);
    drawMouseCell(bufferCtx);
    // Copy the buffer to the main canvas in one step
    ctx.drawImage(buffer, 0, 0);
  }, [
    drawMouseCell,
    grid.hoveredColumnIndex,
    grid.hoveredTable,
    grid.selectedColumnIndex,
    grid.selectedTable,
    tables,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      grid.updateMouseCell({ x, y });
    };

    const onClick = () => grid.click();

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, [grid]);

  useLayoutEffect(() => {
    let frameId: number;

    const animate = () => {
      draw();
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [draw]);


  return (
    <div className={styles.grid}>
      <canvas
        ref={canvasRef}
        width={Grid.MAX_COLS * Grid.CELL_SIZE}
        height={Grid.MAX_ROWS * Grid.CELL_SIZE}
      ></canvas>
    </div>
  )
}

export default GridView
