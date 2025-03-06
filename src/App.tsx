import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import GridView from './components/GridView';
import { Table } from './models/Table';
import { Grid } from './models/Gird';

function App() {
  const [grid] = useState<Grid>(new Grid());
  useEffect(() => {
    grid.addTable(new Table({
      name: 'student',
      rect: {
        col: 1,
        row: 1,
        width: 15,
        height: 10,
      }
    }));
    grid.addTable(new Table({
      name: 'notification',
      rect: {
        col: 15,
        row: 15,
        width: 15,
        height: 10,
      }
    }));
  }, [grid]);
  return (
    <div className={styles.app}>
      <GridView grid={grid} />
    </div>
  )
}

export default App
