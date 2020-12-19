// Rules
class Rules {
  constructor(grid) {
    this.grid = grid
  }

  // Returns an array of functions that should be called
  // in order to get the grid into the "next" state.
  transformations () {
    let transformations = []
    this.grid.everyCell(function(cell, row, column) {
      const neighbors = this.grid.neighbors(row, column)
      let alive = 0
      let dead = 0
      neighbors.forEach((c) => { c.is('alive') ? alive++ : dead++ })

      if (cell.is('alive')) {
        if (alive < 2 || alive > 3) {
          transformations.push(function() { cell.die() })
        }
      } else if (alive == 3) {
        transformations.push(function() { cell.live() })
      }
    }.bind(this))
    return transformations
  }
}

export default Rules
