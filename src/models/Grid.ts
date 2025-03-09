import { RowCol, RowColData } from "./RowCol";
import { Table, TableData } from "./Table";
import { XY } from "./XY";

export type GridData = {
  selectedTable: TableData | undefined,
  selectedColumnIndex: number,
  tables: TableData[],
  hoveredTable: TableData | undefined,
  hoveredColumnIndex: number,
  mouseCell: RowColData,
}

export class Grid {

  public static MAX_COLS = 90;

  public static MAX_ROWS = 70;

  public static CELL_SIZE = 10;

  public readonly tables: Table[] = [];

  public hoveredTable: Table | undefined;

  public selectedTable: Table | undefined;

  public hoveredColumnIndex: number = -1;

  public selectedColumnIndex: number = -1;

  public readonly mouseCell: RowCol = new RowCol(-1, -1);

  private readonly lastMouseCell: RowCol = new RowCol(-1, -1);

  private readonly lastTableRowCol: RowCol = new RowCol(-1, -1);

  public isDragging: boolean = false;

  public addTable(table: Table) {
    this.tables.push(table);
  }

  private getMostTopTable(): Table | undefined {
    for (const table of [...this.tables].reverse()) {
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
    this.hoveredTable = this.getMostTopTable();
    // 
    if (!this.hoveredTable) {
      this.hoveredColumnIndex = -1;
    } else {
      // Calculate this.hoveredColumnIndex
      const index = Math.floor((this.mouseCell.row - this.hoveredTable.rowCol.row - 4) / 3);
      if (index >= 0 && index < this.hoveredTable.columns.length) {
        this.hoveredColumnIndex = index;
      } else {
        this.hoveredColumnIndex = -1;
      }
    }
    if (this.isDragging && this.selectedTable) {
      // Handle table move
      this.selectedTable.rowCol.col = this.lastTableRowCol.col + this.mouseCell.col - this.lastMouseCell.col;
      this.selectedTable.rowCol.row = this.lastTableRowCol.row + this.mouseCell.row - this.lastMouseCell.row;
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
      if (this.tables[index].name === this.selectedTable.name) {
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
    this.lastTableRowCol.col = this.selectedTable.rowCol.col;
    this.lastTableRowCol.row = this.selectedTable.rowCol.row;
  }

  public getData(): GridData {
    return {
      selectedTable: this.selectedTable?.getData(),
      selectedColumnIndex: this.selectedColumnIndex,
      tables: this.tables.map(table => table.getData()),
      hoveredTable: this.hoveredTable?.getData(),
      hoveredColumnIndex: this.hoveredColumnIndex,
      mouseCell: this.mouseCell.getRowColData(),
    }
  }

  constructor() {
  }
}
