'use strict';

const Sequelize = require('sequelize');
const db = require('./database');

const Conversionrate = db.define('conversionrate', {
  fromCurrencyType: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  toCurrencyType: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  rate: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

module.exports = Conversionrate;
