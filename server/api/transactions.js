const router = require('express').Router()
const Transaction = require('../db/transaction')

router.get("/", async (req, res, next) => {
  try {
    let allTransactions = await Transaction.findAll()
    res.send(allTransactions)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
