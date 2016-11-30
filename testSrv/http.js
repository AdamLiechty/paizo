const request = require('request')
const WebSocket = require('ws');

module.exports = function http(host) {
  return {
    post(url, body, errResBody) {
      return request.post(`http://${host}${url}`, {body, json: true}, errResBody)
    },

    webSocket(url, onOpen, onMessage, onClose) {
      var ws = new WebSocket(`ws://${host}${url}`)
      if (onOpen) ws.on('open', onOpen)
      if (onMessage) ws.on('message', onMessage)
      if (onClose) ws.on('close', onclose)
      return ws
    }
  }
}
