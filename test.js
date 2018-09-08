'use strict'

const downloader = require('./lib/download.js')
const healthbars = require('./lib/healthbars')

var _video = 'gPbVRpRgHso'
var _audio = 'rY-FJvRqK0E'
downloader.getVideo(_video, (status) => {
    downloader.getVideo(_audio, (status) => {
        healthbars.mergeMedia(_video,_audio)
    })
})
