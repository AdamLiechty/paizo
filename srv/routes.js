function routes(app) {
    app.get('/api', function (req, res) {
      res.send({message: `Hello World`})
    })
} 

module.exports = routes
