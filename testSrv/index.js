'use strict'
const {assert} = require('chai')
const childProcess = require('child_process')
const config = require('config')
const {post} = require('./http')(`http://localhost:${config.port}`)
const app = require('../srv')

describe('games', () => {
  describe('create', () => {
    it('should create a valid game', done => {
      const newGame = {
        name: 'test game',
        type: 'logQuiz'
      }
      post('/api/games', newGame, (err, res, body) => {
        assert.isNull(err)
        assert.equal(201, res.statusCode)
        const expected = {
          name: 'test game',
          type: 'logQuiz',
          id: body.id
        }
        assert.deepEqual(expected, body)
        done()
      })
    })
  })
})
