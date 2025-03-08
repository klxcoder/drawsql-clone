import classNames from 'classnames';
import styles from './TableForm.module.scss';
import { GridData } from '../models/Grid';

function TableForm({
  gridData,
  onChangeTableName,
  onChangeColumnKeyType,
  onChangeColumnName,
  onChangeColumnType,
  onSelectColumnIndex,
}: {
  gridData: GridData,
  onChangeTableName: (newName: string) => void,
  onChangeColumnKeyType: (columnName: string, newKeyType: string) => void,
  onChangeColumnName: (columnName: string, newName: string) => void,
  onChangeColumnType: (columnName: string, newType: string) => void,
  onSelectColumnIndex: (index: number) => void,
}) {
  return (
    gridData.selectedTable && <div className={styles.tableForm}>
      <div className={styles.tableName}>
        <input
          placeholder='table1'
          value={gridData.selectedTable.name}
          onChange={(e) => onChangeTableName(e.target.value)}
          onClick={() => onSelectColumnIndex(-1)}
        />
      </div>
      <div className={styles.columns}>
        {gridData.selectedTable.columns.map((column, index) => (
          <div
            className={styles.column}
            key={index}
          >
            <input
              className={classNames(
                styles.keyType,
                gridData.selectedColumnIndex === index ? styles.selected : '',
              )}
              value={column.keyType}
              onChange={(e) => onChangeColumnKeyType(column.name, e.target.value)}
              onClick={() => onSelectColumnIndex(index)}
            />
            <input
              className={classNames(
                styles.columnName,
                gridData.selectedColumnIndex === index ? styles.selected : '',
              )}
              value={column.name}
              onChange={(e) => onChangeColumnName(column.name, e.target.value)}
              onClick={() => onSelectColumnIndex(index)}
            />
            <input
              className={classNames(
                styles.columnType,
                gridData.selectedColumnIndex === index ? styles.selected : '',
              )}
              value={column.columnType}
              onChange={(e) => onChangeColumnType(column.name, e.target.value)}
              onClick={() => onSelectColumnIndex(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableForm