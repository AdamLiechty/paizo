const game = require('./handlers/game')

function routes(app) {
  app.post('/api/games', game.post)
  app.get('/api/games/:gameId', game.get)
  app.post('/api/games/:gameId/players', game.players.post)
  app.delete('/api/games/:gameId/players/:playerId', game.players.delete)
}

module.exports = routes
