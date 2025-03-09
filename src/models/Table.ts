import { nanoid } from "nanoid";
import { randomColor } from "../utils";
import { Column } from "./Column";
import { RowCol, RowColData } from "./RowCol";
import { WidthHeight, WidthHeightData } from "./WidthHeight";

export type TableData = {
  name: string,
  rowCol: RowColData,
  columns: ({
    keyType: string,
    name: string,
    columnType: string,
  })[],
  widthHeight: WidthHeightData,
  color: string,
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
      rowCol: this.rowCol.getData(),
      columns: this.columns,
      widthHeight: this.widthHeight.getData(),
      color: this.color,
    }
  };

  public addColumnAfter(index: number) {
    this.columns.splice(index + 1, 0, new Column({
      keyType: '',
      name: nanoid(5),
      columnType: 'bigint',
    }));
    this.widthHeight = this.getWidthHeight();
  }

  public removeColumn(index: number) {
    if (
      this.columns.length <= 1 ||
      this.columns[index].keyType === 'PK'
    ) {
      return;
    }
    this.columns.splice(index, 1);
    this.widthHeight = this.getWidthHeight();
  }

  private getWidthHeight(): WidthHeight {
    return new WidthHeight(35, 4 + 3 * this.columns.length)
  }

  private getSanitizeColumns(columns: Column[]): Column[] {
    if (columns.length === 0) {
      columns.push(new Column({
        keyType: 'PK',
        name: `${this.name}_id`,
        columnType: 'bigint',
      }));
    }
    return columns;
  }

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
    this.columns = this.getSanitizeColumns(columns);
    //
    this.widthHeight = this.getWidthHeight();
    this.color = randomColor();
  }
}