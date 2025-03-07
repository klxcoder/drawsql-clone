export class Rect {
  public col: number;
  public row: number;
  public width: number;
  public height: number;

  constructor({
    col,
    row,
    width,
    height,
  }: {
    col: number,
    row: number,
    width: number,
    height: number,
  }) {
    this.col = col;
    this.row = row;
    this.width = width;
    this.height = height;
  }
}
