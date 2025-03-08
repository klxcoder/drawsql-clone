import { randomColor } from "../utils";
import { Column } from "./Column";
import { Rect } from "./Rect";
import { RowCol, RowColData } from "./RowCol";

export type TableData = {
  name: string,
  rowCol: RowColData,
  columns: ({
    keyType: string,
    name: string,
    columnType: string,
  })[],
}

export class Table {
  public name: string;
  public rect: Rect; // size
  public columns: Column[];
  public color: string;

  public getTableData: () => TableData = () => ({
    name: this.name,
    rowCol: {
      row: this.rect.row,
      col: this.rect.col,
    },
    columns: this.columns,
  })

  constructor({
    name,
    rowCol,
    columns,
  }: {
    name: string,
    rowCol: RowCol,
    columns: Column[],
  }) {
    this.name = name;
    this.rect = new Rect({
      row: rowCol.row,
      col: rowCol.col,
      width: 35,
      height: 4 + 3 * columns.length,
    });
    this.columns = columns;
    this.color = randomColor();
  }
}