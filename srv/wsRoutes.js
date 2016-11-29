'use strict'
const url = require('url')
const auth = require('./auth')
const games = require('.games')
const messenger = require('./messenger')

const MaxMessageLength = 5000
const bigScreenPlayerId = 'big-screen'

module.exports = function wsRoutes(webSocketServer) {
  webSocketServer.on('connection', function connection(ws) {
    const location = url.parse(ws.upgradeReq.url, true)
    console.log(`websocket connected: ${ws.upgradeReq.url}`)

    const urlParts = ws.upgradeReq.url.split('/')
    if (urlParts.length < 3) return ws.close(4404)

    const gameId = urlParts[1]
    const playerId = urlParts[2]
    let player = null, socket = null

    const authTimeout = setTimeout(() => ws.close(4401), 5000)
    function handleAuthorization(message) {
      if (socket || !message.authorization) return false
      if (playerId === bigScreenPlayerId) {
        player = {playerId: 'big-screen', ws}
        if (!games.addBigScreenSocket(gameId, player)) return false
      } else {
        const requestedPlayer = games.getPlayer(gameId, playerId)
        if (!requestedPlayer || !auth.isPlayerVerified(requestedPlayer, message.authorization)) return false
        player = requestedPlayer
      }
      socket = ws

      ws.player = player
      player.ws = ws

      ws.send('VERIFIED')

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

    function handleJSON(rawMessage) {
      if (rawMessage.length > MaxMessageLength) return false
      let message
      try {
        message = JSON.parse(rawMessage)
      } catch (e) {
        return false
      }

      if (ws.player && ws.player.game && !ws.player.playerId===bigScreenPlayerId) {
        ws.player.game.messenger.acceptMessage(ws.player, message)
      }
      return true
    }

    ws.on('message', function incoming(message) {

      if (handleAuthorization(message)) return
      if (!socket) return ws.close(4401)

      if (handleJSON(message)) return

    })
  })
}
