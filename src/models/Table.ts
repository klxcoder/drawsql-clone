import { randomColor } from "../utils";
import { Column } from "./Column";
import { Rect } from "./Rect";
import { RowCol } from "./RowCol";

export class Table {
  public name: string;
  public rect: Rect; // size
  public columns: Column[];
  public color: string;

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
      width: 30,
      height: 5 + 3 * columns.length,
    });
    this.columns = columns;
    this.rect.width = 30;
    this.color = randomColor();
  }
}