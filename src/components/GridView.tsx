import {
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import styles from './Grid.module.scss';
import {
  drawDots,
  drawLines,
  drawMouseCell,
  drawTables,
} from '../utils';
import { Grid, GridData } from '../models/Grid';

function GridView({
  grid,
  gridData,
  setGridData,
  isDirty,
}: {
  grid: Grid,
  gridData: GridData,
  setGridData: (gridData: GridData) => void,
  isDirty: React.RefObject<boolean>,
}) {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bufferRef = useRef<HTMLCanvasElement | null>(null);

  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    bufferRef.current = document.createElement("canvas");
    bufferRef.current.width = Grid.MAX_COLS * Grid.CELL_SIZE;
    bufferRef.current.height = Grid.MAX_ROWS * Grid.CELL_SIZE;
  }, []);

  const draw = useCallback(() => {
    if (gridData) { ; }
    if (!isDirty.current) return; // Only draw if dirty
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
    drawLines(ctx, grid.data.tables, grid.data.lines)
    drawTables(
      bufferCtx,
      grid.data.tables,
      grid.data.hoveredTable,
      grid.data.selectedTable,
      grid.data.hoveredColumnIndex,
      grid.data.selectedColumnIndex,
    );
    drawMouseCell(bufferCtx, grid.mouseCell);
    // Copy the buffer to the main canvas in one step
    ctx.drawImage(buffer, 0, 0);
  }, [
    grid.data.hoveredTable,
    grid.data.selectedTable,
    grid.data.tables,
    grid.data.lines,
    grid.data.hoveredColumnIndex,
    grid.mouseCell,
    grid.data.selectedColumnIndex,
    gridData,
    isDirty,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const repaint: boolean = grid.mouseMove({ x, y });
      if (repaint) {
        setGridData({ ...grid.data });
      }
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

      setGridData({ ...grid.data });
    }

    const onMouseUp = () => {
      grid.isDragging = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
        isDirty.current = true;
        draw(); //final draw.
      }
      setGridData({ ...grid.data });
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
  }, [grid, setGridData, draw, isDirty]);

  useEffect(() => {
    draw();
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

export default memo(GridView);
