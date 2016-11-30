'use strict'
const url = require('url')
const auth = require('./auth')
const games = require('./games')

const MaxMessageLength = 5000
const AuthTimeoutMilliseconds = 2000
const bigScreenPlayerId = 'big-screen'

module.exports = function wsRoutes(webSocketServer) {
  webSocketServer.on('connection', function connection(ws) {
    const location = url.parse(ws.upgradeReq.url, true)

    const urlParts = ws.upgradeReq.url.split('/')
    if (urlParts.length < 5 || urlParts[1] !== 'games' || urlParts[3] !== 'players') return ws.close(4404)

    const gameId = urlParts[2]
    const playerId = urlParts[4]
    let player = null, socket = null

    const authTimeout = setTimeout(() => ws.close(4401), AuthTimeoutMilliseconds)
    function handleAuthorization(message) {
      if (socket || !message.authorization) return false
      if (playerId === bigScreenPlayerId) {
        if (message.authorization !== 'anonymous') return false
        player = {playerId: 'big-screen', ws}
        if (!games.addBigScreen(gameId, player)) return false
      } else {
        const requestedPlayer = games.getPlayer(gameId, playerId)
        if (!requestedPlayer || !auth.isPlayerVerified(requestedPlayer, message.authorization)) return false
        player = requestedPlayer
      }
      socket = ws

      ws.player = player
      player.ws = ws

      ws.send(JSON.stringify({verified: true, game: games.getById(gameId)}))

      clearTimeout(authTimeout)
      return true
    }

    ws.on('close', function close() {
      if (ws.player) {
        ws.player.ws = null
        player = null
        socket = null
      }
    })

    function handleGameMessage(message) {
      if (ws.player && ws.player.game && !ws.player.playerId===bigScreenPlayerId) {
        return ws.player.game.messenger.acceptMessage(ws.player, message)
      }
      return true
    }

    ws.on('message', function incoming(rawMessage) {
      if (rawMessage.length > MaxMessageLength) return false

      let message
      try {
        message = JSON.parse(rawMessage)
      } catch (e) {
        return
      }

      if (handleAuthorization(message)) return
      if (!socket) return ws.close(4401)

      if (handleGameMessage(message)) return
    })
  })
}
