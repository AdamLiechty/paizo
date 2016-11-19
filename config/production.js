const process = require('process')

module.exports = {
    port: process.env.PORT || 4200,
    angular: {
        serveDist: true
    }
}
