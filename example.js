'use strict'

const youwot = require('../youwot')

var yw = youwot.create()

var videoId = 'Yy-hwVWAq_Q'
var audioId = 'dP9Wp6QVbsk'

yw.replaceAudioFromVideo(videoId, audioId, log)

function log(path, err){
    if(err) return console.error(`An error happened: ${err}`)
    console.log(`Task completed! New video path: ${path}`)
}