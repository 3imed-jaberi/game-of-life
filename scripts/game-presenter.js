import GridPresenter from './grid-presenter.js'
import autoBind from '../utils/auto-bind.util.js'

// GamePresenter
class GamePresenter {
  constructor (selector, game) {
    this.view = $(selector)
    this.buttons = this.view.find('button[data-event]')
    this.selector = this.view.find('select')
    this.iterations = this.view.find('.iteration')

    this.game = game

    this.gridPresenter = new GridPresenter(
      this.view.find('.grid'),
      game,
      game.grid
    )

    autoBind(this)

    this.setButtonState()
    this.setSavedBoards()

    this.buttons.on('click', this.handleButtonClick)
    this.game.on('stateChange', this.setButtonState)
    this.game.on('tick', this.setIterationCount)
    this.game.on('reset', this.resetIterationCount)
    this.game.on('saving', this.save)
    this.game.on('loading', this.load)
    this.game.on('saved', function(name) {
      this.addSaveBoard(name, true)
      // use bind here beacause auto-bind bind 
      // only the class method not callback ones
    }.bind(this))
  }

  handleButtonClick (evt) {
    const event = $(evt.target).data('event')
    this.game[event].apply(this.game)
  }

  setButtonState () {
    this.buttons.each(function(i, button) {
      button = $(button)
      const event = button.data('event')
      if (this.game.can(event)) {
        button.prop('disabled', false)
      } else {
        button.prop('disabled', true)
      }        
    }.bind(this))
  }

  setSavedBoards () {
    this.game.availableSaves().forEach(function(name) {
      this.addSaveBoard(name)
    }.bind(this))
  }
  
  setIterationCount (count) {
    this.iterations.text(count)
  }
  
  resetIterationCount () {
    this.setIterationCount(0)
  }
  
  save () {
    let name = ''
    while (name.trim() == '') {
      name = prompt('What do you want to name your save ?', '')
      if (name == null) return
    }
    this.game.saveToDb(name.trim())
  }
  
  load () {
    const name = this.selector.val()
    if (name == '') return
    this.game.loadFromDb(name)
  }
  
  addSaveBoard (name, select) {
    $('<option>').text(name).val(name).appendTo(this.selector)
    if (select) this.selector.val(name)
  }
}

export default GamePresenter
