'use strict'
const keygen = require('keygen')
const messengers = require('./messengers')
const { uniqueId } = require('../utils')

const maxBigScreensPerGame = 10

let gamesByType, gamesById = {}
function clearAllGames() {
  // Close all web sockets
  Object.keys(gamesById).map(id => gamesById[id]).forEach(g => {
    Object.keys(g.players).map(id => g.players[id]).forEach(p => p.ws && p.ws.close())
    g.bigScreens.forEach(p => p.ws.close())
  })

  gamesByType = {
    quiz: {}
  }

  gamesById = {}
}
clearAllGames()

function mapValues(obj, fn) {
  const mapped = {}
  Object.keys(obj).forEach(key => {
     mapped[key] = fn(obj[key])
  })
}
function playerForAPI(player) {
  return {
    id: player.id,
    name: player.name
  }
}
function gameForAPI(game) {
  return {
    id: game.id,
    name: game.name,
    type: game.type,
    state: game.state,
    players: mapValues(game.players, playerForAPI)
  }
}

module.exports = {
  clearAllGames,
  getById(id) {
    const game = gamesById[id]
    if (!game) return null
    return gameForAPI(game)
  },
  create(type, name) {
    const games = gamesByType[type]
    if (!games) return null
    const id = uniqueId()
    const game = games[id] = gamesById[id] = {
      id,
      name,
      type,
      state: {},
      players: {},
      bigScreens: []
    }
    game.messenger = messengers.create(game)
    return gameForAPI(game)
  },
  addPlayer(gameId, name) {
    const game = gamesById[gameId]
    if (!game) return null
    const player = {
      name,
      id: uniqueId(5),
      game,
      secret: keygen.url(keygen.large),
    }
    if (!game.master) { // First player to join is the game's master
      game.master = player
      player.isMaster = true
    }
    game.players[player.id] = player
    return playerForAPI(player)
  },
  addBigScreen(gameId, bigScreen) {
    const game = gamesById[gameId]
    if (!game) return false
    if (game.bigScreens.length < maxBigScreensPerGame) {
      game.bigScreens.push(bigScreen)
      return true
    }
    return false
  },
  getPlayer(gameId, playerId) {
    const game = gamesById[gameId]
    if (!game) return null
    const player = game.players[playerId]
    if (!player) return null
    return playerForAPI(player)
  }
}
