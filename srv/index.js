const config = require('config')
const express = require('express')
const app = express()
const routes = require('./routes')
const bodyParser = require('body-parser')

console.log(`NODE ENVIRONMENT: ${process.env.NODE_ENV}`)

if (config.angular.serveDist) {
    require('./angular').serveDist(app)
} else {
    console.log(`Not serving angular dist/ folder. Be sure to run 'npm run ng'.`)
}

app.use(bodyParser.json())
routes(app)

app.listen(config.port, function() {
    console.log(`http://localhost:${config.port}`)
})
