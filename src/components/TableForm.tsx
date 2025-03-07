import { useState } from 'react';
import styles from './TableForm.module.scss';
import { Table } from '../models/Table';

function TableForm() {
  const [table, setTable] = useState<Table>(new Table({
    name: '',
    rowCol: {
      row: 0,
      col: 0,
    },
    columns: [],
  }));
  return (
    <div className={styles.tableForm}>
      <div className={styles.tableName}>
        <input
          className={styles.tableName}
          placeholder='table1'
          value={table.name}
          onChange={(e) => setTable(new Table({
            name: e.target.value,
            rowCol: {
              row: table.rect.row,
              col: table.rect.col,
            },
            columns: table.columns,
          }))}
        />
      </div>
    </div>
  )
}

export default TableForm