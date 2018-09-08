'use strict'

const fs = require('fs')
const path = require('path')
const debug = require('util').debuglog('download')
const http = require('http')
const https = require('https')

module.exports.getVideo = getVideo

function getVideo(videoID, callback) {
  var videoInfo = `http://www.youtube.com/get_video_info?video_id=${videoID}`
  http.get(videoInfo, res => {
    var data = ''
    res.on('data', chunk => {
      data += chunk
    }).on('end', () => {
      var status = null
      var url = parseDownloadURL(data)
      if(typeof url == 'undefined') getVideo(videoID)
      else downloadVideo(url, videoID, (_status) => {
        if(_status == 'failed') {
          debug('removing file -- redownloading')
          fs.unlink(path.join(__dirname, `${videoID}.mp4`))
          getVideo(videoID)
          status = _status
        } else{
          debug('complete')
          status = _status
        }
      })
      callback(status)
    })
  })
}

function parseDownloadURL(videoInfo) {
  var urlMatch = /url_encoded_fmt_stream_map=([\]\[!"#$%'()*+,.\/:;<=>?@\^_`{|}~-\w]*)/
  var urlMap = unescape(videoInfo.match(urlMatch)[1])
  var urls = unescape(urlMap).split(';')

  var map = []
  for(var i = 0; i < urls.length; i++) {
    var temp = urls[i].match(/url=(.*)/gm)
    if(temp != null && temp[0].length > 0) map[i] = temp[0].replace('url=', '')
  }
  return map[0]
}

function downloadVideo(url, videoID, callback) {
  debug(url)
  https.get(url, res => {
    var stream = fs.createWriteStream(path.join(__dirname, `../_video_cache/${videoID}.mp4`))
    res.pipe(stream)
    res.on('error', () => { callback('failed') })
    res.on('end', () => { callback('complete') })
  })
}
