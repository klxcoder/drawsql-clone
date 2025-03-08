import { useState } from 'react';
import styles from './App.module.scss';
import { Grid } from './models/Grid';

import TableForm from './components/TableForm';
import { getInitialGrid } from './utils';
import GridView from './components/GridView';
import { Table, TableData } from './models/Table';
import { Column } from './models/Column';

function App() {
  const [grid] = useState<Grid>(getInitialGrid);
  const [tableData, setTableData] = useState<TableData>();
  return (
    <div className={styles.app}>
      {tableData && <TableForm
        table={tableData}
        onChangeTableName={(newName) => {
          newName = newName.trim();
          if (newName === '') return;
          {
            // If table `newName` already exist => exit
            const table: Table | undefined = grid.tables.find(t => t.name === newName);
            if (table) return;
          }
          {
            // Change the table name to `newName`
            const table: Table | undefined = grid.tables.find(t => t.name === tableData.name);
            if (!table) return;
            table.name = newName;
            // Update UI
            setTableData(table.getData());
          }
        }}
        onChangeColumnKeyType={(columnName, newKeyType) => {
          newKeyType = newKeyType.trim();
          const table: Table | undefined = grid.tables.find(t => t.name === tableData.name);
          if (!table) return;
          const column: Column | undefined = table.columns.find(c => c.name === columnName);
          if (!column) return;
          column.keyType = newKeyType.substring(0, 2).toUpperCase();
          // Update UI
          setTableData(table.getData());
        }}
        onChangeColumnName={(columnName, newName) => {
          newName = newName.trim();
          if (newName === '') return;
          const table: Table | undefined = grid.tables.find(t => t.name === tableData.name);
          if (!table) return;
          {
            // If column `newName` already exist => exit
            const column: Column | undefined = table.columns.find(c => c.name === newName);
            if (column) return;
          }
          {
            // Change the column name to `newName`
            const column: Column | undefined = table.columns.find(c => c.name === columnName);
            if (!column) return;
            column.name = newName;
          }
          {
            // Update UI
            setTableData(table.getData());
          }
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
