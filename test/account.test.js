/* eslint-env mocha, chai */

const {expect} = require('chai')
const sinon = require('sinon')
const supertest = require('supertest')
const app = require('../server/index')
const agent = supertest.agent(app)
const seed = require('../bin/seed')
const {db, User, Account, IncomingTransaction,
   OutgoingTransaction, Transfer} = require('../server/db')

describe("Accounts", () => {
  beforeEach(async() => await seed())
  describe("account model has column definitions and default values", () => {
    it("has a type and amount column", async () => {
      const newAccount = await Account.create({
        type: "USD",
        amount: 200
      })
      expect(newAccount.type).to.equal("USD")
      expect(newAccount.amount).to.equal(200)
    })
    it("if not given an amount, will default to 0 in database", async () => {
      const newAccount = await Account.create({
        type: "EUR"
      })
      expect(newAccount.type).to.equal("EUR")
      expect(newAccount.amount).to.equal(0)
    })
  })

  describe("/accounts", () => {
    it("sends all accounts", () => {
      return agent
        .get('/api/accounts')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array')
          expect(res.body.some(account => account.type === "USD")).to.equal(true)
          expect(res.body).to.have.length(3)
          expect(res.body[0].amount).to.equal(2000)
        })
    })
    it("can add an account given a type of currency and amount", () => {
      return agent
        .post('/api/accounts')
        .send({
          type: "BRL",
          amount: 5000
        })
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object')
          expect(res.body.type).to.equal("BRL")
          expect(res.body.amount).to.equal(5000)
        })
    })
    it("can add an account even without an amount, with a default of 0", () => {
      return agent
        .post('/api/accounts')
        .send({
          type: "BRL"
        })
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('object')
          expect(res.body.type).to.equal("BRL")
          expect(res.body.amount).to.equal(0)
        })
    })
  })
})
