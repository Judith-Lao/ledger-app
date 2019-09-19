'use strict';

const Sequelize = require('sequelize');
const db = require('./database');

const IncomingTransaction = db.define('incoming transaction', {
  incomingAmount: {
    type: Sequelize.INTEGER,
  },
  isConversion: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = IncomingTransaction;
