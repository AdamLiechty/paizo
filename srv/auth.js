module.exports = {
  isPlayerVerified
}

function isPlayerVerified(player, authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false

  const token = auth.substring('Bearer '.length)
  return (player.secret === token)
}
