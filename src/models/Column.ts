import { Data } from "./Data";

export type ColumnData = {
  keyType: string, // "PK", "FK", ""
  name: string,
  columnType: string,
}

export class Column extends Data<ColumnData> { }