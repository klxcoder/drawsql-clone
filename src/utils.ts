import { Grid } from "./models/Grid";
import { Table } from "./models/Table";

export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

// Function to draw a rounded rectangle
export const drawRoundedRect = ({
  ctx,
  x,
  y,
  width,
  height,
  radius,
  shadowOffset,
  stroke,
}: {
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  shadowOffset: number,
  stroke: boolean,
}) => {
  ctx.save();
  //
  ctx.strokeStyle = 'rgba(0,0,255, 0.5)';
  ctx.lineWidth = 5;
  // Set shadow properties
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)"; // Shadow color (black with 40% opacity)
  ctx.shadowBlur = 4 * shadowOffset; // Blur intensity
  ctx.shadowOffsetX = -shadowOffset; // Shadow offset to the right
  ctx.shadowOffsetY = shadowOffset; // Shadow offset downward
  // Draw the rounded rectangle
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arc(x + width - radius, y + radius, radius, -Math.PI / 2, 0);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2);
  ctx.lineTo(x + radius, y + height);
  ctx.arc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y + radius);
  ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2);
  ctx.closePath();
  ctx.fill();
  if (stroke) {
    ctx.stroke();
  }
  ctx.restore();
};

export const drawDots = (ctx: CanvasRenderingContext2D) => {
  ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
  for (let col = 1; col < Grid.MAX_COLS; col++) {
    for (let row = 1; row < Grid.MAX_ROWS; row++) {
      ctx.beginPath();
      ctx.arc(col * Grid.CELL_SIZE, row * Grid.CELL_SIZE, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export const drawTableName = (ctx: CanvasRenderingContext2D, table: Table) => {
  // Draw the text centered inside the rectangle
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    table.name,
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
}

export const drawTableColumns = (
  ctx: CanvasRenderingContext2D,
  table: Table,
  hoveredTable: Table | undefined,
  hoveredColumnIndex: number,
) => {
  ctx.fillStyle = "antiquewhite";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (table === hoveredTable) {
    if (hoveredColumnIndex !== -1) {
      drawRoundedRect({
        ctx,
        x: table.rect.col * Grid.CELL_SIZE,
        y: (table.rect.row + 4 + hoveredColumnIndex * 3) * Grid.CELL_SIZE,
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
      (table.rect.row + 5.5 + 3 * index) * Grid.CELL_SIZE,
    );
  });
}

export const drawTables = (
  ctx: CanvasRenderingContext2D,
  tables: Table[],
  hoveredTable: Table | undefined,
  selectedTable: Table | undefined,
  hoveredColumnIndex: number,
  selectedColumnIndex: number,
) => {
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
      shadowOffset: table === hoveredTable ? 5 : 1,
      stroke: table === selectedTable,
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
    if (table === selectedTable && selectedColumnIndex !== -1) {
      ctx.save();
      ctx.fillStyle = "antiquewhite";
      drawRoundedRect({
        ctx,
        x: table.rect.col * Grid.CELL_SIZE,
        y: (table.rect.row + 4 + selectedColumnIndex * 3) * Grid.CELL_SIZE,
        width: table.rect.width * Grid.CELL_SIZE,
        height: 3 * Grid.CELL_SIZE,
        radius: Grid.CELL_SIZE / 2,
        shadowOffset: 1,
        stroke: false,
      });
      ctx.restore();
    }
    drawTableColumns(ctx, table, hoveredTable, hoveredColumnIndex);
  });
};