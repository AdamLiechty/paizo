const consonants = 'bcdgjklmnpqrstvwxyz'
const vowels = 'aeiou'

module.exports = {
  pick(o, ...props) {
    return Object.assign({}, ...props.map(prop => ({[prop]: o[prop]})))
  },
  uniqueId(length = 3) {
    var id = ''
    for (var i = 0; i < length; i++) {
      const buf = (i % 2) ? vowels : consonants
      const bufIndex = Math.floor(Math.random() * buf.length)
      id += buf[bufIndex]
    }
    return id
  },
  iMerge(...args) {
    return Object.assign({}, ...args)
  },
  getOrDefault(o, key, value) {
    if (o[key] == null) o[key] = value
    return o[key]
  }
}
