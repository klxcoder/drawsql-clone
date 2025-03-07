import styles from './TableForm.module.scss';
import { Table } from '../models/Table';

function TableForm({
  table,
  onChangeTableName,
}: {
  table: Table,
  onChangeTableName: (newName: string) => void,
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
      {table.columns.map((column, index) => (
        <div key={index}>{column.name}</div>
      ))}
    </div>
  )
}

export default TableForm