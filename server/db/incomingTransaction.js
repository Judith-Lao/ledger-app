'use strict';

const Sequelize = require('sequelize');
const db = require('./database');

const Incoming = db.define('incoming', {
  amount: {
    type: Sequelize.STRING
  },
  isTransfer: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = Incoming;
