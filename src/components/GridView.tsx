import { useCallback, useEffect, useRef } from 'react';
import { Table } from '../models/Table';
import styles from './Grid.module.scss';
import {
  CELL_SIZE,
  MAX_TABLE_COLS,
  MAX_TABLE_ROWS,
} from '../constants';

function GridView({
  tables,
}: {
  tables: Table[],
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawDots = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "red";
    for (let col = 1; col < MAX_TABLE_COLS; col++) {
      for (let row = 1; row < MAX_TABLE_ROWS; row++) {
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, 3, 3);
      }
    }
  }

  const drawTables = useCallback((ctx: CanvasRenderingContext2D) => {
    console.log(ctx);
    console.log(tables);
  }, [tables]);

  const draw = useCallback(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return;
    drawDots(ctx);
    drawTables(ctx);
  }, [drawTables]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className={styles.grid}>
      <canvas
        ref={canvasRef}
        width={MAX_TABLE_COLS * CELL_SIZE}
        height={MAX_TABLE_ROWS * CELL_SIZE}
      ></canvas>
    </div>
  )
}

export default GridView
