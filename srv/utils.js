const consonants = 'bcdgjklmnpqrstvwxyz'
const vowels = 'aeiou'

module.exports = {
  uniqueId(length = 3) {
    var id = ''
    for (var i = 0; i < length; i++) {
      const buf = (i % 2) ? vowels : consonants
      const bufIndex = Math.floor(Math.random() * buf.length)
      id += buf[bufIndex]
    }
    return id
  }
}
