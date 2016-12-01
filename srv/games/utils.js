const { pick } = require('../utils')

module.exports = {
  mapValues,
  playerForAPI,
  gameForAPI
}

function mapValues(obj, fn) {
  const mapped = {}
  Object.keys(obj).forEach(key => {
     mapped[key] = fn(obj[key])
  })
  return mapped
}

function playerForAPI(player) {
  return pick(player, 'id', 'name', 'isMaster')
}

function gameForAPI(game) {
  const ret = pick(game, 'id', 'name', 'type', 'state')
  ret.players = mapValues(game.players, playerForAPI)
  return ret
}
