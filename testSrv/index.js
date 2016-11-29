'use strict'
const {assert} = require('chai')
const childProcess = require('child_process')
const config = require('config')
const {post} = require('./http')(`http://localhost:${config.port}`)
const app = require('../srv')

describe('games', () => {
  describe('create', () => {
    it('should create a valid game', () => {
      post('/api/games', {name: 'test game'}, (err, res, body) => {
        assert.isNull(err)
        assert.equal(201, res.statusCode)
      })
    })
  })
})
