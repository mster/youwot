'use strict'

const fs = require('fs')
const path = require('path')
const debug = require('util').debuglog('download')
const http = require('http')
const https = require('https')

module.exports.getVideo = getVideo

function getVideo(videoID, fn) {
  // gets video info, url, then media file
  getVideoURL(videoID, downloadHelper)

  function downloadHelper(url) {
    if(typeof url == 'undefined') {
      getVideo(videoID)
    }
    else {
      // get video file extension
      var end = url.slice(url.length - 8, url.length)
      var ext = end.slice((end.indexOf('/') + 1), end.length)
      debug(ext)

      // download video, check callback status
      downloadVideo(url, videoID, ext, (status) => {
      if(status == 'complete') {
        debug('video downloading complete')
        fn(status)
      } 
      else {
        fs.unlink(path.join(__dirname, `../_video_cache/${videoID}.${ext}`))
        debug('err: removing file -- redownloading')
        fn(status)
      }
      })
    }
  }
}

function getVideoURL(videoID, fn) {
  var videoInfo = `http://www.youtube.com/get_video_info?video_id=${videoID}`

  http.get(videoInfo, (res) => {
    var data = ''
    res.on('data', chunk => {
      data += chunk
    })
    .on('end', () => {
      fn(parseDownloadURL(data))
    })
    .on('error', (err) => {
      fn(err)
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

function downloadVideo(url, videoID, ext, callback) {
  debug(`Downloading video from ${url}`)
  https.get(url, res => {
    var stream = fs.createWriteStream(path.join(__dirname, `../_video_cache/${videoID}.${ext}`))
    res.pipe(stream)
      .on('error', () => { callback(null) })
      .on('end', () => { callback('complete') })
  })
}
