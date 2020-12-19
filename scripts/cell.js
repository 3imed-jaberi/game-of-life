// Cell
class Cell extends EventEmitter2 {
  constructor(game, row, column, alive) {
    super()

    this.game = game
    this.row = row
    this.column = column
  
    this.state = StateMachine.create({
      initial: 'dead',
      events: [
        { name: 'live',   from: 'dead',  to: 'alive' },
        { name: 'die',    from: 'alive', to: 'dead'  },
        { name: 'toggle', from: 'dead',  to: 'alive' },
        { name: 'toggle', from: 'alive', to: 'dead'  }
      ]
    })
  
    this.state.onchangestate = this.emit.bind(this, 'stateChange')
  
    // A cell cannot be toggled unless the game is paused.
    this.state.onbeforetoggle = function () {
      if (!game.is('paused')) return false
    }
  
    this.state.onalive = function() {
      if (this.visited.can('visit')) this.visited.visit()
    }.bind(this)
  
    this.visited = StateMachine.create({
      initial: 'unvisited',
      events: [
        { name: 'visit',   from: 'unvisited', to: 'visited' },
        { name: 'unvisit', from: 'visited',   to: 'unvisited' }
      ]
    })
  
    this.visited.onchangestate = this.emit.bind(this, 'visitedChange')
  
    this.visited.onbeforevisit = function() {
      if (!this.state.is('alive')) return false
      if (this.game.is('paused')) return false
    }.bind(this)
  }
}

function loadCellStateMethod () {
  ['live', 'die', 'toggle', 'can', 'is'].forEach(function(event) {
    Cell.prototype[event] = function() {
      return this.state[event].apply(this.state, arguments)
    }
  })
}

export { Cell as default, loadCellStateMethod }
