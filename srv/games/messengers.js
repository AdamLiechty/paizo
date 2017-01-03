const { gameForAPI, playerForAPI } = require('./utils')

const gameTypes = require('./types')

module.exports = {
  gameTypes,
  create
}

function create(game) {
  const gameType = gameTypes[game.type]
  if (!gameType) return null

  const messageHandlers = gameType.messageHandlers
  if (!messageHandlers) return null

  return {
    game,
    acceptMessage(player, message) {
      const handler = messageHandlers[message.type]
      if (handler) {
        const newState = handler(gameForAPI(player.game), playerForAPI(player), message, player.game.messenger)
        if (newState != null) player.game.state = newState
        return true
      }
      return false
    },
    broadcastPlayerMessage(message) {
      Object.keys(game.players).forEach(playerId => {
        const player = game.players[playerId]
        if (player.ws) {
          player.ws.send(JSON.stringify(message))
        }
      })
    },
    sendMasterMessage(message) {
      if (game.master && game.master.ws) {
        game.master.ws.send(JSON.stringify(message))
      }
    },
    sendBigScreenMessage(message) {
      game.bigScreens.forEach(screen => {
        if (screen.ws) {
          screen.ws.send(JSON.stringify(message))
        }
      })
    }
  }
}
