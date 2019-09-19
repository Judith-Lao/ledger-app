const router = require('express').Router()
const Account = require('../db/account')

router.get("/", async (req, res, next) => {
  try {
    let allAccounts = await Account.findAll()
    res.send(allAccounts)
  } catch (error) {
    console.error(error)
  }
})

router.post("/", async (req, res, next) => {
  try {
    let newAccount = await Account.create({
      type: req.body.type,
      amount: req.body.amount,
      userId: 1 //hard coded in that the account created belongs to user 1
    })
    res.send(newAccount)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
