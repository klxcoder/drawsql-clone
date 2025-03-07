import { RowCol } from "./RowCol";
import { Table } from "./Table";
import { XY } from "./XY";

export class Grid {

  public static MAX_COLS = 90;

  public static MAX_ROWS = 70;

  public static CELL_SIZE = 10;

  public readonly tables: Table[] = [];

  public hoveredTable: Table | null = null;

  public selectedTable: Table | null = null;

  public readonly mouseCell: RowCol = {
    row: -1,
    col: -1,
  }

  public addTable(table: Table) {
    this.tables.push(table);
  }

  private updateHoveredTable() {
    for (const table of this.tables.reverse()) {
      if (
        this.mouseCell.col >= table.rect.col &&
        this.mouseCell.col < table.rect.col + table.rect.width &&
        this.mouseCell.row >= table.rect.row &&
        this.mouseCell.row < table.rect.row + table.rect.height
      ) {
        this.hoveredTable = table;
        return;
      }
    }
  }

  public updateMouseCell(xy: XY) {
    this.mouseCell.col = Math.round(xy.x / Grid.CELL_SIZE);
    this.mouseCell.row = Math.round(xy.y / Grid.CELL_SIZE);
    this.updateHoveredTable();
  }

  constructor() {
  }
}
