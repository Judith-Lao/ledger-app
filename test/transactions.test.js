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
  beforeEach(async() => await seed())

  describe("get request for incoming transactions", () => {
    it("sends all incoming transactions", () => {
      return agent
        .get('/api/transactions/incoming')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array')
          expect(res.body.some(transaction => transaction.incomingAmount === 10)).to.equal(true)
          expect(res.body).to.have.length(2)
          expect(res.body[0].incomingAmount).to.equal(5)
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

  describe("post request for incoming transactions", () => {
    xit("prior to deposit, account with id 1 has 2000", () => {
      return agent
        .get('/api/accounts')
        .expect(200)
        .then((res) => {
          expect(res.body[0].type).to.equal("EUR")
          expect(res.body[0].amount).to.equal(1000)
        })
    })
    xit("documents the incoming transaction in the transactions table", async() => {
      const response = await agent
        .post('/api/transactions/incoming')
        .send({
          accountId: 1,
          isTransfer: true,
          amount: 1000
        })
        .expect(201)
      const createdTransaction = await IncomingTransaction.findById(response.body.id)
      expect(createdTransaction.incomingAmount).to.equal(1000);

      const account2balance = await agent
        .get('/api/accounts')
        .expect(200)
        .then((res) => {
          expect(res.body[0].type).to.equal("EUR")
          expect(res.body[0].amount).to.equal(2000)
        })
    })
  })
})
