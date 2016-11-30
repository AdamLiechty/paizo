'use strict'
process.env.NODE_ENV = 'test'
const {assert} = require('chai')
const childProcess = require('child_process')
const config = require('config')
const {post, webSocket} = require('./http')(`localhost:${config.port}`)
const WebSocket = require('ws')
const app = require('../srv')
const {clearAllGames} = require('../srv/games')

describe('games', () => {
  afterEach(clearAllGames)

  const testQuiz = {
    name: 'test game',
    type: 'quiz'
  }
  function createQuiz(newGame, bodyErrRes) {
    post('/api/games', newGame, (err, res, body) => bodyErrRes(body, err, res))
  }
  function createPlayer(newPlayer, game, bodyErrRes) {
    post(`/api/games/${game.id}/players`, newPlayer, (err, res, body) => bodyErrRes(body, err, res))
  }

  describe('post /api/games', () => {
    it('creates a valid game if {name, type} supplied', done => {
      createQuiz(testQuiz, (body, err, res) => {
        assert.equal(201, res.statusCode)
        const expected = {
          name: 'test game',
          type: 'quiz',
          id: body.id
        }
        assert.deepEqual(expected, body)
        done()
      })
    })

    it('yields 400 if name is missing', done => {
      createQuiz({type: 'quiz'}, (body, err, res) => {
        assert.equal(400, res.statusCode)
        assert.deepEqual(body, {message: 'name required'})
        done()
      })
    })

    it('yields 400 if type is not an expected game type', done => {
      createQuiz({name: 'my name', type: 'nonexistent'}, (body, err, res) => {
        assert.equal(400, res.statusCode)
        assert(body.message.startsWith('invalid type'))
        done()
      })
    })
  })

  describe('big screen websocket /games/{gameId}/players/big-screen', () => {
    let game
    beforeEach(done => {
      createQuiz(testQuiz, (quiz) => {
        game = quiz
        done()
      })
    })

    function bigScreenWebSocket(onMessage, onClose) {
      const ws = webSocket(`/games/${game.id}/players/big-screen`,
        () => {
          ws.send(JSON.stringify({authorization: 'anonymous'}))
        },
        data => onMessage(JSON.parse(data)),
        onClose
      )
      return ws
    }
    function playerWebSocket(player, onMessage, onClose) {
      const ws = webSocket(`/games/${game.id}/players/${player.id}`,
        () => {
          ws.send(JSON.stringify({authorization: player.secret}))
        },
        data => onMessage(JSON.parse(data)),
        onClose
      )
      return ws
    }

    it('opens a big screen websocket and authenticates anonymously when connected', done => {
      bigScreenWebSocket(msg => msg.verified && done())
    })

    it('rejects more than 10 big screen websockets for a single game', done => {
      let i = 0
      function anotherWS() {
        bigScreenWebSocket((msg) => {
          if (msg.verified) {
            i++
            if (i < 10) {
              anotherWS()
            } else {
              bigScreenWebSocket(null, (errorCode) => {
                assert.equal(4401, errorCode, 'Should be rejected with 4401')
                done()
              })
            }
          }
        })
      }
      anotherWS()
    })

    it('receives game state to all big screen web sockets upon verification', done => {
      let i = 0
      function handleMessage(msg) {
        if (msg.game.type == 'quiz') i++
        if (i == 2) done()
      }
      bigScreenWebSocket(handleMessage)
      bigScreenWebSocket(handleMessage)
    })

    it('receives broadcast of messages to all big screen web sockets', done => {
      let i = 0
      function handleMessage(msg) {
        if (msg.game.state.index == 1) i++
        if (i == 2) done()
      }
      bigScreenWebSocket(handleMessage)
      bigScreenWebSocket(handleMessage)

      createPlayer({name: 'Adam'}, game, (player) => {
        const ws = playerWebSocket(player, msg => {
          if (msg.verified) {
            ws.send(JSON.stringify({type: 'setQuestion', index: 1}))
          }
        })
      })
    })
  })
})
