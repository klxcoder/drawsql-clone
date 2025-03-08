import { useState } from 'react';
import styles from './App.module.scss';
import GridView from './components/GridView';
import { Table } from './models/Table';
import { Grid } from './models/Grid';

import TableForm from './components/TableForm';
import { getInitialGrid } from './utils';

function App() {
  const [grid] = useState<Grid>(getInitialGrid);
  const [table, setTable] = useState<Table | undefined>();
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
