export type WidthHeightData = {
  width: number,
  height: number
}

export class WidthHeight {
  public width: number;
  public height: number;

  public getWidthHeightData: () => WidthHeightData = () => {
    return {
      width: this.width,
      height: this.width,
    }
  }

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}