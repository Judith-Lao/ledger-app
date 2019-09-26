'use strict';

const Sequelize = require('sequelize');
const db = require('./database');

const OutgoingTransaction = db.define('outgoing transaction', {
  outgoingAmount: {
    type: Sequelize.STRING,
  },
  isTransfer: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = OutgoingTransaction;
