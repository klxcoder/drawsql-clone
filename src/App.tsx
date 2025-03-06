import { useState } from 'react';
import styles from './App.module.scss';
import GridView from './components/GridView';
import { Table } from './models/Table';

function App() {
  const [tables] = useState<Table[]>([
    new Table({
      name: 'table1',
      rect: {
        col: 1,
        row: 1,
        width: 15,
        height: 10,
      }
    }),
    new Table({
      name: 'table2',
      rect: {
        col: 15,
        row: 15,
        width: 15,
        height: 10,
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
