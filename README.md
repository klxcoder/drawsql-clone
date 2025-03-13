# Live demo

- https://klxcoder.github.io/drawsql-clone/

# Table on grid structure note

  - Row 0: colorful
  - Row 1,2,3: table name
  - Line before row 4: Seperate table name and tabe columns
  - Row 4,5,6: First column
  - Row 7,8,9: Second column
  - Total of row: 4 + 3 * column.length

# Probleam
  - Click on canvas will rerender: App, TableForm, GridView

# Desired
  - Click on canvas will not rerender: App
  - Will rerender TableForm if necessary
  - Will not rerender GridView, just draw

# Todo
  - Make gridDate useRef

# Problem
  - Change data from TableForm do not trigger draw in GridView

# Desired
  - Change data from TableForm will trigger draw in GridView

# Todo
  - Maybe add a random number to trigger draw
  - useEffect with the random number above
  - Or useEffect with dependency gridData

# Todo later
  - Can import data
  - Can show dots before and after columns
  - Can connect dots
    + Between 2 columns from 2 tables
    + Between 2 columns from 1 table (self join)