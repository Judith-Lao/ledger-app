const router = require('express').Router()
const Account = require('../db/account')
const IncomingTransaction = require('../db/incomingTransaction')
const OutgoingTransaction = require('../db/outgoingTransaction')

router.get("/incoming", async (req, res, next) => {
  try {
    let allIncoming = await IncomingTransaction.findAll()
    res.send(allIncoming)
  } catch (error) {
    console.error(error)
  }
})

router.post("/incoming", async (req, res, next) => {
  try {
    //documents that you've deposited something in transactions
    await IncomingTransaction.create({
    accountId: req.body.account,
    isConversion: req.body.isConversion,
    incomingAmount: req.body.amount
    })
    //reflects this deposit in your account balance
    let account = await Account.findById(req.body.account)
    let currentBalance = account.amount
    await account.update({amount: Number(currentBalance)+Number(req.body.amount)})
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
  }
})

router.get("/outgoing", async (req, res, next) => {
  try {
    let allOutgoing = await OutgoingTransaction.findAll()
    res.send(allOutgoing)
  } catch (error) {
    console.error(error)
  }
})

router.post("/outgoing", async (req, res, next) => {
  try {
    //documents that you've withdrawn something in transactions
    await OutgoingTransaction.create({
    accountId: req.body.account,
    isConversion: false,
    outgoingAmount: req.body.amount
    })
    //reflects this withdrawal in your account balance
    let account = await Account.findById(req.body.account)
    let currentBalance = account.amount
    await account.update({amount: Number(currentBalance)-Number(req.body.amount)})
    res.sendStatus(200)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
