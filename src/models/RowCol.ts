import { Data } from "./Data";

export type RowColData = {
  row: number,
  col: number
}

export class RowCol extends Data<RowColData> {
  public row: number;
  public col: number;

  public getData(): RowColData {
    return {
      row: this.row,
      col: this.col,
    }
  }

  public setData(data: RowColData): void {
    this.row = data.row;
    this.col = data.col;
  }

  constructor(row: number, col: number) {
    super();
    this.row = row;
    this.col = col;
  }
}