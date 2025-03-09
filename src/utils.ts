import { Column } from "./models/Column";
import { Grid } from "./models/Grid";
import { RowCol, RowColData } from "./models/RowCol";
import { Table, TableData } from "./models/Table";

export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

// Function to draw a rounded rectangle
const drawRoundedRect = ({
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

export const drawTables = (
  ctx: CanvasRenderingContext2D,
  tables: TableData[],
  hoveredTable: TableData | undefined,
  selectedTable: TableData | undefined,
  hoveredColumnIndex: number,
  selectedColumnIndex: number,
) => {

  const drawTableBackground1 = (table: TableData) => {
    ctx.fillStyle = table.color;
    drawRoundedRect({
      ctx,
      x: table.rowCol.col * Grid.CELL_SIZE,
      y: table.rowCol.row * Grid.CELL_SIZE,
      width: table.widthHeight.width * Grid.CELL_SIZE,
      height: table.widthHeight.height * Grid.CELL_SIZE,
      radius: Grid.CELL_SIZE / 2,
      shadowOffset: table === hoveredTable ? 5 : 1,
      stroke: table === selectedTable,
    });
  }

  const drawTableBackground2 = (table: TableData) => {
    ctx.fillStyle = 'ivory';
    drawRoundedRect({
      ctx,
      x: table.rowCol.col * Grid.CELL_SIZE,
      y: (table.rowCol.row + 1) * Grid.CELL_SIZE,
      width: table.widthHeight.width * Grid.CELL_SIZE,
      height: (table.widthHeight.height - 1) * Grid.CELL_SIZE,
      radius: Grid.CELL_SIZE / 2,
      shadowOffset: 1,
      stroke: false,
    });
  }

  const drawTableName = (table: TableData) => {
    // Draw the text centered inside the rectangle
    ctx.fillStyle = "black"; // Text color
    ctx.font = "bold 20px 'Lucida Console', monospace";
    ctx.fillText(
      table.name,
      (table.rowCol.col + table.widthHeight.width / 2) * Grid.CELL_SIZE,
      // Table name start at 2.5
      (table.rowCol.row + 2.5) * Grid.CELL_SIZE,
    );
    // Draw border below table name
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"; // Shadow color (black with 50% opacity)
    ctx.shadowBlur = 1; // Blur intensity
    ctx.shadowOffsetX = 1; // Shadow offset to the right
    ctx.shadowOffsetY = 1; // Shadow offset downward
    ctx.beginPath();
    // Shadow below table name start at 3.8
    ctx.moveTo(table.rowCol.col * Grid.CELL_SIZE, (table.rowCol.row + 3.8) * Grid.CELL_SIZE);
    ctx.lineTo((table.rowCol.col + table.widthHeight.width) * Grid.CELL_SIZE, (table.rowCol.row + 3.8) * Grid.CELL_SIZE);
    ctx.closePath();
    ctx.stroke();
  }

  const drawSelectedColumn = (table: TableData) => {
    ctx.fillStyle = "antiquewhite";
    drawRoundedRect({
      ctx,
      x: table.rowCol.col * Grid.CELL_SIZE,
      y: (table.rowCol.row + 4 + selectedColumnIndex * 3) * Grid.CELL_SIZE,
      width: table.widthHeight.width * Grid.CELL_SIZE,
      height: 3 * Grid.CELL_SIZE,
      radius: Grid.CELL_SIZE / 2,
      shadowOffset: 1,
      stroke: false,
    });
  }

  const drawTableColumns = (
    ctx: CanvasRenderingContext2D,
    table: TableData,
    hoveredTable: TableData | undefined,
    hoveredColumnIndex: number,
  ) => {

    const drawHoveredColumn = () => {
      if (table === hoveredTable) {
        if (hoveredColumnIndex !== -1) {
          ctx.fillStyle = "antiquewhite";
          drawRoundedRect({
            ctx,
            x: table.rowCol.col * Grid.CELL_SIZE,
            y: (table.rowCol.row + 4 + hoveredColumnIndex * 3) * Grid.CELL_SIZE,
            width: table.widthHeight.width * Grid.CELL_SIZE,
            height: 3 * Grid.CELL_SIZE,
            radius: Grid.CELL_SIZE / 2,
            shadowOffset: 1,
            stroke: false,
          });
        }
      }
    }

    const drawText = () => {
      ctx.fillStyle = "black";

      table.columns.forEach((column, index) => {
        ctx.fillText(
          `${column.keyType.padEnd(2, ' ')} | ${column.name.padEnd(25 - column.columnType.length, ' ')} ${column.columnType}`,
          (table.rowCol.col + table.widthHeight.width / 2) * Grid.CELL_SIZE,
          (table.rowCol.row + 5.5 + 3 * index) * Grid.CELL_SIZE,
        );
      });
    }
    ctx.font = "18px 'Lucida Console', monospace";
    drawHoveredColumn();
    drawText();
  }

  tables.forEach(table => {
    drawTableBackground1(table);
    drawTableBackground2(table);
    drawTableName(table);
    if (table.name === selectedTable?.name && selectedColumnIndex !== -1) {
      drawSelectedColumn(table);
    }
    drawTableColumns(ctx, table, hoveredTable, hoveredColumnIndex);
  });
};

export const drawMouseCell = (ctx: CanvasRenderingContext2D, mouseCell: RowColData) => {
  const { col, row } = mouseCell;
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
}

export const getInitialGrid: () => Grid = () => {
  const grid = new Grid();
  grid.addTable(new Table({
    name: 'student',
    rowCol: new RowCol(1, 1),
    columns: [
      new Column({
        keyType: 'PK',
        name: 'person_id',
        columnType: 'bigint',
      }),
      new Column({
        keyType: '',
        name: 'description',
        columnType: 'text',
      }),
    ],
  }));
  grid.addTable(new Table({
    name: 'notification',
    rowCol: new RowCol(30, 15),
    columns: [
      new Column({
        keyType: 'PK',
        name: 'notification_id',
        columnType: 'bigint',
      }),
      new Column({
        keyType: 'FK',
        name: 'person_id',
        columnType: 'bigint',
      }),
      new Column({
        keyType: '',
        name: 'content',
        columnType: 'text',
      }),
      new Column({
        keyType: '',
        name: 'created_at',
        columnType: 'timestamp',
      }),
    ],
  }));
  grid.addTable(new Table({
    name: 'x',
    rowCol: new RowCol(35, 35),
    columns: [],
  }));
  grid.addTable(new Table({
    name: 'overlap',
    rowCol: new RowCol(10, 8),
    columns: [],
  }));
  return grid;
}