import Grid from './grid.js'
import GridDB from './grid-db.js'
import autoBind from '../utils/auto-bind.util.js'

// Game
class Game extends EventEmitter2 {
  constructor(rows, cols, iterationTime) {
    super()

    this.iterationTime = iterationTime
    this.iterations = 0
    this.grid = new Grid(rows, cols, this)
    this.db = new GridDB(this.grid)

    this.state = StateMachine.create({
      initial: 'paused',
      events: [
        { name: 'play',  from: 'paused',  to: 'playing' },
        { name: 'pause', from: 'playing', to: 'paused'  },
        { name: 'reset', from: 'paused',  to: 'paused'  },
        { name: 'load',  from: 'paused',  to: 'paused'  },
        { name: 'save',  from: 'paused',  to: 'paused'  }
      ]
    })

    autoBind(this)

    this.state.onchangestate = this.emit.bind(this, 'stateChange')

    this.state.onplaying = function() {
      this.emit('playing')
      this.tick()
    }.bind(this)

    this.state.onpaused = function() {
      this.emit('paused')
      if (this.timer) clearTimeout(this.timer)
    }.bind(this)

    this.state.onreset = function() {
      this.iterations = 0
      this.emit('reset')
    }.bind(this)

    this.state.onload = function() {
      this.emit('loading')
    }.bind(this)

    this.state.onsave = function() {
      this.emit('saving')
    }.bind(this)
  }

  tick () {
    this.emit('tick', ++this.iterations)
    if (this.is('playing')) {
      this.timer = setTimeout(function() {
        this.tick()
      }.bind(this), this.iterationTime)
    }
  }
  
  saveToDb (name) {
    this.db.save(name)
    this.emit('saved', name)
  }
  
  loadFromDb (name) {
    const data = this.db.load(name)
    this.loadFromJson(data)
  }
  
  loadFromJson (data) {
    this.reset()
    for (let i in data) {
      for (let j in data[i]) {
        const cell = this.grid.cell(i, j)
        if (cell) cell.toggle()
      }
    }
  }

  availableSaves () {
    return this.db.keys()
  }  
}


function loadGameStateMethod () {
  // Delegate common state machine methods to the state machine
  ['pause', 'play', 'reset', 'save', 'load', 'can', 'is'].forEach(function(event) {
    Game.prototype[event] = function() {
      // console.log(this.state[event], arguments)
      // arguments is the default fsm state ..
      return this.state[event].apply(this.state, arguments)
    }
  })
}

export { Game as default, loadGameStateMethod }
