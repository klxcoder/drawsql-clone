import { Data } from "./Data";
import { LineData } from "./Line";
import { RowColData } from "./RowCol";
import { Table, TableData } from "./Table";
import { XY } from "./XY";

export type GridData = {
  selectedTable: TableData | undefined,
  selectedColumnIndex: number,
  tables: TableData[],
  lines: LineData[],
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
    const table: Table = new Table(tableData)
    this.data.tables.push(table.data);
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
  public mouseMove(xy: XY): boolean { // return true if need to repaint
    this.mouseCell.col = Math.round(xy.x / Grid.CELL_SIZE);
    this.mouseCell.row = Math.round(xy.y / Grid.CELL_SIZE);
    let repaint: boolean = false;
    {
      //
      // Update this.data.hoveredTable
      //
      const _hoveredTable: TableData | undefined = this.getMostTopTable()
      if (this.data.hoveredTable?.name !== _hoveredTable?.name) {
        repaint = true
      }
      this.data.hoveredTable = _hoveredTable;
    }
    {
      //
      // Update this.data.hoveredColumnIndex
      //
      let _hoveredColumnIndex: number
      if (!this.data.hoveredTable) {
        _hoveredColumnIndex = -1
      } else {
        // Calculate this.data.hoveredColumnIndex
        const index = Math.floor((this.mouseCell.row - this.data.hoveredTable.rowCol.row - 4) / 3);
        if (index >= 0 && index < this.data.hoveredTable.columns.length) {
          _hoveredColumnIndex = index
        } else {
          _hoveredColumnIndex = -1
        }
      }
      if (this.data.hoveredColumnIndex !== _hoveredColumnIndex) {
        repaint = true
      }
      this.data.hoveredColumnIndex = _hoveredColumnIndex
    }
    //
    // Update this.data.selectedTable.rowCol
    //
    if (this.isDragging && this.data.selectedTable) {
      // Handle table move
      this.data.selectedTable.rowCol.col = this.lastTableRowCol.col + this.mouseCell.col - this.lastMouseCell.col;
      this.data.selectedTable.rowCol.row = this.lastTableRowCol.row + this.mouseCell.row - this.lastMouseCell.row;
    }
    return repaint;
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
