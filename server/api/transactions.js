const router = require('express').Router()
const Account = require('../db/account')
const Incoming = require('../db/incomingTransaction')
const Outgoing = require('../db/outgoingTransaction')
const Transfer = require('../db/transfer')

//these API routes are all mounted on api/transactions

router.get("/incoming", async (req, res, next) => {
  try {
    // let allIncoming = Incoming.findAll()
    let allIncoming = await Incoming.findAll({
      include: [{
        model: Account,
        where: {userId: 1}
      }]
    })
    res.send(allIncoming)
  } catch (error) {
    console.error(error)
  }
})

router.post("/incoming", async (req, res, next) => {
  try {
    //documents that you've deposited something in transactions
    let incoming = await Incoming.create({
    accountId: req.body.accountId,
    isTransfer: req.body.isTransfer,
    amount: req.body.amount
    })
    //reflects this deposit in your account balance
    let account = await Account.findById(req.body.accountId)
    let currentBalance = account.amount
    await account.update({amount: Number(currentBalance)+Number(req.body.amount)})
    res.status(201).send(incoming)
  } catch (error) {
    console.error(error)
  }
})

router.get("/outgoing", async (req, res, next) => {
  try {
    let allOutgoing = await Outgoing.findAll({
      include: [{
        model: Account,
        where: {userId: 1}
      }]
    })
    res.send(allOutgoing)
  } catch (error) {
    console.error(error)
  }
})

router.post("/outgoing", async (req, res, next) => {
  try {
    //documents that you've withdrawn something in transactions
    await Outgoing.create({
    accountId: req.body.accountId,
    isTransfer: req.body.isTransfer,
    outgoing: req.body.amount
    })
    //reflects this withdrawal in your account balance
    let account = await Account.findById(req.body.accountId)
    let currentBalance = account.amount
    await account.update({amount: Number(currentBalance)-Number(req.body.amount)})
    res.status(201).send(account)
  } catch (error) {
    console.error(error)
  }
})


//not done
const JoinTable = "SELECT incomingTransactionId, incoming.amount as incoming_amt,incoming.currency as incoming_cur,outgoing_id,outgoing.amount as outgoing_amt,outgoing.currency as outgoing_cur FROM incoming_outgoing JOIN incoming ON incoming.id=incoming_outgoing.incoming_id JOIN outgoing ON incoming_outgoing.outgoing_id = outgoing.id"

router.get("/transfer", async (req, res, next) => {
  try {
    let [results, meta] = sequelize.query(JoinTable)
    res.send(results)
  } catch (error) {
    console.error(error)
  }
})

router.post("/transfer", async (req, res, next) => {
  try {
    await Transfer.create({
      isConversion: req.body.isConversion,
      outgoingId: req.body.outgoingTransactionId,
      incomingId: req.body.incomingTransactionId
    })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
