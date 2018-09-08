const path = require('path')

module.exports.formatVideoPath = formatVideoPath

function formatVideoPath(video_id) {
    if(video_id) {
      return path.join(__dirname, `../_video_cache/${video_id}.mp4`)
    }
    else {
      return null
    }
}
module.exports.nonce = nonce

function nonce() {
  var chars = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  var nonce = ''
  for(var i = 0; i < 25; i++) {
    nonce += chars[Math.floor(Math.random() * chars.length)]
  }
  return nonce
}