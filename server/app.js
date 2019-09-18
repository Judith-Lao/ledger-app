'use strict'

const {db} = require('./db')
const app = require('./index')
const PORT = 8080

db.sync().then(() => {
  console.log('database synced!')
  app.listen(PORT, () => console.log(`server on port ${PORT}`))
})
