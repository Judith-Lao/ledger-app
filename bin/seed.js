"use strict";

const { db, Account, IncomingTransaction, OutgoingTransaction, User, Conversionrate } = require("../server/db");

async function seed() {
  await db.sync({ force: true })

  const users = await Promise.all([
    User.create({
      email: "judith@email.com",
      password: "123"
    })
  ]);

  const Accounts = await Promise.all([
    Account.create({
      id: 1, //if you don't specify id, these are not consistent when running transactions test
      type: "USD",
      amount: "2000",
      userId: 1
    }),
    Account.create({
      id: 2,
      type: "EUR",
      amount: "100",
      userId: 1
    }),
    Account.create({
      id: 3,
      type: "USD",
      userId: 1
    })
  ])

  // const Transactions = await Promise.all([
  //   IncomingTransaction.create({
  //     id: 1,
  //     incomingAmount: "5",
  //     isTransfer: true,
  //     accountId: 2
  //   }),
  //   IncomingTransaction.create({
  //     id: 2,
  //     incomingAmount: "10",
  //     isTransfer: false,
  //     accountId: 1
  //   }),
  //   OutgoingTransaction.create({
  //     id: 3,
  //     outgoingAmount: "7.20",
  //     isTransfer: true,
  //     accountId: 1
  //   })
  // ])
  //can't post from transactions test because it's saying there is a duplicate incoming transactions primary key, but if you send ({id: 4}) it still doesn't work, so i got rid of the incoming transactions from the seed file

  const rates = await Promise.all([
    Conversionrate.create({
      fromCurrencyType: "USD",
      toCurrencyType: "EUR",
      rate: "0.91"
    }),
    Conversionrate.create({
      fromCurrencyType: "EUR",
      toCurrencyType: "USD",
      rate: "1.10"
    }),
    Conversionrate.create({
      fromCurrencyType: "USD",
      toCurrencyType: "BRL",
      rate: "4.15"
    }),
    Conversionrate.create({
      fromCurrencyType: "BRL",
      toCurrencyType: "USD",
      rate: "0.24"
    }),
    Conversionrate.create({
      fromCurrencyType: "USD",
      toCurrencyType: "INR",
      rate: "71.20"
    }),
    Conversionrate.create({
      fromCurrencyType: "INR",
      toCurrencyType: "USD",
      rate: "0.014"
    }),
    Conversionrate.create({
      fromCurrencyType: "EUR",
      toCurrencyType: "BRL",
      rate: "4.57"
    }),
    Conversionrate.create({
      fromCurrencyType: "BRL",
      toCurrencyType: "EUR",
      rate: "0.22"
    }),
    Conversionrate.create({
      fromCurrencyType: "EUR",
      toCurrencyType: "INR",
      rate: "78.43"
    }),
    Conversionrate.create({
      fromCurrencyType: "INR",
      toCurrencyType: "EUR",
      rate: "0.013"
    }),
    Conversionrate.create({
      fromCurrencyType: "BRL",
      toCurrencyType: "INR",
      rate: "17.16"
    }),
    Conversionrate.create({
      fromCurrencyType: "INR",
      toCurrencyType: "BRL",
      rate: "0.059"
    })
  ])
  // console.log(`seeded everything successfully`);
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

module.exports = seed;
