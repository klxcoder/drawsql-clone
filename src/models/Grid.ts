import { Data } from "./Data";
import { RowColData } from "./RowCol";
import { TableData } from "./Table";
import { XY } from "./XY";

export type GridData = {
  selectedTable: TableData | undefined,
  selectedColumnIndex: number,
  tables: TableData[],
  hoveredTable: TableData | undefined,
  hoveredColumnIndex: number,
}

export class Grid extends Data<GridData> {

  public static MAX_COLS = 200;

  public static MAX_ROWS = 100;

  public static CELL_SIZE = 10;

  public readonly mouseCell: RowColData = { row: -1, col: -1 };

  private readonly lastMouseCell: RowColData = { row: -1, col: -1 };

  private readonly lastTableRowCol: RowColData = { row: -1, col: -1 };

  public isDragging: boolean = false;

  public addTable(tableData: TableData) {
    this.data.tables.push(tableData);
  }

  public removeTable(tableName: string) {
    const index: number = this.data.tables.findIndex(t => t.name === tableName);
    if (index === -1) return;
    const table: TableData = this.data.tables[index];
    if (table === this.data.hoveredTable) {
      this.data.hoveredTable = undefined;
      this.data.hoveredColumnIndex = -1;
    }
    if (table === this.data.selectedTable) {
      this.data.selectedTable = undefined;
      this.data.selectedColumnIndex = -1;
    }
    this.data.tables.splice(index, 1);
  }

  private getMostTopTable(): TableData | undefined {
    for (const table of [...this.data.tables].reverse()) {
      if (
        this.mouseCell.col >= table.rowCol.col &&
        this.mouseCell.col < table.rowCol.col + table.widthHeight.width &&
        this.mouseCell.row >= table.rowCol.row &&
        this.mouseCell.row < table.rowCol.row + table.widthHeight.height
      ) {
        return table;
      }
    }
  }

  // Call this function when mouse move on canvas
  public mouseMove(xy: XY) {
    this.mouseCell.col = Math.round(xy.x / Grid.CELL_SIZE);
    this.mouseCell.row = Math.round(xy.y / Grid.CELL_SIZE);
    this.data.hoveredTable = this.getMostTopTable();
    // 
    if (!this.data.hoveredTable) {
      this.data.hoveredColumnIndex = -1;
    } else {
      // Calculate this.data.hoveredColumnIndex
      const index = Math.floor((this.mouseCell.row - this.data.hoveredTable.rowCol.row - 4) / 3);
      if (index >= 0 && index < this.data.hoveredTable.columns.length) {
        this.data.hoveredColumnIndex = index;
      } else {
        this.data.hoveredColumnIndex = -1;
      }
    }
    if (this.isDragging && this.data.selectedTable) {
      // Handle table move
      this.data.selectedTable.rowCol.col = this.lastTableRowCol.col + this.mouseCell.col - this.lastMouseCell.col;
      this.data.selectedTable.rowCol.row = this.lastTableRowCol.row + this.mouseCell.row - this.lastMouseCell.row;
    }
  }

  public mouseDown() {
    this.data.selectedTable = this.getMostTopTable();
    if (!this.data.selectedTable) {
      this.data.selectedColumnIndex = -1;
      return;
    }
    // Bubble selected table on top
    for (let index = 0; index < this.data.tables.length; index++) {
      if (this.data.tables[index].name === this.data.selectedTable.name) {
        this.data.tables.splice(index, 1);
        this.data.tables.push(this.data.selectedTable);
      }
    }
    // save seleted column index
    this.data.selectedColumnIndex = this.data.hoveredColumnIndex;
    this.isDragging = true;
    // save lastMouseCell
    this.lastMouseCell.col = this.mouseCell.col;
    this.lastMouseCell.row = this.mouseCell.row;
    // save lastTableRowCol
    this.lastTableRowCol.col = this.data.selectedTable.rowCol.col;
    this.lastTableRowCol.row = this.data.selectedTable.rowCol.row;
  }
}
