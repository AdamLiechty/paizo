const games = require('../games')

module.exports = {
  get(req, res) {
    const { gameId } = req.params
    const game = games.getById(gameId)
    if (!game) return res.status(404).send()
    res.send(game)
  },
  post(req, res) {
    const { type, name } = req.body
    if (!name) return res.status(400).send({error:'name required'})
    const game = games.create(type, name)
    if (!game) return res.status(400).send({error:'invalid type'})
    res.status(201).send({
      id: game.id,
      type: game.type,
      name: game.name
    })
  },
  players: {
    post(req, res) {
      const { gameId } = req.params
      const { name } = req.body
      if (!name) return res.status(400).send({error:'name required'})
      const player = games.addPlayer(gameId, name)
      if (!player) return res.status(404).send()
      res.send(player)
    }
    // delete(req, res) {
    //   const { gameId, playerId } = req.params
    //   const game = gamesById[gameId]
    //   if (!game) return res.status(404).send()
    //   const player = game.players[playerId]
    //   if (player) {
    //     if (player.secret !== req.headers.authorization) return res.status(401)
    //     delete game.players[playerId]
    //   }
    //   res.send({status: 'ok'})
    // }
  }
}
