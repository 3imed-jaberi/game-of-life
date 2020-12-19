import autoBind from '../utils/auto-bind.util.js'

// CellPresenter
class CellPresenter {
  constructor(game, cell, context) {
    this.game = game
    this.cell = cell
    this.context = context

    autoBind(this)
    this.render()
    this.cell.on('stateChange', this.render)
    this.cell.on('visitedChange', this.render)
  }

  render () {
    const x = 10 * this.cell.column - 10
    const y = 10 * this.cell.row - 10
    this.context.save()
    this.context.strokeStyle = '#000'
    this.context.clearRect(x, y, 10, 10)
  
    if (this.cell.state.current == 'dead') {
      if (this.cell.visited.current == 'visited') {
        this.context.fillStyle = '#3F90FF'
      }
    } else {
      this.context.fillStyle = '#FF0A00'
    }
    this.context.fillRect(x, y, 10, 10)
    this.context.strokeRect(x, y, 10, 10)
    this.context.restore()
  }
  
  onClick () {
    this.cell.toggle()
  }
}

export default CellPresenter
