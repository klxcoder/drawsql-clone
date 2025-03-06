# TODO
  - GridView just show the grid to the canvas:
    + Show tables
    + Show if a table active
  - Grid (aka model Grid) will save the state and handle logic:
    + constants: MAX_ROWS, MAX_COLS, CELL_SIZE
    + attributes tables: contain tables state, is the table active
    + mouseCell.col: The column of the mouse is on
    + mouseCell.row: The row of the mouse is on
  - How GridView and Grid communicate?
    + The GridView will accept prop grid (type Grid model)
    + GridView will add event listen for mouse move on canvas and call update(mouseX, mouseY)
    + Grid will use mouseX and mouseY to calculate mouseCell
    + How GridView update to hightlight the mouseCell