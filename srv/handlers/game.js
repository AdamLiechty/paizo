module.exports = {
    players: {
        post(req, res) {
            const { gameId } = req.params
            res.send({message: `Welcome to game ${gameId}`})
        }
    }
}
