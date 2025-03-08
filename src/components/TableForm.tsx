import { TableData } from '../models/Table';
import styles from './TableForm.module.scss';

function TableForm({
  table,
  onChangeTableName,
  onChangeColumnKeyType,
  onChangeColumnName,
  onChangeColumnType,
}: {
  table: TableData,
  onChangeTableName: (newName: string) => void,
  onChangeColumnKeyType: (columnName: string, newKeyType: string) => void,
  onChangeColumnName: (columnName: string, newName: string) => void,
  onChangeColumnType: (columnName: string, newType: string) => void,
}) {
  return (
    <div className={styles.tableForm}>
      <div className={styles.tableName}>
        <input
          placeholder='table1'
          value={table.name}
          onChange={(e) => onChangeTableName(e.target.value)}
        />
      </div>
      <div className={styles.columns}>
        {table.columns.map((column, index) => (
          <div
            className={styles.column}
            key={index}
          >
            <input
              className={styles.keyType}
              value={column.keyType}
              onChange={(e) => onChangeColumnKeyType(column.name, e.target.value)}
            />
            <input
              className={styles.columnName}
              value={column.name}
              onChange={(e) => onChangeColumnName(column.name, e.target.value)}
            />
            <input
              className={styles.columnType}
              value={column.columnType}
              onChange={(e) => onChangeColumnType(column.name, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableForm