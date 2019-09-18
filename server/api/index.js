'use strict'

const router = require('express').Router()

// router.use('/accounts', require('./accounts'))
// router.use('/transactions', require('./transactions'))

router.use((req, res, next) => {
  const err = new Error('API route not found!')
  err.status = 404
  next(err)
})

module.exports = router
