import Rules from './rules.js'
import Cell from './cell.js'
import autoBind from '../utils/auto-bind.util.js'

// Grid
class Grid {
  constructor(rows, cols, game) {
    this.rows = rows
    this.cols = cols
    this.game = game
    this.rules = new Rules(this)
  
    this.cells = {}
    for (let i = 1; i <= rows; i++) {
      this.cells[i] = {}
      for (let j = 1; j <= cols; j++) {
        this.cells[i][j] = new Cell(game, i, j, false)
      }
    }
  
    autoBind(this)

    this.game.on('playing', this.visitLiveCells)
    this.game.on('tick', this.processRules)
    this.game.on('reset', this.clear)
  }

  cell (row, col) {
    return this.cells[row][col]
  }
  
  visitLiveCells () {
    this.everyCell(function() {
      if (this.visited.can('visit')) this.visited.visit()
    })
  }
  
  processRules () {
    this.rules.transformations().forEach(function(fn) { fn() })
  }
  
  clear () {
    this.everyCell(function() {
      if (this.can('die')) this.die()
      if (this.visited.can('unvisit')) this.visited.unvisit()
    })
  }
  
  // Call `fn` for every cell on the grid. Inside the callback, `this` is
  // the cell, and the callback receives as arguments the cell, row, and column.
  //
  // Example:
  //
  //     grid.everyCell(function(cell, row, column) {
  //       this == cell
  //     })
  everyCell (fn) {
    for (let i = 1; i <= this.rows; i++) {
      for (let j = 1; j <= this.cols; j++) {
        let cell = this.cell(i, j)
        fn.apply(cell, [cell, i, j])
      }
    }
  }
  
  // Returns an array of the neighboring Cells to the Cell
  // at the given row and column.
  neighbors (row, column) {
    let leftColumn = column - 1
    let rightColumn = column + 1
    let upRow = row - 1
    let downRow = row + 1
  
    // Wrap around edges
    if (leftColumn < 1) leftColumn = this.cols
    if (rightColumn > this.cols) rightColumn = 1
    if (upRow < 1) upRow = this.rows
    if (downRow > this.rows) downRow = 1
  
    // neighbors
    return [
      this.cell(upRow, leftColumn),
      this.cell(upRow, column),
      this.cell(upRow, rightColumn),
      this.cell(row, leftColumn),
      this.cell(row, rightColumn),
      this.cell(downRow, leftColumn),
      this.cell(downRow, column),
      this.cell(downRow, rightColumn)
    ]
  }  
}

export default Grid
