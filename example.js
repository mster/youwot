'use strict'

const youwot = require('../youwot')

var videoId = 'cwQgjq0mCdE'
var audioId = 'dP9Wp6QVbsk'

youwot.replaceAudioFromVideo(videoId, audioId, log)

function log(path, err){
    if(err) return console.error(`An error happened: ${err}`)
    console.log(`Completed! Video path: ${path}`)
}