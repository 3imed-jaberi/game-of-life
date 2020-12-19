import CellPresenter from './cell-presenter.js'

// GridPresenter
class GridPresenter { // ki nkilik yji careau black
  constructor(view, game, grid) {
    this.grid = grid
    this.game = game
    this.view = view
    this.context = this.view.get(0).getContext('2d')
    this.context.translate(0.5, 0.5) // get sharp lines
    this.context.fillStyle = '#FFF'
    this.context.save()
    this.cellPresenters = {}
  
    for (let i = 1; i <= grid.rows; i++) {
      this.cellPresenters[i] = (this.cellPresenters[i] || {})
      for (let j = 1; j <= grid.cols; j++) {
        const cellPresenter = new CellPresenter(game, grid.cell(i, j), this.context)
        this.cellPresenters[i][j] = cellPresenter
      }
    }

    this.view.on('click', this.onClick.bind(this))
  }

  onClick (evt) {
    const row = Math.floor(evt.offsetY / 10) + 1
    const column = Math.floor(evt.offsetX / 10) + 1
    const presenter = this.cellPresenters[row][column]
    presenter.onClick()
  }
}

export default GridPresenter
