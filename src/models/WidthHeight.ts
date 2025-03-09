import { Data } from "./Data";

export type WidthHeightData = {
  width: number,
  height: number
}

export class WidthHeight extends Data<WidthHeightData> {
  public width: number;
  public height: number;

  public getData: () => WidthHeightData = () => {
    return {
      width: this.width,
      height: this.height,
    }
  }

  public setData(data: WidthHeightData) {
    this.width = data.width;
    this.height = data.height;
  }

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }
}