'use strict'

const edit = require('./lib/edit')
const cleanUp = require('./util/clean-up')
const format = require('./util/format')

exports.create = create

function create() {
    return new YouWot()
}

class YouWot {
    constructor() {
        require('./util/build-dir').buildDirectories()
    }

    replaceAudioFromVideo(videoId, audioId, fn) {
        edit.replaceAudioFromVideo(videoId, audioId, (path, err) => {
            // remove download files
            cleanUp.remove(format.formatWritePath(videoId, '*'))
            cleanUp.remove(format.formatWritePath(audioId, '*'))

            //remove temp files
            cleanUp.remove(format.formatTempPath(videoId, '*'))
            cleanUp.remove(format.formatTempPath(audioId, '*'))

            if(err) fn(err)
            else fn(path)
        })
    }
}
