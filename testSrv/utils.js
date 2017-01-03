const { assert } = require('chai')
const { iMerge } = require('../srv/utils')

describe('utils', () => {
  describe('iMerge', () => {
    it('sets a new property without mutating the original object', () => {
      const x = {a:1}
      const b = 2
      const y = iMerge(x, {b})
      assert.deepEqual({a:1}, x)
      assert.deepEqual({a:1, b:2}, y)
    })

    it('overrides an existing property without mutating the original object', () => {
      const x = {c:1, d:26}
      const y = iMerge(x, {d:2})
      assert.deepEqual({c:1, d:26}, x)
      assert.deepEqual({c:1, d:2}, y)
    })
  })
})
