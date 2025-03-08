import { RowCol } from "./RowCol";
import { Table } from "./Table";
import { XY } from "./XY";

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
  public updateMouseCell(xy: XY) {
    this.mouseCell.col = Math.round(xy.x / Grid.CELL_SIZE);
    this.mouseCell.row = Math.round(xy.y / Grid.CELL_SIZE);
    this.hoveredTable = this.getMostTopTable();
    if (!this.hoveredTable) {
      this.hoveredColumnIndex = -1;
      return;
    }
    {
      // Calculate this.hoveredColumn
      const index = Math.floor((this.mouseCell.row - this.hoveredTable.rowCol.row - 4) / 3);
      if (index >= 0 && index < this.hoveredTable.columns.length) {
        this.hoveredColumnIndex = index;
      } else {
        this.hoveredColumnIndex = -1;
      }
    }
  }

  // Call this function when mouse click on canvas
  public click() {
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
    // assign seleted column index
    this.selectedColumnIndex = this.hoveredColumnIndex;
  }

  constructor() {
  }
}
