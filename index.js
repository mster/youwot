'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const router = require('./lib/router')

const app = express()

const PORT = process.env.PORT || 3000

app.use('/', router)

app.listen(PORT, () => {
  if(Math.random() > 0.5) console.log(`${PORT}: something need going...?`)
  else console.log(`${PORT}: work work...`)
})
