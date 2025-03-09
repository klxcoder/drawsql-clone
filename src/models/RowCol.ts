export type RowColData = {
  row: number,
  col: number
}

export class RowCol {
  public row: number;
  public col: number;

  public getData: () => RowColData = () => {
    return {
      row: this.row,
      col: this.col,
    }
  }

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
}