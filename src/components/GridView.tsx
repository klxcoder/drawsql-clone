import { useEffect, useRef } from 'react';
import { Table } from '../models/Table';
import styles from './Grid.module.scss';

function GridView({
  tables,
}: {
  tables: Table[],
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.log(tables);
  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (!ctx) return;
    // Draw something (example: a red rectangle)
    ctx.fillStyle = "red";
    ctx.fillRect(10, 10, 100, 100);
  }, []);
  return (
    <div className={styles.grid}>
      <canvas ref={canvasRef} width={500} height={500}></canvas>
    </div>
  )
}

export default GridView
