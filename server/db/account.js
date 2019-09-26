'use strict';

const Sequelize = require('sequelize');
const db = require('./database');

const Account = db.define('account', {
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  amount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

module.exports = Account;
