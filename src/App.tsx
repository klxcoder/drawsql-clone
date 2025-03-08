import { useState } from 'react';
import styles from './App.module.scss';
import { Grid, GridData } from './models/Grid';

import TableForm from './components/TableForm';
import { getInitialGrid } from './utils';
import GridView from './components/GridView';
import { Table } from './models/Table';
import { Column } from './models/Column';

function App() {
  const [grid] = useState<Grid>(getInitialGrid);
  const [gridData, setGridData] = useState<GridData>();
  return (
    <div className={styles.app}>
      {gridData && <TableForm
        gridData={gridData}
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
            const table: Table | undefined = grid.tables.find(t => t.name === gridData.selectedTable?.name);
            if (!table) return;
            table.name = newName;
            // Update UI
            setGridData(grid.getData());
          }
        }}
        onChangeColumnKeyType={(columnName, newKeyType) => {
          newKeyType = newKeyType.trim();
          const table: Table | undefined = grid.tables.find(t => t.name === gridData.selectedTable?.name);
          if (!table) return;
          const column: Column | undefined = table.columns.find(c => c.name === columnName);
          if (!column) return;
          column.keyType = newKeyType.substring(0, 2).toUpperCase();
          // Update UI
          setGridData(grid.getData());
        }}
        onChangeColumnName={(columnName, newName) => {
          newName = newName.trim();
          if (newName === '') return;
          const table: Table | undefined = grid.tables.find(t => t.name === gridData.selectedTable?.name);
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
            setGridData(grid.getData());
          }
        }}
        onChangeColumnType={(columnName, newType) => {
          newType = newType.trim();
          if (newType === '') return;
          const table: Table | undefined = grid.tables.find(t => t.name === gridData.selectedTable?.name);
          if (!table) return;
          {
            // Change the column type to `newType`
            const column: Column | undefined = table.columns.find(c => c.name === columnName);
            if (!column) return;
            column.columnType = newType;
          }
          {
            // Update UI
            setGridData(grid.getData());
          }
        }}
      />}
      <GridView
        grid={grid}
        setGridData={setGridData}
      />
    </div>
  )
}

export default App
