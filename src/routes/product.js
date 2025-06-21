const ProductController = require('../controllers/ProductController')

const router = require('express').Router()

router.post('/', ProductController.createProduct)

module.exports = router