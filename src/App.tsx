import { useCallback, useRef, useState } from 'react';
import styles from './App.module.scss';
import { Grid, GridData } from './models/Grid';

import TableForm from './components/TableForm';
import { getInitialGrid, getRandomInt } from './utils';
import GridView from './components/GridView';
import { Table, TableData } from './models/Table';
import { ColumnData } from './models/Column';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5);

function App() {
  const [grid] = useState<Grid>(getInitialGrid);
  const [gridData, setGridData] = useState<GridData>(grid.data);

  // Re-draw canvas if canvas is dirty
  const isDirty = useRef<boolean>(true);

  const handleGridDataChange = useCallback((gridData: GridData) => setGridData(gridData), [])

  const updateUI = useCallback(() => {
    isDirty.current = true
    setGridData({ ...grid.data })
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
            const table: TableData | undefined = grid.data.tables.find(t => t.name === newName);
            if (table) return;
          }
          {
            // Change the table name to `newName`
            const table: TableData | undefined = grid.data.tables.find(t => t.name === gridData.selectedTable?.name);
            if (!table) return;
            table.name = newName;
            updateUI()
          }
        }}
        onChangeColumnKeyType={(columnName, newKeyType) => {
          newKeyType = newKeyType.trim();
          const table: TableData | undefined = grid.data.tables.find(t => t.name === gridData.selectedTable?.name);
          if (!table) return;
          const column: ColumnData | undefined = table.columns.find(c => c.name === columnName);
          if (!column) return;
          column.keyType = newKeyType.substring(0, 2).toUpperCase();
          updateUI()
        }}
        onChangeColumnName={(columnName, newName) => {
          newName = newName.trim();
          if (newName === '') return;
          const table: TableData | undefined = grid.data.tables.find(t => t.name === gridData.selectedTable?.name);
          if (!table) return;
          {
            // If column `newName` already exist => exit
            const column: ColumnData | undefined = table.columns.find(c => c.name === newName);
            if (column) return;
          }
          {
            // Change the column name to `newName`
            const column: ColumnData | undefined = table.columns.find(c => c.name === columnName);
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
          const table: TableData | undefined = grid.data.tables.find(t => t.name === gridData.selectedTable?.name);
          if (!table) return;
          {
            // Change the column type to `newType`
            const column: ColumnData | undefined = table.columns.find(c => c.name === columnName);
            if (!column) return;
            column.columnType = newType;
          }
          {
            updateUI()
          }
        }}
        onSelectColumnIndex={(index) => {
          grid.data.selectedColumnIndex = index;
          updateUI()
        }}
        onAddColumnAfter={(index) => {
          if (!grid.data.selectedTable) return
          const table: Table = new Table(grid.data.selectedTable)
          table.addColumnAfter(index)
          grid.data.selectedTable = table.data
          grid.data.tables = grid.data.tables.map(t => t.name === table.data.name ? table.data : t)
          updateUI()
        }}
        onRemoveColumn={(index) => {
          if (!grid.data.selectedTable) return
          const table: Table = new Table(grid.data.selectedTable)
          table.removeColumn(index)
          grid.data.selectedTable = table.data
          grid.data.tables = grid.data.tables.map(t => t.name === table.data.name ? table.data : t)
          updateUI()
        }}
        onRemoveTable={() => {
          grid.removeTable(grid.data.selectedTable?.name || '');
          updateUI()
        }}
        onAddTable={() => {
          const tableData: TableData = {
            name: nanoid(5),
            rowCol: {
              row: getRandomInt(1, 20),
              col: getRandomInt(1, 20)
            },
            columns: [],
            widthHeight: {
              width: 0,
              height: 0,
            },
            color: '',
          }
          grid.addTable(tableData);
          grid.data.selectedTable = tableData;
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
                grid.data = gridData
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
