const ProductService = require("../services/ProductService");
const productService = new ProductService();

class ProductController {
  static async createProduct(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).send({ message: "Request body is missing." });
      }
      const product = await productService.createProduct(req.body);
      res.status(201).send(product);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
}

module.exports = ProductController;
