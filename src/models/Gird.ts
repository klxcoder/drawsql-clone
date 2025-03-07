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

  public readonly mouseCell: RowCol = {
    row: -1,
    col: -1,
  }

  public addTable(table: Table) {
    this.tables.push(table);
  }

  private getMostTopTable(): Table | undefined {
    for (const table of [...this.tables].reverse()) {
      if (
        this.mouseCell.col >= table.rect.col &&
        this.mouseCell.col < table.rect.col + table.rect.width &&
        this.mouseCell.row >= table.rect.row &&
        this.mouseCell.row < table.rect.row + table.rect.height
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
  }

  // Call this function when mouse click on canvas
  public click() {
    this.selectedTable = this.getMostTopTable();
    if (!this.selectedTable) return;
    for (let index = 0; index < this.tables.length; index++) {
      if (this.tables[index].name === this.selectedTable.name) {
        const lastIndex: number = this.tables.length - 1;
        this.tables[index] = this.tables[lastIndex];
        this.tables[lastIndex] = this.selectedTable;
      }
    }
  }

  constructor() {
  }
}
