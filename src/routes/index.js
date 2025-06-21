const router = require('express').Router()

//imported routes to use on project
const product = require('./product')

//routes
router.use('/products', product)

module.exports = router