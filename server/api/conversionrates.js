const router = require('express').Router()
const Conversionrate = require('../db/conversionrate')

router.get("/", async (req, res, next) => {
  try {
    let conversionrate = await Conversionrate.findOne({
      where: {
        fromCurrencyType: req.query.fromCurrencyType,
        toCurrencyType: req.query.toCurrencyType
      }
    })

    res.send(conversionrate)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
