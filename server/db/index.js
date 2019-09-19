const db = require('./database')
const User = require('./user')
const Account = require('./account')
const IncomingTransaction = require('./incomingTransaction')
const OutgoingTransaction = require('./outgoingTransaction')

User.hasMany(Account)
Account.belongsTo(User)

IncomingTransaction.belongsTo(Account)
OutgoingTransaction.belongsTo(Account)

//join table
//belongs to Many so you can use a join table, even though it's only one to one
IncomingTransaction.belongsToMany(OutgoingTransaction, {through: 'conversion', foreignKey: 'incomingTransactionId'})
OutgoingTransaction.belongsToMany(IncomingTransaction, {through: 'conversion', foreignKey: 'outgoingTransactionId'})

module.exports = {
  db,
  User,
  Account,
  IncomingTransaction,
  OutgoingTransaction
  // conversion
}
