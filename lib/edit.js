'use strict'

const debug = require('util').debuglog('healthbars')
const formatter = require('../util/format')
const downloader = require('./download')

var ffmpeg = require('fluent-ffmpeg')

module.exports.replaceAudioFromVideo = replaceAudioFromVideo

function replaceAudioFromVideo(video_id, audio_id, fn) {
  fetchMedia(video_id, audio_id, (video_ext, audio_ext) => {
    if(!video_ext || !audio_ext) fn('Error: fetching media failed - check input ids')
    mergeMedia(video_id, ext1, audio_id, ext2, fn)
  })
}

function mergeMedia(video_id, video_ext, audio_id, audio_ext, fn) {
  spliceMedia(video_id, video_ext, 'video', err => {
    if(err) fn('Error: splicing video failed')

    spliceMedia(audio_id, audio_ext, 'audio', err => {
      if(err) fn('Error: splicing audio failed')

      var nonce = formatter.nonce()
      debug(`Splicing completed, generating nonce: ${nonce}`)
  
      var videoPath = formatter.formatTempPath(video_id, 'mp4'),
          audioPath = formatter.formatTempPath(audio_id, 'mp3'),
          renderPath = formatter.formatRenderPath(nonce, 'mp4')
      
      var render = ffmpeg()
  
      render.input(videoPath)
      render.addInput(audioPath)
  
      renderMedia(render, renderPath, fn)
    })
  })

}

function spliceMedia(id, ext, option, fn) {
  var source_path = formatter.formatWritePath(id, ext)

  if(source_path) {
    if(option == 'audio') {
      var renderPath = formatter.formatTempPath(id, 'mp3')

      var render = ffmpeg()
      render.input(source_path).withNoVideo()
  
      renderMedia(render, renderPath, fn)
    }
    if(option == 'video') {
      var renderPath = formatter.formatTempPath(id, 'mp4')

      var render = ffmpeg()
      render.input(source_path).withNoAudio()
  
      renderMedia(render, renderPath, fn)
    }
  }

  else {
    debug(`Error: splice ${option} failed - invalid source path`)
  }
}

function renderMedia(renderObj, renderPath, fn) {
  renderObj.saveToFile(renderPath)
  .on('start', function(cmd) {
    debug(`BEGIN RENDER:\n${cmd}`);
  })
  .on('progress', function(progress) {
    debug(progress)
  })
  .on('end', function() {
    debug('file has been converted succesfully');
    fn(renderPath)
  })
  .on('error', function(err) {
    debug(`an error happened: ${err.message}`)
    fn(`Merging failed: ${err.message}`)
  })
}

function fetchMedia(video_id, audio_id, fn) {
  debug('Fetching media...')

  downloader.getVideo(video_id, res => {
    if(!res) fn(null)
    
    var video_ext = res
    downloader.getVideo(audio_id, res => {
      if(!res) fn(null)

      var audio_ext = res
      fn(video_ext, audio_ext)
    })
  })
}