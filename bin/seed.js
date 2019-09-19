"use strict";

const { db, Account, Transaction, User } = require("../server/db");

async function seed() {
  await db.sync({ force: true });
  console.log("db synced!");

  const users = await Promise.all([
    User.create({
      email: "judith@email.com",
      password: "123"
    })
  ]);
  console.log(`seeded ${users.length} users`);

  const Accounts = await Promise.all([
    Account.create({
      type: "USD",
      amount: 20,
      userId: 1
    }),
    Account.create({
      type: "EUR",
      amount: 0,
      userId: 1
    })
  ])
  console.log(`seeded ${Accounts.length} accounts`);

  // const Transactions = await Promise.all([
  //   Transaction.create({
  //     incomingAmount: 5,
  //     outgoingAmount: null,
  //     accountId: 2
  //   }),
  //   Transaction.create({
  //     incomingAmount: null,
  //     outgoingAmount: 7,
  //     accountId: 1
  //   })
  // ]);
  // console.log(`seeded ${Transactions.length} transactions`);

  console.log(`seeded everything successfully`);
}

// separate the `seed` function from the `runSeed` function.
// so that we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
  }
}

if (module === require.main) {
  runSeed();
}

//for ./seed.spec.js later
module.exports = seed;
