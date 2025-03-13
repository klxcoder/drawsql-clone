import { useCallback, useRef, useState } from 'react';
import styles from './App.module.scss';
import { Grid, GridData } from './models/Grid';

import TableForm from './components/TableForm';
import { getInitialGrid, getRandomInt } from './utils';
import GridView from './components/GridView';
import { Table } from './models/Table';
import { Column } from './models/Column';
import { RowCol } from './models/RowCol';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5);

function App() {
  console.log('Rendered App')
  const [grid] = useState<Grid>(getInitialGrid);
  const [gridData, setGridData] = useState<GridData>(grid.getData());

  // Re-draw canvas if canvas is dirty
  const isDirty = useRef<boolean>(true);

  const handleGridDataChange = useCallback((gridData: GridData) => setGridData(gridData), [])

  const updateUI = useCallback(() => {
    isDirty.current = true
    setGridData(grid.getData())
  }, [isDirty, grid])

  return (
    <div
      className={styles.app}
      onContextMenu={(e) => e.preventDefault()}
    >
      <TableForm
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
            updateUI()
          }
        }}
        onChangeColumnKeyType={(columnName, newKeyType) => {
          newKeyType = newKeyType.trim();
          const table: Table | undefined = grid.tables.find(t => t.name === gridData.selectedTable?.name);
          if (!table) return;
          const column: Column | undefined = table.columns.find(c => c.name === columnName);
          if (!column) return;
          column.keyType = newKeyType.substring(0, 2).toUpperCase();
          updateUI()
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
            updateUI()
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
            updateUI()
          }
        }}
        onSelectColumnIndex={(index) => {
          grid.selectedColumnIndex = index;
          updateUI()
        }}
        onAddColumnAfter={(index) => {
          grid.selectedTable?.addColumnAfter(index);
          updateUI()
        }}
        onRemoveColumn={(index) => {
          grid.selectedTable?.removeColumn(index);
          updateUI()
        }}
        onRemoveTable={() => {
          grid.removeTable(grid.selectedTable?.name || '');
          updateUI()
        }}
        onAddTable={() => {
          const table: Table = new Table({
            name: nanoid(5),
            rowCol: new RowCol(getRandomInt(1, 20), getRandomInt(1, 20)),
            columns: [],
          })
          grid.addTable(table);
          grid.selectedTable = table;
          updateUI()
        }}
        onImport={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".json";

          input.addEventListener("change", (event) => {
            const file = (event.target as HTMLInputElement)?.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const gridData = JSON.parse(e.target?.result as string);
                grid.setData(gridData);
                updateUI()
              } catch (error) {
                console.error("Invalid JSON file:", error);
              }
            };

            reader.readAsText(file);
          });

          input.click();
        }}
      />
      <GridView
        grid={grid}
        gridData={gridData}
        setGridData={handleGridDataChange}
        isDirty={isDirty}
      />
    </div>
  )
}

export default App
