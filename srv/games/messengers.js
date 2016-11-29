const games = require('./index')
module.exports = {
  create
}

function create(game) {
  const gameType = games.gameTypes[game.type]
  if (!gameType) return null

  const messageHandlers = gameType.messageHandlers
  if (!messageHandlers) return null

  return {
    game,
    acceptMessage(player, message) {
      const handler = messageHandlers[message.type]
      if (handler) {
        handler(player.game, player, message)
      }
    },
    broadcastPlayerMessage(message) {
      for (var i = 0; i < game.players.length; i++) {
        const player = game.players[i]
        if (player.ws) {
          player.ws.send(JSON.stringify(message))
        }
      }
    },
    sendMasterMessage(message) {
      if (game.master && game.master.ws) {
        game.master.ws.send(JSON.stringify(message))
      }
    },
    sendBigScreenMessage(message) {
      // TODO
    }
  }
}
