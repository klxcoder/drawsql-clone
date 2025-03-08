import { useState } from 'react';
import styles from './App.module.scss';
import { Grid } from './models/Grid';

import TableForm from './components/TableForm';
import { getInitialGrid } from './utils';
import GridView from './components/GridView';
import { Table, TableData } from './models/Table';

function App() {
  const [grid] = useState<Grid>(getInitialGrid);
  const [tableData, setTableData] = useState<TableData>();
  return (
    <div className={styles.app}>
      {tableData && <TableForm
        table={tableData}
        onChangeTableName={(name) => {
          const table: Table | undefined = grid.tables.find(t => t.name === tableData.name);
          if (!table) return;
          table.name = name;
          setTableData(table.getData());
        }}
      />}
      <GridView
        grid={grid}
        setTableData={setTableData}
      />
    </div>
  )
}

export default App
