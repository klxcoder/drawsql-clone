import { Data } from "./Data";

export type ColumnData = {
  keyType: string,
  name: string,
  columnType: string,
}

export class Column extends Data<ColumnData> {
  public keyType: string = ''; // "PK", "FK", ""
  public name: string = '';
  public columnType: string = '';

  public getData(): ColumnData {
    return {
      keyType: this.keyType,
      name: this.name,
      columnType: this.columnType,
    }
  }

  public setData(data: ColumnData) {
    this.keyType = data.keyType;
    this.name = data.name;
    this.columnType = data.columnType;
  }

  constructor(columnData: ColumnData) {
    super();
    this.setData(columnData);
  }
}