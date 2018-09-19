'use strict'

const edit = require('./lib/edit')

exports.create = create

function create() {
    return new YouWot()
}

class YouWot {
    constructor() {
        require('./util/build-dir').buildDirectories()
    }

    replaceAudioFromVideo(videoId, audioId, fn) {
        edit.replaceAudioFromVideo(videoId, audioId, fn)
    }
}
