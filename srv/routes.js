const game = require('./handlers/game')

function routes(app) {
  app.post('/api/games', game.post)
  app.get('/api/games/:gameId', game.get)
  app.post('/api/games/:gameId/players', game.players.post)
}

module.exports = routes
