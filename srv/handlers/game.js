const { uniqueId } = require('../utils')

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
  post(req, res, next) {
    const { name, type } = req.body
    const games = gamesByType[type]
    if (!name) return next('name required')
    if (!games) return next('invalid type')
    const id = uniqueId()
    const game = games[id] = gamesById[id] = {id, name, type}
    res.send(game)
    next()
  },
  players: {
    post(req, res) {
      const { gameId } = req.params
      res.send({message: `Welcome to game ${gameId}`})
    }
  }
}
