const game = require('./handlers/game')

function routes(app) {
    app.post('/api/games/:gameId/players', game.players.post)
}

module.exports = routes
