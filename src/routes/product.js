const ProductController = require('../controllers/ProductController')

const router = require('express').Router()

router
.post('/', ProductController.createProduct)
.get('/:id', ProductController.findProductById)
.delete('/:id', ProductController.deleteProduct)
.get('/', ProductController.findAllProducts)


module.exports = router