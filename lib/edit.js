'use strict'

const debug = require('util').debuglog('healthbars')
const formatter = require('../util/format')
const downloader = require('./download')

var ffmpeg = require('fluent-ffmpeg')

module.exports.replaceAudioFromVideo = replaceAudioFromVideo

// fetch, then merge media
function replaceAudioFromVideo(video_id, audio_id, fn) {
  fetchMedia(video_id, audio_id, (video_ext, audio_ext) => {
    if(!video_ext || !audio_ext) fn('Error: fetching media failed - check input ids')
    mergeMedia(video_id, video_ext, audio_id, audio_ext, fn)
  })
}

function mergeMedia(video_id, video_ext, audio_id, audio_ext, fn) {
  // media has been fetched, begin by removing audio from video 
  spliceMedia(video_id, video_ext, 'video', (path, err) => {
    if(err) fn('Error: splicing video failed')
    var videoPath = path

    // now removed video from audio
    spliceMedia(audio_id, audio_ext, 'audio', (path, err) => {
      if(err) fn('Error: splicing audio failed')

      // create 'nonce' for filename
      var audioPath = path
      var nonce = formatter.nonce()
      var renderPath = formatter.formatRenderPath(nonce, 'mp4')
      debug(`Splicing completed, generating nonce: ${nonce}`)

      // create render object and add spliced video/audio sources
      var render = ffmpeg()
      render.input(videoPath)
      render.addInput(audioPath)
  
      // carry out render
      renderMedia(render, renderPath, fn)
    })
  })

}

function spliceMedia(id, ext, option, fn) {
  // obtain media source
  var sourcePath = formatter.formatWritePath(id, ext)

  if(sourcePath) {
    // remove video from audio
    if(option == 'audio') {
      var renderPath = formatter.formatTempPath(id, 'mp3')

      // create render object without video
      var render = ffmpeg()
      render.input(sourcePath).withNoVideo()
  
      renderMedia(render, renderPath, fn)
    }

    // remove audio from video
    if(option == 'video') {
      var renderPath = formatter.formatTempPath(id, 'mp4')

      // create render object without audio
      var render = ffmpeg()
      render.input(sourcePath).withNoAudio()
  
      // carry out render
      renderMedia(render, renderPath, fn)
    }
  }

  // passed parameters are invalid
  else {
    debug(`Error: splice ${option} failed - invalid source path`)
  }
}

function renderMedia(renderObj, renderPath, fn) {

  // begin render on media
  renderObj.saveToFile(renderPath)

  // start render by ffmpeg command
  .on('start', function(cmd) {
    debug(cmd);
  })

  // log render progress
  .on('progress', function(progress) {
    debug(progress)
  })

  // successful render
  .on('end', function() {
    debug('file has been converted succesfully');
    fn(renderPath, null)
  })

  // render error
  .on('error', function(err) {
    debug(`an error happened: ${err.message}`)
    fn(null, `Merging failed: ${err.message}`)
  })
}

function fetchMedia(videoId, audioId, fn) {

  debug('Fetching media...')

  // download video
  downloader.getVideo(videoId, res => {
    if(!res) fn(null)

    // collect video file extension from url
    var videoExt = res

    // download audio
    downloader.getVideo(audioId, res => {
      if(!res) fn(null)

      // collect audio file extension from url
      var audioExt = res

      // downloads, pass both extensions
      fn(videoExt, audioExt)
    })
  })
}