import { Data } from "./Data";
import { RowColData } from "./RowCol";
import { Table, TableData } from "./Table";
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

  public readonly tables: Table[] = [];

  public hoveredTable: Table | undefined;

  public selectedTable: Table | undefined;

  public hoveredColumnIndex: number = -1;

  public selectedColumnIndex: number = -1;

  public readonly mouseCell: RowColData = { row: -1, col: -1 };

  private readonly lastMouseCell: RowColData = { row: -1, col: -1 };

  private readonly lastTableRowCol: RowColData = { row: -1, col: -1 };

  public isDragging: boolean = false;

  public addTable(tableData: TableData): Table {
    const table: Table = new Table(tableData)
    this.tables.push(table);
    return table
  }

  public removeTable(tableName: string) {
    const index: number = this.tables.findIndex(t => t.data.name === tableName);
    if (index === -1) return;
    const table: Table = this.tables[index];
    if (table === this.hoveredTable) {
      this.hoveredTable = undefined;
      this.hoveredColumnIndex = -1;
    }
    if (table === this.selectedTable) {
      this.selectedTable = undefined;
      this.selectedColumnIndex = -1;
    }
    this.tables.splice(index, 1);
  }

  private getMostTopTable(): Table | undefined {
    for (const table of [...this.tables].reverse()) {
      if (
        this.mouseCell.col >= table.data.rowCol.col &&
        this.mouseCell.col < table.data.rowCol.col + table.data.widthHeight.width &&
        this.mouseCell.row >= table.data.rowCol.row &&
        this.mouseCell.row < table.data.rowCol.row + table.data.widthHeight.height
      ) {
        return table;
      }
    }
  }

  // Call this function when mouse move on canvas
  public mouseMove(xy: XY) {
    this.mouseCell.col = Math.round(xy.x / Grid.CELL_SIZE);
    this.mouseCell.row = Math.round(xy.y / Grid.CELL_SIZE);
    this.hoveredTable = this.getMostTopTable();
    // 
    if (!this.hoveredTable) {
      this.hoveredColumnIndex = -1;
    } else {
      // Calculate this.hoveredColumnIndex
      const index = Math.floor((this.mouseCell.row - this.hoveredTable.data.rowCol.row - 4) / 3);
      if (index >= 0 && index < this.hoveredTable.data.columns.length) {
        this.hoveredColumnIndex = index;
      } else {
        this.hoveredColumnIndex = -1;
      }
    }
    if (this.isDragging && this.selectedTable) {
      // Handle table move
      this.selectedTable.data.rowCol.col = this.lastTableRowCol.col + this.mouseCell.col - this.lastMouseCell.col;
      this.selectedTable.data.rowCol.row = this.lastTableRowCol.row + this.mouseCell.row - this.lastMouseCell.row;
    }
  }

  public mouseDown() {
    this.selectedTable = this.getMostTopTable();
    if (!this.selectedTable) {
      this.selectedColumnIndex = -1;
      return;
    }
    // Bubble selected table on top
    for (let index = 0; index < this.tables.length; index++) {
      if (this.tables[index].data.name === this.selectedTable.data.name) {
        this.tables.splice(index, 1);
        this.tables.push(this.selectedTable);
      }
    }
    // save seleted column index
    this.selectedColumnIndex = this.hoveredColumnIndex;
    this.isDragging = true;
    // save lastMouseCell
    this.lastMouseCell.col = this.mouseCell.col;
    this.lastMouseCell.row = this.mouseCell.row;
    // save lastTableRowCol
    this.lastTableRowCol.col = this.selectedTable.data.rowCol.col;
    this.lastTableRowCol.row = this.selectedTable.data.rowCol.row;
  }
}
