const ProductController = require('../controllers/ProductController')

const router = require('express').Router()

router
.post('/', ProductController.createProduct)
.get('/:id', ProductController.findProductById)


module.exports = router