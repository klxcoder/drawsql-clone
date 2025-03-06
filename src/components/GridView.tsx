import { Table } from '../models/Table';
import styles from './Grid.module.scss';

function GridView({
  tables,
}: {
  tables: Table[],
}) {
  console.log(tables);
  return (
    <div className={styles.grid}>
      GridView
    </div>
  )
}

export default GridView
