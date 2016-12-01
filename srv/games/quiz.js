const messageHandlers = {
  setQuestion(game, player, message, messenger) {
    if (player.isMaster) {
      game.state.index = message.index
      
      messenger.broadcastPlayerMessage({ game })
      messenger.sendBigScreenMessage({ game })
    }
  }
}
module.exports = {
  messageHandlers
}
