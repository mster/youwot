'use strict'

const fs = require('fs')
const path = require('path')
const debug = require('util').debuglog('download')
const http = require('http')
const https = require('https')


function getVideo(videoID) {
  var videoInfo = `http://www.youtube.com/get_video_info?video_id=${videoID}`
  http.get(videoInfo, res => {
    var data = ''
    res.on('data', chunk => {
      data += chunk
    }).on('end', () => {
      var url = parseDownloadURL(data)
      if(typeof url == 'undefined') getVideo(videoID)
      else downloadVideo(url, videoID, status => {
        if(status == 'failed') {
          console.log('removing file')
          fs.unlink(path.join(__dirname, `${videoID}.mp4`))
          getVideo(videoID)
        } else {
          console.log('complete')
        }
      })
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
    var stream = fs.createWriteStream(`${videoID}.mp4`)
    res.pipe(stream)
    res.on('error', () => { callback('failed') })
    res.on('end', () => { callback('complete') })
  })
}

getVideo('PO2i6icb4eY', function(status){
  console.log(status)
})
