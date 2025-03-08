import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import styles from './Grid.module.scss';
import {
  drawDots,
  drawMouseCell,
  drawTables,
} from '../utils';
import { Grid } from '../models/Grid';
import { TableData } from '../App';

function GridView({
  grid,
  setTableData,
}: {
  grid: Grid,
  setTableData: React.Dispatch<React.SetStateAction<TableData | undefined>>,
}) {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bufferRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    bufferRef.current = document.createElement("canvas");
    bufferRef.current.width = Grid.MAX_COLS * Grid.CELL_SIZE;
    bufferRef.current.height = Grid.MAX_ROWS * Grid.CELL_SIZE;
  }, []);

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
    grid.mouseCell,
    grid.tables,
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

    const onClick = () => {
      grid.click();
      setTableData(grid.selectedTable?.getTableData());
    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
    };
  }, [grid, setTableData]);

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
