const config = require('config')
const express = require('express')
const app = express()
const routes = require('./routes')
const wsRoutes = require('./wsRoutes')
const bodyParser = require('body-parser')

const server = require('http').createServer()
const WebSocketServer = require('ws').Server
const webSocketServer = new WebSocketServer({server})

console.log(`NODE ENVIRONMENT: ${process.env.NODE_ENV}`)

if (config.angular.serveDist) {
    require('./angular').serveDist(app)
} else {
    console.log(`Not serving angular dist/ folder. Be sure to run 'npm run ng'.`)
}

app.use(bodyParser.json())
routes(app)
wsRoutes(webSocketServer)

server.on('request', app)
server.listen(config.port, function() {
    console.log(`http://localhost:${server.address().port}`)
})
