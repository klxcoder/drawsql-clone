import { useCallback, useEffect, useRef } from 'react';
import { Table } from '../models/Table';
import styles from './Grid.module.scss';
import {
  CELL_SIZE,
  MAX_TABLE_COLS,
  MAX_TABLE_ROWS,
} from '../constants';
import { drawRoundedRect } from '../utils';

function GridView({
  tables,
}: {
  tables: Table[],
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawDots = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    for (let col = 1; col < MAX_TABLE_COLS; col++) {
      for (let row = 1; row < MAX_TABLE_ROWS; row++) {
        ctx.beginPath();
        ctx.arc(col * CELL_SIZE, row * CELL_SIZE, 1, 0, Math.PI * 2);
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
      (table.rect.col + table.rect.width / 2) * CELL_SIZE,
      (table.rect.row + 2.5) * CELL_SIZE
    );
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"; // Shadow color (black with 50% opacity)
    ctx.shadowBlur = 1; // Blur intensity
    ctx.shadowOffsetX = 1; // Shadow offset to the right
    ctx.shadowOffsetY = 1; // Shadow offset downward
    ctx.beginPath();
    ctx.moveTo(table.rect.col * CELL_SIZE, (table.rect.row + 3.8) * CELL_SIZE);
    ctx.lineTo((table.rect.col + table.rect.width) * CELL_SIZE, (table.rect.row + 3.8) * CELL_SIZE);
    ctx.closePath();
    ctx.stroke();
  }, []);

  const drawTables = useCallback((ctx: CanvasRenderingContext2D) => {
    tables.forEach(table => {
      ctx.fillStyle = table.color;
      drawRoundedRect(
        ctx,
        table.rect.col * CELL_SIZE,
        table.rect.row * CELL_SIZE,
        table.rect.width * CELL_SIZE,
        table.rect.height * CELL_SIZE,
        CELL_SIZE / 2,
      )
      ctx.fillStyle = 'ivory';
      drawRoundedRect(
        ctx,
        table.rect.col * CELL_SIZE,
        (table.rect.row + 1) * CELL_SIZE,
        table.rect.width * CELL_SIZE,
        table.rect.height * CELL_SIZE,
        CELL_SIZE / 2,
      )
      drawTableName(ctx, table);
    });
  }, [tables, drawTableName]);

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
