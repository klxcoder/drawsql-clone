import { randomColor } from "../utils";
import { Rect } from "./Rect";

export class Table {
  name: string;
  rect: Rect;
  color: string;
  constructor({
    name,
    rect,
  }: {
    name: string,
    rect: Rect,
  }) {
    this.name = name;
    this.rect = rect;
    this.color = randomColor();
  }
}