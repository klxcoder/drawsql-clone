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
          className={styles.tableName}
          placeholder='table1'
          value={table.name}
          onChange={(e) => onChangeTableName(e.target.value)}
        />
      </div>
    </div>
  )
}

export default TableForm