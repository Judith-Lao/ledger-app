const db = require('./database')
const User = require('./user')
const Account = require('./account')
const Incoming = require('./incomingTransaction')
const Outgoing = require('./outgoingTransaction')
const Transfer = require('./transfer')
const Conversionrate = require('./conversionrate')

User.hasMany(Account)
Account.belongsTo(User)

Incoming.belongsTo(Account)
Outgoing.belongsTo(Account)

//join table
//belongs to Many so you can use a join table, even though it's only one to one
// Incoming.belongsToMany(Outgoing, {through: 'transfer', foreignKey: 'incomingTransactionId'})
// Outgoing.belongsToMany(Incoming, {through: 'transfer', foreignKey: 'outgoingTransactionId'})
Transfer.belongsTo(Incoming)
Transfer.belongsTo(Outgoing)



module.exports = {
  db,
  User,
  Account,
  Incoming,
  Outgoing,
  Transfer,
  Conversionrate
}
