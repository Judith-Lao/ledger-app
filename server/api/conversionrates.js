const router = require('express').Router()
const Conversionrate = require('../db/conversionrate')

router.get("/", async (req, res, next) => {
  try {
    let conversionrates = await Conversionrate.findAll()
      // where: {
      //   fromCurrencyType: "USD"//req.params.fromCurrencyType,
      //   // toCurrencyType: req.params.toCurrencyType
      // }
    // })
    res.send(conversionrates)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
