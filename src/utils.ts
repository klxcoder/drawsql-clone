import { Grid } from "./models/Grid";
import { LineData } from "./models/Line";
import { RowColData } from "./models/RowCol";
import { TableData } from "./models/Table";

export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

// Random integer between a and b (both inclusive
export function getRandomInt(a: number, b: number) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function download<T>(dataObj: T) {
  const jsonStr = JSON.stringify(dataObj, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "dataObj.json";
  link.click();

  URL.revokeObjectURL(link.href);
}

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

export const getLineSelectedHovered = ({
  selectedTable,
  hoveredTable,
  selectedColumnIndex,
  hoveredColumnIndex,
}: {
  selectedTable: TableData | undefined,
  hoveredTable: TableData | undefined,
  selectedColumnIndex: number,
  hoveredColumnIndex: number,
}): LineData | undefined => {
  if (!selectedTable) return
  if (!hoveredTable) return
  if (selectedColumnIndex === -1) return
  if (hoveredColumnIndex === -1) return
  if (selectedTable.name === hoveredTable.name && selectedColumnIndex === hoveredColumnIndex) return
  const line: LineData = {
    start: {
      table: selectedTable.name,
      column: selectedTable.columns[selectedColumnIndex].name,
    },
    end: {
      table: hoveredTable.name,
      column: hoveredTable.columns[hoveredColumnIndex].name,
    },
  }
  return line
}

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  tables: TableData[],
  line: LineData,
) => {

  const getColumnPoints = (table: TableData, index: number): RowColData[] => {
    return [
      {
        row: table.rowCol.row + 5 + 3 * index,
        col: table.rowCol.col - 1,
      },
      {
        row: table.rowCol.row + 5 + 3 * index,
        col: table.rowCol.col + table.widthHeight.width,
      }
    ]
  }

  const distance = (first: RowColData, second: RowColData): number => {
    const row2 = first.row - second.row
    const col2 = first.col - second.col
    return row2 * row2 + col2 * col2
  }

  const startTable: TableData | undefined = tables.find(t => t.name === line.start.table)
  const endTable: TableData | undefined = tables.find(t => t.name === line.end.table)
  if (!startTable || !endTable) return
  const startIndex: number = startTable.columns.findIndex(c => c.name === line.start.column)
  const endIndex: number = endTable.columns.findIndex(c => c.name === line.end.column)
  if (startIndex === -1 || endIndex === -1) return
  const startColumnPoints: RowColData[] = getColumnPoints(startTable, startIndex)
  const endColumnPoints: RowColData[] = getColumnPoints(endTable, endIndex)
  let minDistance = Number.POSITIVE_INFINITY
  let minI = 0;
  let minJ = 0;
  startColumnPoints.forEach((s, i) => {
    endColumnPoints.forEach((e, j) => {
      const d: number = distance(s, e)
      if (d < minDistance) {
        minDistance = d;
        minI = i;
        minJ = j;
      }
    })
  })

  const startPoint: RowColData = startColumnPoints[minI]
  const endPoint: RowColData = endColumnPoints[minJ]

  ctx.beginPath();
  ctx.moveTo(startPoint.col * Grid.CELL_SIZE, startPoint.row * Grid.CELL_SIZE);
  startPoint.col += minI === 0 ? -2 : 2
  endPoint.col += minJ === 0 ? -2 : 2
  ctx.lineTo(startPoint.col * Grid.CELL_SIZE, startPoint.row * Grid.CELL_SIZE);
  ctx.lineTo(endPoint.col * Grid.CELL_SIZE, endPoint.row * Grid.CELL_SIZE);
  endPoint.col += minJ === 0 ? 2 : -2
  ctx.lineTo(endPoint.col * Grid.CELL_SIZE, endPoint.row * Grid.CELL_SIZE);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export const drawLines = (
  ctx: CanvasRenderingContext2D,
  tables: TableData[],
  lines: LineData[],
) => {
  lines.forEach(line => drawLine(ctx, tables, line))
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

    const drawDots = () => {
      ctx.fillStyle = "blue";

      table.columns.forEach((_, index) => {
        ctx.fillRect(
          (table.rowCol.col - 1) * Grid.CELL_SIZE,
          (table.rowCol.row + 5 + 3 * index) * Grid.CELL_SIZE,
          8,
          8,
        );
        ctx.fillRect(
          (table.rowCol.col + table.widthHeight.width) * Grid.CELL_SIZE,
          (table.rowCol.row + 5 + 3 * index) * Grid.CELL_SIZE,
          8,
          8,
        );
      });
    }

    ctx.font = "18px 'Lucida Console', monospace";
    drawHoveredColumn();
    drawText();
    if (table.name === selectedTable?.name) {
      drawDots();
    }
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
  const grid: Grid = new Grid({
    selectedTable: undefined,
    selectedColumnIndex: -1,
    tables: [
      {
        "name": "student",
        "rowCol": {
          "row": 1,
          "col": 1
        },
        "columns": [
          {
            "keyType": "PK",
            "name": "person_id",
            "columnType": "bigint"
          },
          {
            "keyType": "",
            "name": "description",
            "columnType": "text"
          }
        ],
        "widthHeight": {
          "width": 35,
          "height": 10
        },
        "color": "#a968d5"
      },
      {
        "name": "notification",
        "rowCol": {
          "row": 30,
          "col": 15
        },
        "columns": [
          {
            "keyType": "PK",
            "name": "notification_id",
            "columnType": "bigint"
          },
          {
            "keyType": "FK",
            "name": "person_id",
            "columnType": "bigint"
          },
          {
            "keyType": "",
            "name": "content",
            "columnType": "text"
          },
          {
            "keyType": "",
            "name": "created_at",
            "columnType": "timestamp"
          }
        ],
        "widthHeight": {
          "width": 35,
          "height": 16
        },
        "color": "#39a4b9"
      },
      {
        "name": "x",
        "rowCol": {
          "row": 35,
          "col": 35
        },
        "columns": [
          {
            "keyType": "PK",
            "name": "x_id",
            "columnType": "bigint"
          }
        ],
        "widthHeight": {
          "width": 35,
          "height": 7
        },
        "color": "#76ade7"
      },
      {
        "name": "overlap",
        "rowCol": {
          "row": 15,
          "col": 47
        },
        "columns": [
          {
            "keyType": "PK",
            "name": "overlap_id",
            "columnType": "bigint"
          }
        ],
        "widthHeight": {
          "width": 35,
          "height": 7
        },
        "color": "#69fc9e"
      },
      {
        "name": "ndrbf",
        "rowCol": {
          "row": 67,
          "col": 49
        },
        "columns": [
          {
            "keyType": "PK",
            "name": "ndrbf_id",
            "columnType": "bigint"
          }
        ],
        "widthHeight": {
          "width": 35,
          "height": 7
        },
        "color": "#9a5e81"
      },
      {
        "name": "ojgbi",
        "rowCol": {
          "row": 2,
          "col": 45
        },
        "columns": [
          {
            "keyType": "PK",
            "name": "ojgbi_id",
            "columnType": "bigint"
          }
        ],
        "widthHeight": {
          "width": 35,
          "height": 7
        },
        "color": "#0e4d7f"
      },
      {
        "name": "bnxmj",
        "rowCol": {
          "row": 21,
          "col": 3
        },
        "columns": [
          {
            "keyType": "PK",
            "name": "bnxmj_id",
            "columnType": "bigint"
          }
        ],
        "widthHeight": {
          "width": 35,
          "height": 7
        },
        "color": "#177e8b"
      },
      {
        "name": "yes",
        "rowCol": {
          "row": 70,
          "col": 5
        },
        "columns": [
          {
            "keyType": "PK",
            "name": "chiuy_id",
            "columnType": "bigint"
          }
        ],
        "widthHeight": {
          "width": 35,
          "height": 7
        },
        "color": "#a7468f"
      }
    ],
    lines: [
      {
        start: {
          table: 'student',
          column: 'person_id',
        },
        end: {
          table: 'x',
          column: 'x_id',
        }
      }
    ],
    hoveredTable: undefined,
    hoveredColumnIndex: -1,
    canvasOffset: {
      top: 0,
      left: 0,
    }
  });
  return grid;
}