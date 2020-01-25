'use strict';

const Sequelize = require('sequelize');
const db = require('./database');

const Outgoing = db.define('outgoing', {
  amount: {
    type: Sequelize.STRING,
  },
  isTransfer: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = Outgoing;
