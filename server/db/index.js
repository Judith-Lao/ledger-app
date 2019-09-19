const db = require('./database')
const User = require('./user')
const Account = require('./account')
const Transaction = require('./transaction')
// const TransactionJoin = require('./transactionJoin')

User.hasMany(Account)
Account.belongsTo(User)

// Transaction.belongsTo(Account)

Account.belongsToMany(Account, {
  as: 'action',
  through: Transaction,
  foreignKey: 'incomingAccountId',
  otherKey: 'outgoingAccountId'
})

//join table
// Transaction.belongsToMany(Transaction, {
//   as: 'action',
//   through: 'conversion',
//   foreignKey: 'incomingAccountId',
//   otherKey: 'outgoingAccountId'
//   })

module.exports = {
  db,
  User,
  Account,
  Transaction
}
