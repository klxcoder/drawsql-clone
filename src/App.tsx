import { useState } from 'react';
import styles from './App.module.scss';
import GridView from './components/GridView';
import { Table } from './models/Table';

function App() {
  const [tables] = useState<Table[]>([
    new Table({
      title: 'table1',
      rect: {
        col: 1,
        row: 1,
        width: 2,
        height: 2,
      }
    }),
    new Table({
      title: 'table2',
      rect: {
        col: 5,
        row: 6,
        width: 3,
        height: 3,
      }
    }),
  ]);
  return (
    <div className={styles.app}>
      <GridView tables={tables} />
    </div>
  )
}

export default App
