const router = require('express').Router()
const IncomingTransaction = require('../db/incomingTransaction')
const OutgoingTransaction = require('../db/outgoingTransaction')

router.get("/", async (req, res, next) => {
  try {
    let incomingTransactions = await IncomingTransaction.findAll()
    res.send(incomingTransactions)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
