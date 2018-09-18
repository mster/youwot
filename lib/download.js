'use strict'

const fs = require('fs')
const debug = require('util').debuglog('download')
const http = require('http')
const https = require('https')

const formatter = require('../util/format')

module.exports.getVideo = getVideo

function getVideo(videoID, fn) {
  debug('Get video')

  // gets video info, url, then media file
  getVideoURL(videoID, downloadHelper)

  function downloadHelper(url) {
    if(typeof url == 'undefined') {
      getVideo(videoID, fn)
    }
    else {
      // get video file extension
      var end = url.slice(url.length - 8, url.length)
      var ext = end.slice((end.indexOf('/') + 1), end.length)

      // download video, check callback status
      downloadVideo(url, videoID, ext, status => {
        if(status == 200) fn(ext)
        else getVideo(videoID, fn)
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

function downloadVideo(url, id, ext, callback) {
  debug(`Downloading video from ${url}\n`)

  var writePath = formatter.formatWritePath(id, ext)
  var fileStream = fs.createWriteStream(writePath)

  https.get(url, res => {
    const { statusCode } = res;
    if (statusCode !== 200) {
      callback(statusCode)
      return
    }

    res.pipe(fileStream)
    fileStream.on('finish', () => {
      fileStream.close(callback(statusCode))
    })

  })
  .on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}
