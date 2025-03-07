import { randomColor } from "../utils";
import { Column } from "./Column";
import { Rect } from "./Rect";

export class Table {
  public name: string;
  public rect: Rect; // size
  public columns: Column[];
  public color: string;

  constructor({
    name,
    rect,
    columns,
  }: {
    name: string,
    rect: Rect,
    columns: Column[],
  }) {
    this.name = name;
    this.rect = rect;
    this.columns = columns;
    this.rect.width = 30;
    this.rect.height = 6 + 3 * columns.length + 1;
    this.color = randomColor();
  }
}