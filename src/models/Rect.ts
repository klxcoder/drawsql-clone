export class Rect {
  col: number;
  row: number;
  width: number;
  private _height: number;

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
    this._height = Math.max(4, height); // Ensure height is at least 4
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = Math.max(4, value); // Enforce constraint
  }
}
