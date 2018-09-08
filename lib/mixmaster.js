'use strict'

const healthbars = require('./healthbars')

const VIDEO = 'gPbVRpRgHso'
const AUDIO = 'ClCuyHnsKwM'

healthbars.brewPotion(VIDEO, AUDIO, (status) => {
    console.log(status)
})