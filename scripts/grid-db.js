// GridDB
class GridDB extends EventEmitter2 {
  constructor(grid) {
    super()
    this.grid = grid
  }

  save (key) {
    let data = {}
    this.grid.everyCell(function(cell, row, col) {
      if (cell.is('alive')) {
        data[row] = (data[row] || {})
        data[row][col] = 1
      }
    })
    localStorage[`gol:${key}`] = JSON.stringify(data)
  }
  
  load (key) {
    let data = localStorage[`gol:${key}`]
    if (data) {
      data = JSON.parse(data)
    }
    return data
  }
  
  keys () {
    let keys = []
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i)
      if (key.match(/^gol:/)) keys.push(key.replace('gol:', ''))
    }
    return keys
  }  
}

export default GridDB
