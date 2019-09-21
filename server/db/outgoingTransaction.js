'use strict';

const Sequelize = require('sequelize');
const db = require('./database');

const OutgoingTransaction = db.define('outgoing transaction', {
  outgoingAmount: {
    type: Sequelize.INTEGER,
  },
  isTransfer: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = OutgoingTransaction;
