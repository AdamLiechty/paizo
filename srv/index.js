const config = require('config')
const express = require('express')
const app = express()
const routes = require('./routes')

console.log(`NODE ENVIRONMENT: ${process.env.NODE_ENV}`)

if (config.angular.serveDist) {
    require('./angular').serveDist(app)
} else {
    console.log(`Not serving angular dist/ folder. Be sure to run 'ng serve'.`)
}

routes(app)

app.listen(config.port, function() {
    console.log(`http://localhost:${config.port}`)     
})
