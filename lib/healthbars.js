'use strict'

const fs = require('fs')
const path = require('path')
const debug = require('util').debuglog('healthbars')
const child = require('child_process')
const formatter = require('../util/format')
const downloader = require('./download')

var ffmpeg = require('fluent-ffmpeg')

module.exports.brewPotion = brewPotion

function brewPotion(video_id, audio_id, fn) {
  fetchMedia(video_id, audio_id, res => {
    if(res) mergeMedia(video_id, audio_id, fn)
  })
}

function fetchMedia(video_id, audio_id, fn) {
  downloader.getVideo(video_id, checkVideo)

  function checkVideo(status) {
    debug('checking video')
    if(status) {
      tasteTest(video_id, res => {
        if(!res) downloader.getVideo(video_id, checkVideo)
        else downloader.getVideo(audio_id, checkAudio)
      })
    }
    else downloader.getVideo(video_id, checkVideo)
  }

  function checkAudio(status) {
    debug('checking audio')
    if(status) {
      tasteTest(audio_id, res => {
        if(!res) downloader.getVideo(audio_id, checkAudio)
        else fn(200)
      })
    } 
    else downloader.getVideo(audio_id, checkAudio)
  }
}

function tasteTest(media_id, fn) {
  var video_path = formatter.formatVideoPath(media_id)
  ffmpeg(video_path)
  .size('1x1')
  .videoBitrate('1')
  .on('end', () => {
    debug('Yum!')
    fn(200)
  })
  .on('error', function(err) {
    debug('Yuck! ' + err.message)
    fn(null)
  })
  .run()
}

function mergeMedia(video_id, audio_id, fn) {

  var video_path = formatter.formatVideoPath(video_id)
  var audio_path = formatter.formatVideoPath(audio_id)

  var nonce = formatter.nonce()

  if(video_path && audio_path) {
    var render = ffmpeg()
    .input(video_path)
    .withNoAudio()

    .input(audio_path)
    .withNoVideo()

    .on('end', function() {
      debug('file has been converted succesfully');
      fn('complete')
    })
    .on('error', function(err) {
      debug('an error happened: ' + err.message)
      fn(`Merging failed: ${err.message}`)
    })
    .mergeToFile(`./_render_cache/${nonce}.mp4`)
  } else {

  }
}