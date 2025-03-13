import { randomColor } from "../utils";
import { ColumnData } from "./Column";
import { Data } from "./Data";
import { RowColData } from "./RowCol";
import { customAlphabet } from 'nanoid';
import { WidthHeightData } from "./WidthHeight";

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5);

export type TableData = {
  name: string,
  rowCol: RowColData,
  columns: ColumnData[],
  widthHeight: WidthHeightData | undefined,
  color: string | undefined,
}

export class Table extends Data<TableData> {

  public addColumnAfter(index: number) {
    this.data.columns.splice(index + 1, 0, {
      keyType: '',
      name: nanoid(5),
      columnType: 'bigint',
    })
    this.data.widthHeight = this.getWidthHeight();
  }

  public removeColumn(index: number) {
    if (
      this.data.columns.length <= 1 ||
      this.data.columns[index].keyType === 'PK'
    ) {
      return;
    }
    this.data.columns.splice(index, 1);
    this.data.widthHeight = this.getWidthHeight();
  }

  private getWidthHeight(): WidthHeightData {
    return {
      width: 35,
      height: 4 + 3 * this.data.columns.length,
    }
  }

  private getSanitizeColumns(columns: ColumnData[]): ColumnData[] {
    if (columns.length === 0) {
      columns.push({
        keyType: 'PK',
        name: `${this.data.name}_id`,
        columnType: 'bigint',
      })
    }
    return columns;
  }

  constructor(data: TableData) {
    super(data);
    //
    this.data.columns = this.getSanitizeColumns(this.data.columns)
    this.data.widthHeight = this.getWidthHeight();
    this.data.color = randomColor();
  }
}