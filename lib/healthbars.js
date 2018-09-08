'use strict'

const fs = require('fs')
const path = require('path')
const debug = require('util').debuglog('healthbars')
const child = require('child_process')
const formatter = require('../util/format')

var ffmpeg = require('fluent-ffmpeg')

function isAlive(video_id){
  var video_path = path.join(__dirname, `../video_cache/${video_id}.mp4`)

  ffmpeg(video_path)
  .native()
  .videoBitrate(1)
  .on('data', (data) => {
    console.log('ping')
  })
  .on('end', function() {
    console.log('file has been converted succesfully');
  })
  .on('error', function(err) {
    console.log('an error happened: ' + err.message);
  })
  .save('./video_cache/save.mp4')
}

module.exports.mergeMedia = mergeMedia

function mergeMedia(video_id, audio_id) {
  var nonce = formatter.nonce()

  var video_path = formatter.formatVideoPath(video_id)
  var audio_path = formatter.formatVideoPath(audio_id)

  if(!video_path) debug('ERR: no video_path')
  if(!audio_path) debug('ERR: no audio_path')

  var video_stream = fs.createReadStream(video_path)
  var audio_stream = fs.createReadStream(audio_id)

  if(video_path && audio_path) {
    var render = ffmpeg()
    .input(video_stream)
    .withNoAudio()

    .input(audio_stream)
    .withNoVideo()

    .on('end', function() {
      console.log('file has been converted succesfully');
    })
    .on('error', function(err) {
      console.log('an error happened: ' + err.message);
    })
    .save(`./_render_cache/${nonce}.mp4`)
  }
}

function redownload(video_id) {
  
}

module.exports.isAlive = isAlive
