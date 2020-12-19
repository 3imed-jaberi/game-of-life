import Game, { loadGameStateMethod } from './game.js'
import GamePresenter from './game-presenter.js'
import { loadCellStateMethod } from './cell.js'

// Setup
//
loadGameStateMethod()
//
loadCellStateMethod()
//
$(function() {
  // Initialize
  const ROWS = 60
  const COLS = 60
  const INTERVAL = 15

  // Default Points
  const data = `{
    "12":{
      "45": 1
    },
    "13":{
      "47": 1
    },
    "14":{
      "44": 1,
      "45": 1,
      "48": 1,
      "49": 1,
      "50": 1
    },
    "43":{
      "15": 1
    },
    "44":{
      "17": 1
    },
    "45":{
      "14": 1,
      "15": 1,
      "18": 1,
      "19": 1,
      "20": 1
    }
  }`

  // Game
  const game = new Game(ROWS, COLS, INTERVAL)
  // Game Presenter
  new GamePresenter('#game', game)
  // Load Default Points
  game.loadFromJson(JSON.parse(data))
})
