const CouponService = require("../services/CouponService");
const couponService = new CouponService();

class CouponController {
  static async createCoupon(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body is missing." });
      }

      const coupon = await couponService.createCoupon(req.body);
      res.setHeader("Location", `/coupons/${coupon.id}`);
      res.status(201).json(coupon);
    } catch (error) {
      if (error.status === 400 || error.status === 409) {
        return res.status(error.status).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  static async findCouponById(req, res) {
    try {
      const coupon = await couponService.findCouponById(req.params);
      res.status(200).json(coupon);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async findAllCoupon(req, res) {
    try {
      const coupon = await couponService.findAllCoupons(req.params);
      res.status(200).json(coupon);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async findCouponByCode(req, res) {
    try {
      const coupon = await couponService.findCouponByCode(req.params);
      res.status(200).json(coupon);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = CouponController;
