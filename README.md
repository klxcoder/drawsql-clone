# Live demo

- https://klxcoder.github.io/drawsql-clone/

# Table on grid structure note

  - Row 0: colorful
  - Row 1,2,3: table name
  - Line before row 4: Seperate table name and tabe columns
  - Row 4,5,6: First column
  - Row 7,8,9: Second column
  - Total of row: 4 + 3 * column.length

# Problem
  - Mouse move will:
    - Render App
    - Render TableForm
    - Render GridView

# Desired
  - Mouse move will
    - Not render App
    - Not render TableForm
    - Not render GridView

# Todo
  - Add useRef `mouseCell: RowColData;` to the component GridView

# Todo
  - Can import data
  - Can show dots before and after columns
  - Can connect dots
    + Between 2 columns from 2 tables
    + Between 2 columns from 1 table (self join)