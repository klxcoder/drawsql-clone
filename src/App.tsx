import { useState } from 'react';
import styles from './App.module.scss';
import GridView from './components/GridView';
import { Table } from './models/Table';

function App() {
  const [tables] = useState<Table[]>([
  ]);
  return (
    <div className={styles.app}>
      <GridView tables={tables} />
    </div>
  )
}

export default App
