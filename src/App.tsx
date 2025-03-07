import { useEffect, useState } from 'react';
import styles from './App.module.scss';
import GridView from './components/GridView';
import { Table } from './models/Table';
import { Grid } from './models/Grid';
import { Column } from './models/Column';
import { RowCol } from './models/RowCol';
import TableForm from './components/TableForm';

function App() {
  const [grid] = useState<Grid>(new Grid());
  const [table, setTable] = useState<Table | undefined>();
  useEffect(() => {
    grid.addTable(new Table({
      name: 'student',
      rowCol: new RowCol(1, 1),
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
      rowCol: new RowCol(30, 15),
      columns: [
        new Column({
          keyType: 'PK',
          name: 'notification_id',
          columnType: 'bigint',
        }),
        new Column({
          keyType: 'FK',
          name: 'person_id',
          columnType: 'bigint',
        }),
        new Column({
          keyType: '',
          name: 'content',
          columnType: 'text',
        }),
        new Column({
          keyType: '',
          name: 'created_at',
          columnType: 'timestamp',
        }),
      ],
    }));
    grid.addTable(new Table({
      name: 'x',
      rowCol: new RowCol(35, 35),
      columns: [],
    }));
    grid.addTable(new Table({
      name: 'overlap',
      rowCol: new RowCol(10, 8),
      columns: [],
    }));
  }, [grid]);
  return (
    <div className={styles.app}>
      {table && <TableForm
        table={table}
        onChangeTableName={(name) => console.log('Will change table name to ', name)}
      />}
      <GridView
        grid={grid}
        setTable={setTable}
      />
    </div>
  )
}

export default App
