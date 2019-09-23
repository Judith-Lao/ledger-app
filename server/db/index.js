const db = require('./database')
const User = require('./user')
const Account = require('./account')
const IncomingTransaction = require('./incomingTransaction')
const OutgoingTransaction = require('./outgoingTransaction')
const Transfer = require('./transfer')
const Conversionrate = require('./conversionrate')

User.hasMany(Account)
Account.belongsTo(User)

IncomingTransaction.belongsTo(Account)
OutgoingTransaction.belongsTo(Account)

//join table
//belongs to Many so you can use a join table, even though it's only one to one
IncomingTransaction.belongsToMany(OutgoingTransaction, {through: 'transfer', foreignKey: 'incomingTransactionId'})
OutgoingTransaction.belongsToMany(IncomingTransaction, {through: 'transfer', foreignKey: 'outgoingTransactionId'})

module.exports = {
  db,
  User,
  Account,
  IncomingTransaction,
  OutgoingTransaction,
  Transfer,
  Conversionrate
}
