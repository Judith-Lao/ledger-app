'use strict';

const Sequelize = require('sequelize');
const db = require('./database');

const Transaction = db.define('transaction', {
  incomingAmount: {
    type: Sequelize.INTEGER,
  },
  outgoingAmount: {
    type: Sequelize.INTEGER
  }
});

module.exports = Transaction;
