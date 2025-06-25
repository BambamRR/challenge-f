const router = require('express').Router()

//imported routes to use on project
const product = require('./product')
const coupon = require('./coupon')

//routes
router.use('/products', product)
router.use('/coupon', coupon)

module.exports = router