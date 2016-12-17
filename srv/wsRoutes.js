'use strict'
const url = require('url')
const games = require('./games')

const MaxMessageLength = 5000
const AuthTimeoutMilliseconds = 2000
const bigScreenPlayerId = 'big-screen'

function authFail(ws, reason) {
  console.log('auth fail')
  ws.send(JSON.stringify({message: 'authorization invalid', reason}))
  ws.close(4401)
}

module.exports = function wsRoutes(webSocketServer) {
  webSocketServer.on('connection', function connection(ws) {
    const location = url.parse(ws.upgradeReq.url, true)

    const urlParts = ws.upgradeReq.url.split('/')
    if (urlParts.length < 6 || urlParts[1] !== 'ws' || urlParts[2] !== 'games' || urlParts[4] !== 'players') return ws.close(4404)

    const gameId = urlParts[3]
    const playerId = urlParts[5]
    let player = null, socket = null
    ws.send(JSON.stringify({message:'connected'}))

    const authTimeout = setTimeout(() => authFail(ws, 'timeout'), AuthTimeoutMilliseconds)
    function handleAuthorization(message) {
      if (socket || !message.authorization) return false
      if (playerId === bigScreenPlayerId) {
        if (message.authorization !== 'anonymous') return false
        player = {playerId: 'big-screen', ws}
        if (!games.addBigScreen(gameId, player)) return false
      } else {
        const requestedPlayer = games.getRawPlayer(gameId, playerId)
        if (!requestedPlayer || requestedPlayer.secret !== message.authorization) return false
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
      if (ws.player && ws.player.game && ws.player.id !== bigScreenPlayerId) {
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
      if (!socket) {
        return authFail(ws, 'not authorized')
      }

      if (handleGameMessage(message)) return
    })
  })
}
