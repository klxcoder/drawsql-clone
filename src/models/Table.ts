import { randomColor } from "../utils";
import { Column } from "./Column";
import { RowCol, RowColData } from "./RowCol";
import { WidthHeight } from "./WidthHeight";

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
  public rowCol: RowCol;
  public columns: Column[];
  //
  public widthHeight: WidthHeight;
  public color: string;

  public getData: () => TableData = () => {
    return {
      name: this.name,
      rowCol: this.rowCol.getRowColData(),
      columns: this.columns,
    }
  };

  constructor({
    name,
    rowCol,
    columns,
  }: {
    name: string,
    rowCol: RowCol,
    columns: Column[],
  }) {
    //
    this.name = name;
    this.rowCol = rowCol;
    this.columns = columns;
    //
    this.widthHeight = new WidthHeight(35, 4 + 3 * columns.length);
    this.color = randomColor();
  }
}