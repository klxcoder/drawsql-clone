# Table on grid structure
  - Row 0: colorful
  - Row 1,2,3: table name
  - Line before row 4: Seperate table name and tabe columns
  - Row 4,5,6: First column
  - Row 7,8,9: Second column
  - Total of row: 4 + 3 * column.length

# UI overview
  - Left = TableForm
      view `tableData`
      can change `tableData`
  - Right = GridView
      view `grid` // loop and draw to canvas
      can change `tableData`
      setTableData={setTableData}

# The problem
  - `grid` and `tableData` have to be sync
  - if change `tableData` (from form) => have to update `grid` as well
  - What about update `grid` and getTableData?

# The solution
  - Left = TableForm
    + tableData
    + setTableData
    + grid
    * Whenever update: call grid.update() and then setTableData(grid.getTableData())
  - Right = GridView
    + tableData
    + setTableData
    + No need for grid, because there is no change value, just selected value
    + Whenever click: call setTableData(the clicked tableData)

# Todo
  + grid table that can getData, putData