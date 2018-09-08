'use strict'

const downloader = require('./lib/download.js')
const healthbars = require('./lib/healthbars')

var _video = 'nbCo3_7VdwE'
var _audio = 'rY-FJvRqK0E'

healthbars.brewPotion(_video,_audio,log)

function log(status){ console.log(status) }