module.exports = {
    serveDist(app) {
        const express = require('express')
        app.use(express.static('dist'))
        console.log('Serving static files from dist/')
    }
}
