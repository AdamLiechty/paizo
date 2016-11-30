const config = require('config')
const express = require('express')
const app = express()
const routes = require('./routes')
const wsRoutes = require('./wsRoutes')
const bodyParser = require('body-parser')

const server = require('http').createServer()
const WebSocketServer = require('ws').Server
const webSocketServer = new WebSocketServer({server})

const isTest = process.env.NODE_ENV === 'test'
if (!isTest) console.log(`NODE ENVIRONMENT: ${process.env.NODE_ENV}`)

if (config.angular.serveDist) {
    require('./angular').serveDist(app)
} else {
    if (!isTest) console.log(`Not serving angular dist/ folder. Be sure to run 'npm run ng'.`)
}

app.use(bodyParser.json())
routes(app)
wsRoutes(webSocketServer)

server.on('request', app)
server.listen(config.port, function() {
    if (!isTest) console.log(`http://localhost:${server.address().port}`)
})

module.exports = app
