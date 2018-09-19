const path = require('path')

module.exports.formatWritePath = formatWritePath

function formatWritePath(id, ext) {
    if(id) {
      return path.join(__dirname, `../youwot_cache/download/${id}.${ext}`)
    }
    else {
      return null
    }
}

module.exports.formatRenderPath = formatRenderPath

function formatRenderPath(id, ext) {
  if(id) {
    return path.join(__dirname, `../youwot_cache/render/${id}.${ext}`)
  }
  else {
    return null
  }
}

module.exports.formatTempPath = formatTempPath

function formatTempPath(id, ext) {
    if(id) {
      return path.join(__dirname, `../youwot_cache/temp/${id}.${ext}`)
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