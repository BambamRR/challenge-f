const router = require('express').Router()
const CouponController = require('../controllers/CouponController')

router
        .post('/', CouponController.createCoupon)
        // .get('/:id', CouponController.findCouponById)
        .get('/:code', CouponController.findCouponByCode)
        .get('/', CouponController.findAllCoupon)


module.exports = router