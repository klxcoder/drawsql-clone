import classNames from 'classnames';
import styles from './TableForm.module.scss';
import { GridData } from '../models/Grid';
import { download } from '../utils';

function TableForm({
  gridData,
  onChangeTableName,
  onChangeColumnKeyType,
  onChangeColumnName,
  onChangeColumnType,
  onSelectColumnIndex,
  onAddColumnAfter,
  onRemoveColumn,
  onRemoveTable,
  onAddTable,
  onImport,
}: {
  gridData: GridData,
  onChangeTableName: (newName: string) => void,
  onChangeColumnKeyType: (columnName: string, newKeyType: string) => void,
  onChangeColumnName: (columnName: string, newName: string) => void,
  onChangeColumnType: (columnName: string, newType: string) => void,
  onSelectColumnIndex: (index: number) => void,
  onAddColumnAfter: (index: number) => void,
  onRemoveColumn: (index: number) => void,
  onRemoveTable: () => void,
  onAddTable: () => void,
  onImport: () => void,
}) {
  console.log('Rendered TableForm')
  return (
    <div className={styles.tableForm}>
      {gridData.selectedTable ? <div className={styles.selectedTable}>
        <div className={styles.tableName}>
          <input
            placeholder='table1'
            value={gridData.selectedTable.name}
            onChange={(e) => onChangeTableName(e.target.value)}
            onClick={() => onSelectColumnIndex(-1)}
          />
          <button
            title='Remove table'
            className={styles.btnRemoveTable}
            onClick={() => onRemoveTable()}
          >-</button>
        </div>
        <div className={styles.columns}>
          {gridData.selectedTable.columns.map((column, index, columns) => (
            <div
              className={styles.column}
              key={index}
              onFocus={() => onSelectColumnIndex(index)}
              onClick={() => onSelectColumnIndex(index)}
            >
              <input
                className={classNames(
                  styles.keyType,
                  gridData.selectedColumnIndex === index ? styles.selected : '',
                )}
                value={column.keyType}
                onChange={(e) => onChangeColumnKeyType(column.name, e.target.value)}
              />
              <input
                className={classNames(
                  styles.columnName,
                  gridData.selectedColumnIndex === index ? styles.selected : '',
                )}
                value={column.name}
                onChange={(e) => onChangeColumnName(column.name, e.target.value)}
              />
              <input
                className={classNames(
                  styles.columnType,
                  gridData.selectedColumnIndex === index ? styles.selected : '',
                )}
                value={column.columnType}
                onChange={(e) => onChangeColumnType(column.name, e.target.value)}
              />
              <button
                title='Add column'
                className={styles.btnAddColumn}
                onClick={() => onAddColumnAfter(index)}
              >+</button>
              <button
                title='Remove column'
                className={styles.btnRemoveColumn}
                onClick={() => onRemoveColumn(index)}
                disabled={columns.length === 1 || column.keyType === 'PK'}
              >-</button>
            </div>
          ))}
        </div>
      </div> : <div className={styles.buttonsLayout}>
        <div className={styles.top}>
          <button
            className={styles.btnAddTable}
            onClick={() => onAddTable()}
          >Add table</button>
        </div>
        <div className={styles.bottom}>
          <button
            title='Export ERD data'
            className={styles.btnExport}
            onClick={() => {
              download<GridData>(gridData);
            }}
          >Export</button>
          <button
            title='Import ERD data'
            className={styles.btnImport}
            onClick={() => onImport()}
          >Import</button>
        </div>
      </div>}
    </div>
  )
}

export default TableForm