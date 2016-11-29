const request = require('request')

module.exports = function http(root) {
  return {
    post(url, body, errResBody) {
      return request.post(`${root}${url}`, {body, json: true}, errResBody)
    }
  }
}
