'use strict'

process.title = 'clean-up'

const exec = require('child_process').exec

function remove(path) {
    var cmd = `rm ${path}`
    exec(cmd)
}

exports.remove = remove