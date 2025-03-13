import {
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import styles from './Grid.module.scss';
import {
  drawDots,
  drawMouseCell,
  drawTables,
} from '../utils';
import { Grid, GridData } from '../models/Grid';

function GridView({
  grid,
  setGridData,
  drawTrigger,
}: {
  grid: Grid,
  setGridData: (gridData: GridData) => void,
  drawTrigger: number,
}) {
  console.log('Rendered GridView')

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bufferRef = useRef<HTMLCanvasElement | null>(null);

  const animationFrameId = useRef<number | null>(null);
  // Re-draw canvas if canvas is dirty
  const isDirty = useRef<boolean>(true);

  useEffect(() => {
    bufferRef.current = document.createElement("canvas");
    bufferRef.current.width = Grid.MAX_COLS * Grid.CELL_SIZE;
    bufferRef.current.height = Grid.MAX_ROWS * Grid.CELL_SIZE;
  }, []);

  const draw = useCallback(() => {
    if (!isDirty.current) return; // Only draw if dirty
    console.log('draw');
    isDirty.current = false; // Reset dirty flag after drawing
    //
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const buffer: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas || !buffer) return;
    //
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    const bufferCtx = buffer.getContext("2d");
    if (!ctx || !bufferCtx) return;
    // Draw everything on the buffer
    bufferCtx.textAlign = "center";
    bufferCtx.textBaseline = "middle";
    //
    bufferCtx.clearRect(0, 0, buffer.width, buffer.height);
    drawDots(bufferCtx);
    drawTables(
      bufferCtx,
      grid.tables,
      grid.hoveredTable,
      grid.selectedTable,
      grid.hoveredColumnIndex,
      grid.selectedColumnIndex,
    );
    drawMouseCell(bufferCtx, grid.mouseCell);
    // Copy the buffer to the main canvas in one step
    ctx.drawImage(buffer, 0, 0);
  }, [
    grid.hoveredColumnIndex,
    grid.hoveredTable,
    grid.selectedColumnIndex,
    grid.selectedTable,
    grid.tables,
    grid.mouseCell,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      grid.mouseMove({ x, y });
      // setGridData(grid.getData());
      isDirty.current = true;
    };

    const onMouseDown = () => {
      isDirty.current = true;
      grid.mouseDown();

      const animate = () => {
        draw();
        animationFrameId.current = requestAnimationFrame(animate);
      };
      animate();

      setGridData(grid.getData());
    }

    const onMouseUp = () => {
      grid.isDragging = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
        isDirty.current = true;
        draw(); //final draw.
      }
      setGridData(grid.getData());
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
    };
  }, [grid, setGridData, draw]);

  useEffect(() => {
    draw();
  }, [draw, drawTrigger]);

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

export default memo(GridView);
