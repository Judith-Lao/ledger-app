const Sequelize = require('sequelize')
const db = require('./database')

const Transfer = db.define('transfer', {
  isConversion: {
    type: Sequelize.BOOLEAN
    }
})

module.exports = Transfer
