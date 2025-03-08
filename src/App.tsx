import { useState } from 'react';
import styles from './App.module.scss';
import { Grid } from './models/Grid';

import TableForm from './components/TableForm';
import { getInitialGrid } from './utils';
import GridView from './components/GridView';

export type TableData = {
  name: string,
  row: number,
  col: number,
  columns: ({
    keyType: string,
    name: string,
    columnType: string,
  })[],
}

function App() {
  const [grid] = useState<Grid>(getInitialGrid);
  const [tableData, setTableData] = useState<TableData>();
  return (
    <div className={styles.app}>
      {tableData && <TableForm
        table={tableData}
        onChangeTableName={(name) => console.log('Will change table name to ', name)}
      />}
      <GridView
        grid={grid}
        setTableData={setTableData}
      />
    </div>
  )
}

export default App
