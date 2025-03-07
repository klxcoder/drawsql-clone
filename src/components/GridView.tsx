import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { Table } from '../models/Table';
import styles from './Grid.module.scss';
import { drawRoundedRect } from '../utils';
import { Grid } from '../models/Gird';

function GridView({
  grid,
}: {
  grid: Grid,
}) {
  const tables: Table[] = grid.tables;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawDots = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    for (let col = 1; col < Grid.MAX_COLS; col++) {
      for (let row = 1; row < Grid.MAX_ROWS; row++) {
        ctx.beginPath();
        ctx.arc(col * Grid.CELL_SIZE, row * Grid.CELL_SIZE, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const drawTableName = useCallback((ctx: CanvasRenderingContext2D, table: Table) => {
    // Draw the text centered inside the rectangle
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      table.name,
      (table.rect.col + table.rect.width / 2) * Grid.CELL_SIZE,
      (table.rect.row + 2.5) * Grid.CELL_SIZE
    );
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"; // Shadow color (black with 50% opacity)
    ctx.shadowBlur = 1; // Blur intensity
    ctx.shadowOffsetX = 1; // Shadow offset to the right
    ctx.shadowOffsetY = 1; // Shadow offset downward
    ctx.beginPath();
    ctx.moveTo(table.rect.col * Grid.CELL_SIZE, (table.rect.row + 3.8) * Grid.CELL_SIZE);
    ctx.lineTo((table.rect.col + table.rect.width) * Grid.CELL_SIZE, (table.rect.row + 3.8) * Grid.CELL_SIZE);
    ctx.closePath();
    ctx.stroke();
  }, []);

  const drawTables = useCallback((ctx: CanvasRenderingContext2D) => {
    tables.forEach(table => {
      ctx.fillStyle = table.color;
      drawRoundedRect(
        ctx,
        table.rect.col * Grid.CELL_SIZE,
        table.rect.row * Grid.CELL_SIZE,
        table.rect.width * Grid.CELL_SIZE,
        table.rect.height * Grid.CELL_SIZE,
        Grid.CELL_SIZE / 2,
      )
      ctx.fillStyle = 'ivory';
      drawRoundedRect(
        ctx,
        table.rect.col * Grid.CELL_SIZE,
        (table.rect.row + 1) * Grid.CELL_SIZE,
        table.rect.width * Grid.CELL_SIZE,
        table.rect.height * Grid.CELL_SIZE,
        Grid.CELL_SIZE / 2,
      )
      drawTableName(ctx, table);
    });
  }, [tables, drawTableName]);

  const drawMouseCell = useCallback((ctx: CanvasRenderingContext2D) => {
    const { col, row } = grid.mouseCell;
    ctx.fillStyle = "rgba(0, 0, 255, 0.15)";
    drawRoundedRect(
      ctx,
      col * Grid.CELL_SIZE,
      row * Grid.CELL_SIZE,
      Grid.CELL_SIZE,
      Grid.CELL_SIZE,
      Grid.CELL_SIZE / 2,
    );
  }, [grid.mouseCell]);

  const draw = useCallback(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots(ctx);
    drawTables(ctx);
    drawMouseCell(ctx);
  }, [drawTables, drawMouseCell]);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      grid.updateMouseCell({ x, y });
    })
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
