const router = require('express').Router()
const ConversionRate = require('../db/conversionrates')

router.get("/", async (req, res, next) => {
  try {
    let conversionrates = await ConversionRate.findAll()
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
