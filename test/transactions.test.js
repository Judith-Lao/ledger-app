/* eslint-env mocha, chai */

const {expect} = require('chai')
const sinon = require('sinon')
const supertest = require('supertest')
const app = require('../server/index')
const agent = supertest.agent(app)
const seed = require('../bin/seed')
const {db, User, Account, IncomingTransaction,
   OutgoingTransaction, Transfer} = require('../server/db')

describe("Transactions", () => {
  // beforeEach(async() => await seed())

  describe("post request for incoming transactions", () => {
    it("prior to deposit, account with id 1 has 2000", () => {
      return agent
        .get('/api/accounts')
        .expect(200)
        .then((res) => {
          expect(console.log(res.body.filter(account => account.id === 1 && account.amount === "2000")[0]))
        })
    })
    it("sends request in post request and responds with the incoming transaction", async() => {
      //error was from const response = await agent, you want to return agent
      return agent
        .post('/api/transactions/incoming')
        .send({
          accountId: 1,
          isTransfer: false,
          amount: "1000"
        })
        .expect(201)
        .then((res) => {
          expect(res.body.accountId).to.equal(1)
          expect(res.body.incomingAmount).to.equal("1000")
        })
    })

    it("documents the incoming transaction in the transactions table", async() => {
      const createdTransaction = await IncomingTransaction.findById(1)
      expect(createdTransaction.incomingAmount).to.equal("1000");
    })

    it("after deposit, account with id 1 has amount 3000", async() => {
      const account = await Account.findById(1)
      expect(account.amount).to.equal("3000");
    })

  describe("get request for incoming transactions", () => {
    it("sends all incoming transactions, which should be 1000", () => {
      return agent
        .get('/api/transactions/incoming')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array')
          expect(res.body.some(transaction => transaction.incomingAmount === "1000")).to.equal(true)
          expect(res.body).to.have.length(1)
          expect(res.body[0].incomingAmount).to.equal("1000")
        })
    })
    it("populates the account information for the incoming transaction (eager loading)", () => {
      return agent
        .get('/api/transactions/incoming')
        .expect(200)
        .then((res) => {
          expect(res.body[0].account).to.exist
        })
    })
  })


})
})
