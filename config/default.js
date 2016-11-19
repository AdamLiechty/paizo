const process = require('process')

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

module.exports = {
    port: process.env.PORT || 4201,
    angular: {
        serveDist: false
    }
}
