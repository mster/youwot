'use strict'

const router = require('express').Router()

router.get('/', (req,res) => {
  res.send('hello there')
  res.end()
})

router.get('/foo', (req,res) => {
  response.render('index', {
    data: null
  },
  function(err, html){
    if(err) debug(err)
    response.status(200).send(html)
  });
})

module.exports = router
