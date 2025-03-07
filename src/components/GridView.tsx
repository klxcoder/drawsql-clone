import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { Table } from '../models/Table';
import styles from './Grid.module.scss';
import { drawRoundedRect } from '../utils';
import { Grid } from '../models/Grid';

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

  const bufferRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    bufferRef.current = document.createElement("canvas");
    bufferRef.current.width = Grid.MAX_COLS * Grid.CELL_SIZE;
    bufferRef.current.height = Grid.MAX_ROWS * Grid.CELL_SIZE;
  }, []);

  const drawTableName = useCallback((ctx: CanvasRenderingContext2D, table: Table) => {
    // Draw the text centered inside the rectangle
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      table.name + grid.hoveredColumnIndex + grid.selectedColumnIndex,
      (table.rect.col + table.rect.width / 2) * Grid.CELL_SIZE,
      // Table name start at 2.5
      (table.rect.row + 2.5) * Grid.CELL_SIZE,
    );
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"; // Shadow color (black with 50% opacity)
    ctx.shadowBlur = 1; // Blur intensity
    ctx.shadowOffsetX = 1; // Shadow offset to the right
    ctx.shadowOffsetY = 1; // Shadow offset downward
    ctx.beginPath();
    // Shadow below table name start at 3.8
    ctx.moveTo(table.rect.col * Grid.CELL_SIZE, (table.rect.row + 3.8) * Grid.CELL_SIZE);
    ctx.lineTo((table.rect.col + table.rect.width) * Grid.CELL_SIZE, (table.rect.row + 3.8) * Grid.CELL_SIZE);
    ctx.closePath();
    ctx.stroke();
  }, [grid.hoveredColumnIndex, grid.selectedColumnIndex]);

  const drawTableColumns = useCallback((ctx: CanvasRenderingContext2D, table: Table) => {
    ctx.fillStyle = "antiquewhite";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (table === grid.hoveredTable) {
      const hoveredColumnIndex = Math.round((grid.mouseCell.row - table.rect.row - 4.5) / 3);
      if (hoveredColumnIndex >= 0 && hoveredColumnIndex < table.columns.length) {
        drawRoundedRect({
          ctx,
          x: table.rect.col * Grid.CELL_SIZE,
          y: (table.rect.row + 4.5 + hoveredColumnIndex * 3) * Grid.CELL_SIZE,
          width: table.rect.width * Grid.CELL_SIZE,
          height: 3 * Grid.CELL_SIZE,
          radius: Grid.CELL_SIZE / 2,
          shadowOffset: 1,
          stroke: false,
        });
      }
    }
    ctx.fillStyle = "black";
    table.columns.forEach((column, index) => {
      ctx.fillText(
        `${column.keyType} ${column.name} ${column.columnType}`,
        (table.rect.col + table.rect.width / 2) * Grid.CELL_SIZE,
        (table.rect.row + 6 + 3 * index) * Grid.CELL_SIZE,
      );
    });
  }, [grid.hoveredTable, grid.mouseCell.row]);

  const drawTables = useCallback((ctx: CanvasRenderingContext2D) => {
    tables.forEach(table => {
      ctx.fillStyle = table.color;
      // Draw table border
      drawRoundedRect({
        ctx,
        x: table.rect.col * Grid.CELL_SIZE,
        y: table.rect.row * Grid.CELL_SIZE,
        width: table.rect.width * Grid.CELL_SIZE,
        height: table.rect.height * Grid.CELL_SIZE,
        radius: Grid.CELL_SIZE / 2,
        shadowOffset: table === grid.hoveredTable ? 5 : 1,
        stroke: table === grid.selectedTable,
      });
      // draw line below table header
      ctx.fillStyle = 'ivory';
      drawRoundedRect({
        ctx,
        x: table.rect.col * Grid.CELL_SIZE,
        y: (table.rect.row + 1) * Grid.CELL_SIZE,
        width: table.rect.width * Grid.CELL_SIZE,
        height: (table.rect.height - 1) * Grid.CELL_SIZE,
        radius: Grid.CELL_SIZE / 2,
        shadowOffset: 1,
        stroke: false,
      });
      drawTableName(ctx, table);
      drawTableColumns(ctx, table);
    });
  }, [
    tables,
    drawTableName,
    grid.hoveredTable,
    grid.selectedTable,
    drawTableColumns,
  ]);

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
    drawTables(bufferCtx);
    drawMouseCell(bufferCtx);
    // Copy the buffer to the main canvas in one step
    ctx.drawImage(buffer, 0, 0);

  }, [drawTables, drawMouseCell]);

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
