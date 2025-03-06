import { Rect } from "./Rect";

export class Table {
  title: string;
  rect: Rect;
  constructor({
    title,
    rect,
  }: {
    title: string,
    rect: Rect,
  }) {
    this.title = title;
    this.rect = rect;
  }
}