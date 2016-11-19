const config = require('config')
const express = require('express')
const app = express()

console.log(`NODE ENVIRONMENT: ${process.env.NODE_ENV}`)
if (config.angular.serveDist) require('./angular').serveDist(app)

app.get('/api', function (req, res) {
  res.send({message: `Hello World`})
})

console.log(`http://localhost:${config.port}`)
app.listen(config.port)
