const game = require('./handlers/game')

function routes(app) {
  app.post('/api/games', game.post)
  app.get('/api/games/:gameId', game.get)
  app.post('/api/games/:gameId/players', game.players.post)
  //app.delete('/api/games/:gameId/players/:playerId', game.players.delete)

  app.use(errorHandler)
}

function errorHandler(err, req, res, next) {
  console.log(err)
  res.status(500).send({message: 'Internal Server Error'})
}

module.exports = routes
