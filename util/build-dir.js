'use strict'

process.title = 'build-dir'

const exec = require('child_process').exec
const path = require('path')

function buildDirectories() {
    // make ./youwot_cache
    var cmd = `mkdir ${path.join(__dirname, '../','youwot_cache')}`
    exec(cmd)

    // make ./youwot_cache/download
    exec(cmd + '/download')

    // make ./youwot_cache/download
    exec(cmd + '/temp')

    // make ./youwot_cache/download
    exec(cmd + '/render')
}

module.exports.buildDirectories = buildDirectories