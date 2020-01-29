const router = require('express').Router()
const Account = require('../db/account')
const Incoming = require('../db/incomingTransaction')
const Outgoing = require('../db/outgoingTransaction')
const Transfer = require('../db/transfer')
const Sequelize = require('sequelize');
const {db} = require('../db');

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
    amount: req.body.amount
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

router.get("/transfer", async (req, res, next) => {
  try {
    const JoinTable = 'SELECT transfers.id as id, transfers."createdAt" as thedate, incomings.id as intoAccountId,incomings.amount as incoming_amt,outgoings.id as fromAccountId,outgoings.amount as outgoing_amt from transfers JOIN incomings ON incomings.id="incomingId" JOIN outgoings ON outgoings.id="outgoingId"'
    const [results, metadata] = await db.query(JoinTable)
    res.send(results)
    // let allTransfers = await Transfer.findAll({
    //   include: [
    //     {model: Outgoing},
    //     {model: Incoming}
    //   ]})
    // res.send(allTransfers)
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
