import { randomColor } from "../utils";
import { Rect } from "./Rect";

export class Table {
  title: string;
  rect: Rect;
  color: string;
  constructor({
    title,
    rect,
  }: {
    title: string,
    rect: Rect,
  }) {
    this.title = title;
    this.rect = rect;
    this.color = randomColor();
  }
}