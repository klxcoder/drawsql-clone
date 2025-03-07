export class Column {
  public keyType: string; // "PK", "FK", ""
  public name: string;
  public columnType: string;

  constructor({
    keyType,
    name,
    columnType,
  }: {
    keyType: string,
    name: string,
    columnType: string,
  }) {
    this.keyType = keyType;
    this.name = name;
    this.columnType = columnType;
  }
}