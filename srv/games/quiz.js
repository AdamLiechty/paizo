const messageHandlers = {
  startGame(game, player, message) {
    if (player.isMaster) {
      game.messenger.broadcastPlayerMessage({ type: 'gameStarted' })
    }
  }
}
module.exports = {
  messageHandlers
}
