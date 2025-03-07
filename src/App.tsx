import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import GridView from './components/GridView';
import { Table } from './models/Table';
import { Grid } from './models/Gird';
import { Rect } from './models/Rect';
import { Column } from './models/Column';

function App() {
  const [grid] = useState<Grid>(new Grid());
  useEffect(() => {
    grid.addTable(new Table({
      name: 'student',
      rect: new Rect({
        col: 1,
        row: 1,
        width: 25,
        height: 10,
      }),
      columns: [
        new Column({
          keyType: 'PK',
          name: 'person_id',
          columnType: 'bigint',
        }),
        new Column({
          keyType: '',
          name: 'description',
          columnType: 'text',
        }),
      ],
    }));
    grid.addTable(new Table({
      name: 'notification',
      rect: new Rect({
        col: 30,
        row: 15,
        width: 20,
        height: 10,
      }),
      columns: [],
    }));
    grid.addTable(new Table({
      name: 'x',
      rect: new Rect({
        col: 35,
        row: 35,
        width: 5,
        height: 2, // Rect will enforce this height to 4, because 4 is minimal height
      }),
      columns: [],
    }));
    grid.addTable(new Table({
      name: 'overlap',
      rect: new Rect({
        col: 10,
        row: 8,
        width: 22,
        height: 12,
      }),
      columns: [],
    }));
  }, [grid]);
  return (
    <div className={styles.app}>
      <GridView grid={grid} />
    </div>
  )
}

export default App
