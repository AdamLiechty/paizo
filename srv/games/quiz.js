const {iMerge, getOrDefault} = require('../utils')

function stateMachineMessageHandlers(stateTransitions, publicState) {
  function handle(stateTransition) {
    return function(game, player, message, messenger) {
      const newState = stateTransition(game, player, message)
      if (newState) {
        // Broadcast new public state
        const state = publicState(newState)
        const message = { game: iMerge(game, {state}) }
        messenger.broadcastPlayerMessage(message)
        messenger.sendBigScreenMessage(message)
        return newState
      }
    }
  }
  return Object.keys(stateTransitions).reduce((acc, curr) => {
    acc[curr] = handle(stateTransitions[curr])
    return acc
  }, {})
}

const stateTransitions = {
  nextQuestion(game, player, message, messenger) {
    if (player.isMaster) {
      const index = game.state.index + 1
      return iMerge(game.state, {index})
    }
  },
  answer(game, player, message, messenger) {
    if (message.index === game.state.index && game.state.questionOpen) {
      const playerAnswers = getOrDefault(game.state.questionPlayerAnswers, game.state.index, [])
      playerAnswers[player.id] = message.answer
      return iMerge(game.state, {questionPlayerAnswers})
    }
  }
}

function publicState(state) {
  return {
    index: state.index,
    question: state.questions[state.index]
  }
}

module.exports = {
  messageHandlers: stateMachineMessageHandlers(stateTransitions, publicState),
  initialState: {
    index: -1,
    questionOpen: false,
    questions: [],
    questionPlayerAnswers: []
  }
}
