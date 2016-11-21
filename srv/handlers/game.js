const { uniqueId } = require('../utils')
const keygen = require('keygen')

const gamesByType = {
  logQuiz: {}
}

const gamesById = {}

module.exports = {
  get(req, res) {
    const { gameId } = req.params
    const game = gamesById[gameId]
    if (!game) return res.status(404).send()
    res.send(game)
  },
  post(req, res) {
    const { name, type } = req.body
    const games = gamesByType[type]
    if (!name) return res.status(400).send({error:'name required'})
    if (!games) return res.status(400).send({error:'invalid type'})
    const id = uniqueId()
    const game = games[id] = gamesById[id] = {id, name, type, players: {}}
    res.send(game)
  },
  players: {
    post(req, res) {
      const { gameId } = req.params
      const game = gamesById[gameId]
      const { name } = req.body
      if (!game) return res.status(404).send()
      if (!name) return res.status(400).send({error:'name required'})
      const player = {
        name,
        id: uniqueId(5),
        secret: keygen.url(keygen.large)
      }
      if (!game.master) {
        game.master = player
        player.isMaster = true
      }
      game.players[player.id] = player
      res.send(player)
    },
    delete(req, res) {
      const { gameId, playerId } = req.params
      const game = gamesById[gameId]
      if (!game) return res.status(404).send()
      const player = game.players[playerId]
      if (player) {
        if (player.secret !== req.headers.authorization) return res.status(401)
        delete game.players[playerId]
      }
      res.send({status: 'ok'})
    }
  }
}
