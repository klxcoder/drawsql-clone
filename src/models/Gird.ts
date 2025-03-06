import { RowCol } from "./RowCol";
import { Table } from "./Table";
import { XY } from "./XY";

export class Grid {

  public static MAX_COLS = 90;

  public static MAX_ROWS = 70;

  public static CELL_SIZE = 10;

  public readonly tables: Table[] = [];

  public readonly mouseCell: RowCol = {
    row: -1,
    col: -1,
  }

  public addTable(table: Table) {
    this.tables.push(table);
  }

  public updateMouseCell(xy: XY) {
    this.mouseCell.col = Math.round(xy.x / Grid.CELL_SIZE);
    this.mouseCell.row = Math.round(xy.y / Grid.CELL_SIZE);
    console.log('Updated mouseCell to ', this.mouseCell);
  }

  constructor() {
  }
}
